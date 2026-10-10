import { seedProducts } from "@/lib/data/seed";
import type { DataSource, Table } from "@/lib/data/source";
import type { Banner, CustomOrder, Order, Product } from "@/lib/types";

// Stand-in storage: everything is kept in this browser (IndexedDB) on this computer only.
// The website cannot read it. It exists so the admin screens can be built and tried before Supabase is connected.

const databaseName = "invidzz-admin";
const storeNames = ["products", "orders", "banners", "customOrders"] as const;
type StoreName = (typeof storeNames)[number];

let opening: Promise<IDBDatabase> | null = null;

function open() {
  opening ??= new Promise<IDBDatabase>((resolve, reject) => {
    // Version 2 added customOrders. Raise the number whenever a table is added to storeNames.
    const request = indexedDB.open(databaseName, 2);
    request.onupgradeneeded = (event) => {
      // Only what is missing is created, so a browser that already has data keeps it.
      for (const name of storeNames) {
        if (!request.result.objectStoreNames.contains(name)) request.result.createObjectStore(name, { keyPath: "id" });
      }
      if (event.oldVersion < 1) {
        const products = request.transaction!.objectStore("products");
        for (const product of seedProducts) products.put(product);
      }
    };
    // Another tab still has the older version open and is holding the upgrade back.
    request.onblocked = () => {
      opening = null;
      reject(new Error("Close the other Invidzz Admin tabs, then reload this page."));
    };
    request.onsuccess = () => {
      // Lets a newer tab upgrade the storage instead of being blocked by this one.
      request.result.onversionchange = () => {
        request.result.close();
        opening = null;
      };
      resolve(request.result);
    };
    request.onerror = () => {
      opening = null;
      reject(request.error);
    };
  });
  return opening;
}

async function run<Result>(name: StoreName, mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<Result>) {
  const database = await open();
  return new Promise<Result>((resolve, reject) => {
    const transaction = database.transaction(name, mode);
    const request = action(transaction.objectStore(name));
    transaction.oncomplete = () => resolve(request.result);
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

function table<Row extends { id: string }>(name: StoreName): Table<Row> {
  return {
    list: () => run<Row[]>(name, "readonly", (store) => store.getAll()),
    save: async (row) => {
      await run(name, "readwrite", (store) => store.put(row));
    },
    remove: async (id) => {
      await run(name, "readwrite", (store) => store.delete(id));
    },
  };
}

const longestSide = 1600;

// Shrinks the photo and returns it as a data: address, which is stored inside the product or banner itself.
async function uploadImage(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, longestSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser could not read the picture.");
  // JPEG has no transparency, so see-through areas become white rather than black.
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.85);
}

export const localData: DataSource = {
  products: table<Product>("products"),
  orders: table<Order>("orders"),
  customOrders: table<CustomOrder>("customOrders"),
  banners: table<Banner>("banners"),
  uploadImage,
};
