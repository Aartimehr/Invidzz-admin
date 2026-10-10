import type { Banner, CustomOrder, Order, Product } from "@/lib/types";

// Every page talks to storage only through this contract, so the storage behind it can be replaced without touching a page.

export type Table<Row extends { id: string }> = {
  list(): Promise<Row[]>;
  // Adds the row, or replaces the one with the same id.
  save(row: Row): Promise<void>;
  remove(id: string): Promise<void>;
};

export type ImageFolder = "products" | "banners" | "designs";

export type DataSource = {
  products: Table<Product>;
  orders: Table<Order>;
  customOrders: Table<CustomOrder>;
  banners: Table<Banner>;
  // Stores the picture and returns the address to show it from.
  uploadImage(file: File, folder: ImageFolder): Promise<string>;
};
