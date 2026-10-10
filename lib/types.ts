// The shape of everything the admin stores. Each type below becomes one Supabase table with the same fields.

export type Gender = "women" | "men";
export type Collection = "exclusives" | "new-in" | "essentials";

export const genders: { id: Gender; title: string }[] = [
  { id: "women", title: "Women" },
  { id: "men", title: "Men" },
];

export const collections: { id: Collection; title: string }[] = [
  { id: "exclusives", title: "Our Exclusives" },
  { id: "new-in", title: "New In" },
  { id: "essentials", title: "Everyday Essentials" },
];

export const tones = ["sand", "rose", "blue", "olive", "clay"];
export const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];

export type Product = {
  // Also the last part of the product's address on the website (/your-styles/<id>), so it never changes after creation.
  id: string;
  name: string;
  description: string;
  // In whole rupees.
  price: number;
  // Image addresses; the first one is the photo shown on the product card.
  images: string[];
  tone: string;
  label: string;
  gender: Gender;
  collection: Collection;
  // The sizes this piece comes in, with how many of each are in stock.
  stock: { size: string; quantity: number }[];
  // Unpublished pieces stay in the admin but are hidden from the website.
  published: boolean;
  createdAt: string;
};

export const orderStatuses = [
  { id: "new", title: "New" },
  { id: "paid", title: "Payment checked" },
  { id: "dispatched", title: "Dispatched" },
  { id: "delivered", title: "Delivered" },
  { id: "cancelled", title: "Cancelled" },
] as const;

export type OrderStatus = (typeof orderStatuses)[number]["id"];

// Matches PlacedOrder in the website's lib/order.ts, plus what the owner adds while handling it.
export type Order = {
  // The order reference the customer sees, e.g. INV-AB12CD.
  id: string;
  createdAt: string;
  status: OrderStatus;
  items: { name: string; size: string; quantity: number; price: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: { name: string; phone: string; address: string; city: string; pincode: string };
  paidWith: string;
};

export const customStatuses = [
  { id: "new", title: "New" },
  { id: "quoted", title: "Price sent" },
  { id: "paid", title: "Payment checked" },
  { id: "making", title: "Being made" },
  { id: "dispatched", title: "Dispatched" },
  { id: "delivered", title: "Delivered" },
  { id: "cancelled", title: "Cancelled" },
] as const;

export type CustomStatus = (typeof customStatuses)[number]["id"];

// The same choices the customer has on the website's Try Customise page (lib/custom-order.ts there).
export const customGarments = ["T-shirt", "Shirt", "Dress", "Something else"];

// A piece the customer drew on the website's Try Customise page. Matches CustomRequest in the website's lib/custom-order.ts.
export type CustomOrder = {
  // The design reference the customer sees, e.g. CUS-AB12CD.
  id: string;
  createdAt: string;
  status: CustomStatus;
  customer: { name: string; phone: string };
  garment: string;
  fabric: string;
  size: string;
  notes: string;
  // Image address of the customer's drawing.
  design: string;
  // The price told to the customer, in whole rupees. null until a price has been sent.
  quote: number | null;
};

export const bannerPages = [
  { id: "home", title: "Home" },
  { id: "your-styles", title: "Your Styles" },
  { id: "men", title: "Men" },
  { id: "women", title: "Women" },
  // The page was renamed on the website; the id is kept so banners already saved for it stay attached.
  { id: "how-to-order", title: "Try Customise" },
  { id: "our-promises", title: "Our Promises" },
  { id: "about-us", title: "About Us" },
] as const;

export type BannerPage = (typeof bannerPages)[number]["id"];

export type Banner = {
  id: string;
  // Which website page shows this banner.
  page: BannerPage;
  image: string;
  heading: string;
  text: string;
  buttonLabel: string;
  // Where the button goes, e.g. /your-styles/women.
  buttonLink: string;
  // Only banners that are switched on appear on the website.
  active: boolean;
  createdAt: string;
};

export function totalStock(product: Product) {
  return product.stock.reduce((sum, entry) => sum + entry.quantity, 0);
}

const rupees = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function formatPrice(amount: number) {
  return rupees.format(amount);
}
