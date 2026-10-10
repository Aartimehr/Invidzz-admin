import type { CustomOrder, Order } from "@/lib/types";

// Made-up orders for previewing the Orders page. Real orders will come from the website once Supabase is connected.
const hour = 3600000;

export function sampleOrders(): Order[] {
  const now = Date.now();
  return [
    {
      id: "INV-SAMPLE1",
      createdAt: new Date(now - 2 * hour).toISOString(),
      status: "new",
      items: [{ name: "The Sunday Shirt", size: "M", quantity: 1, price: 1499 }],
      subtotal: 1499,
      shipping: 0,
      total: 1499,
      customer: { name: "Sample Customer One", phone: "9000000001", address: "12 Example Street", city: "Jaipur", pincode: "302001" },
      paidWith: "Google Pay",
    },
    {
      id: "INV-SAMPLE2",
      createdAt: new Date(now - 26 * hour).toISOString(),
      status: "paid",
      items: [
        { name: "Everyday White Tee", size: "L", quantity: 2, price: 799 },
        { name: "Black Denim Jean", size: "L", quantity: 1, price: 2499 },
      ],
      subtotal: 4097,
      shipping: 0,
      total: 4097,
      customer: { name: "Sample Customer Two", phone: "9000000002", address: "Flat 4B, Example Apartments, Sample Road", city: "Pune", pincode: "411001" },
      paidWith: "PhonePe",
    },
    {
      id: "INV-SAMPLE3",
      createdAt: new Date(now - 75 * hour).toISOString(),
      status: "dispatched",
      items: [{ name: "Daylight Dress", size: "S", quantity: 1, price: 2699 }],
      subtotal: 2699,
      shipping: 0,
      total: 2699,
      customer: { name: "Sample Customer Three", phone: "9000000003", address: "88 Example Colony", city: "Lucknow", pincode: "226001" },
      paidWith: "Paytm",
    },
  ];
}

// A stand-in for a customer's drawing: a T-shirt outline with a few scribbles in the given colour.
function sampleDrawing(fabric: string, ink: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="#fff"/><path d="M150 60Q200 100 250 60L330 90L385 190L325 225L305 190L305 450L95 450L95 190L75 225L15 190L70 90Z" fill="${fabric}" stroke="#b9b7ab" stroke-width="1.5"/><g fill="none" stroke="${ink}" stroke-width="9" stroke-linecap="round"><circle cx="200" cy="240" r="46"/><path d="M130 340q35-40 70 0t70 0"/><path d="M200 170v-22M150 190l-14-16M250 190l14-16"/></g></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// Made-up customised requests for previewing the Customised orders tab.
export function sampleCustomOrders(): CustomOrder[] {
  const now = Date.now();
  return [
    {
      id: "CUS-SAMPLE1",
      createdAt: new Date(now - 3 * hour).toISOString(),
      status: "new",
      customer: { name: "Sample Customer Four", phone: "9000000004" },
      garment: "T-shirt",
      fabric: "White",
      size: "M",
      notes: "Sun on the front, embroidered if possible.",
      design: sampleDrawing("#ffffff", "#a65e45"),
      quote: null,
    },
    {
      id: "CUS-SAMPLE2",
      createdAt: new Date(now - 50 * hour).toISOString(),
      status: "quoted",
      customer: { name: "Sample Customer Five", phone: "9000000005" },
      garment: "T-shirt",
      fabric: "Black",
      size: "L",
      notes: "",
      design: sampleDrawing("#1f1f1f", "#e0a82e"),
      quote: 1899,
    },
  ];
}
