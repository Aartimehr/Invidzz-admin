import type { Collection, Gender, Product } from "@/lib/types";

// The placeholder pieces from the website (lib/products.ts there), so the admin opens with the same catalogue.
type SiteProduct = { slug: string; name: string; description: string; price: number; image: string; tone: string; label: string; gender: Gender; collection: Collection; sizes: string[] };

const sizes = ["XS", "S", "M", "L", "XL"];

const siteProducts: SiteProduct[] = [
  { slug: "camel-wrap-coat", name: "Camel Wrap Coat", description: "A belted coat that pulls any outfit together.", price: 4999, image: "photo-1539533018447-63fcce2678e3", tone: "sand", label: "Exclusive", gender: "women", collection: "exclusives", sizes },
  { slug: "poppy-day-dress", name: "Poppy Day Dress", description: "A full skirt and a print that refuses to be quiet.", price: 2899, image: "photo-1572804013309-59a88b7e92f1", tone: "rose", label: "Exclusive", gender: "women", collection: "exclusives", sizes },
  { slug: "meadow-ruffle-blouse", name: "Meadow Ruffle Blouse", description: "Soft volume, off the shoulder, made for golden hour.", price: 2299, image: "photo-1581044777550-4cfa60707c03", tone: "rose", label: "Limited run", gender: "women", collection: "exclusives", sizes },
  { slug: "blush-longline-coat", name: "Blush Longline Coat", description: "A gentle colour for the coldest mornings.", price: 4599, image: "photo-1485462537746-965f33f7f6a7", tone: "rose", label: "Exclusive", gender: "women", collection: "exclusives", sizes },
  { slug: "sunbeam-co-ord-set", name: "Sunbeam Co-ord Set", description: "Hoodie and jogger, matched and impossible to miss.", price: 3299, image: "photo-1515886657613-9f3515b0c78f", tone: "sand", label: "Exclusive", gender: "women", collection: "exclusives", sizes },
  { slug: "stripe-wide-leg-trouser", name: "Stripe Wide-Leg Trouser", description: "A long stripe and a lot of swing.", price: 2399, image: "photo-1509631179647-0177331693ae", tone: "blue", label: "Just landed", gender: "women", collection: "new-in", sizes },
  { slug: "marigold-sweatshirt", name: "Marigold Sweatshirt", description: "Heavy cotton in the warmest colour we make.", price: 1899, image: "photo-1578587018452-892bacefd3f2", tone: "clay", label: "Just landed", gender: "women", collection: "new-in", sizes },
  { slug: "checked-overcoat", name: "Checked Overcoat", description: "An oversized check to throw over everything.", price: 4799, image: "photo-1485968579580-b6d095142e6e", tone: "blue", label: "New season", gender: "women", collection: "new-in", sizes },
  { slug: "coastline-knit", name: "Coastline Knit", description: "Colour-blocked and cosy, for windy days out.", price: 2599, image: "photo-1475180098004-ca77a66827be", tone: "sand", label: "Just landed", gender: "women", collection: "new-in", sizes },
  { slug: "seaglass-crochet-top", name: "Seaglass Crochet Top", description: "Hand-finished crochet for the hottest days.", price: 1299, image: "photo-1469334031218-e382a71b716b", tone: "olive", label: "New colour", gender: "women", collection: "new-in", sizes },
  { slug: "the-sunday-shirt", name: "The Sunday Shirt", description: "An easy, airy layer for slow mornings and long lunches.", price: 1499, image: "photo-1598554747436-c9293d6a588f", tone: "sand", label: "Just landed", gender: "women", collection: "essentials", sizes },
  { slug: "everywhere-trouser", name: "Everywhere Trouser", description: "A relaxed shape with a little more room to roam.", price: 2199, image: "photo-1529139574466-a303027c1d8b", tone: "olive", label: "Bestseller", gender: "women", collection: "essentials", sizes },
  { slug: "daylight-dress", name: "Daylight Dress", description: "One-and-done dressing, with a little room to play.", price: 2699, image: "photo-1496747611176-843222e1e57c", tone: "rose", label: "Limited run", gender: "women", collection: "essentials", sizes },
  { slug: "weekend-graphic-tee", name: "Weekend Graphic Tee", description: "A soft tee with a print that starts conversations.", price: 999, image: "photo-1554568218-0f1715e72254", tone: "blue", label: "Bestseller", gender: "women", collection: "essentials", sizes },
  { slug: "shoreline-poncho", name: "Shoreline Poncho", description: "Open-knit and fringed, for after the beach.", price: 1799, image: "photo-1434389677669-e08b4cac3105", tone: "sand", label: "Made to keep", gender: "women", collection: "essentials", sizes },
  { slug: "rider-leather-jacket", name: "Rider Leather Jacket", description: "A biker cut that gets better every year you own it.", price: 6999, image: "photo-1487222477894-8943e31ef7b2", tone: "clay", label: "Exclusive", gender: "men", collection: "exclusives", sizes },
  { slug: "tan-unstructured-blazer", name: "Tan Unstructured Blazer", description: "Tailoring without the stiffness.", price: 4499, image: "photo-1552374196-1ab2a1c593e8", tone: "sand", label: "Exclusive", gender: "men", collection: "exclusives", sizes },
  { slug: "check-three-piece-suit", name: "Check Three-Piece Suit", description: "Jacket, waistcoat and trouser in a bold blue check.", price: 9999, image: "photo-1594938298603-c8148c4dae35", tone: "blue", label: "Limited run", gender: "men", collection: "exclusives", sizes },
  { slug: "rust-bomber-jacket", name: "Rust Bomber Jacket", description: "Light, sharp and the colour of autumn.", price: 3499, image: "photo-1591047139829-d91aecb6caea", tone: "clay", label: "Exclusive", gender: "men", collection: "exclusives", sizes },
  { slug: "navy-tailored-suit", name: "Navy Tailored Suit", description: "The one suit that covers every occasion.", price: 8499, image: "photo-1617137968427-85924c800a22", tone: "blue", label: "Exclusive", gender: "men", collection: "exclusives", sizes },
  { slug: "peace-graphic-tee", name: "Peace Graphic Tee", description: "A longline tee with a print up front.", price: 1099, image: "photo-1503341504253-dff4815485f1", tone: "sand", label: "Just landed", gender: "men", collection: "new-in", sizes },
  { slug: "blush-crew-sweatshirt", name: "Blush Crew Sweatshirt", description: "A washed pink crew that goes with every denim.", price: 1899, image: "photo-1516826957135-700dedea698c", tone: "rose", label: "New colour", gender: "men", collection: "new-in", sizes },
  { slug: "fog-grey-hoodie", name: "Fog Grey Hoodie", description: "Brushed fleece for early starts.", price: 2199, image: "photo-1556821840-3a63f95609a7", tone: "blue", label: "Just landed", gender: "men", collection: "new-in", sizes },
  { slug: "studio-black-tee", name: "Studio Black Tee", description: "A heavyweight black tee with a quiet chest print.", price: 899, image: "photo-1583743814966-8936f5b7be1a", tone: "blue", label: "Just landed", gender: "men", collection: "new-in", sizes },
  { slug: "cloud-crew-sweatshirt", name: "Cloud Crew Sweatshirt", description: "Clean, white and softer than it looks.", price: 1799, image: "photo-1620799140408-edc6dcb6d633", tone: "sand", label: "New season", gender: "men", collection: "new-in", sizes },
  { slug: "the-good-layer", name: "The Good Layer", description: "A light jacket that makes the in-between feel easy.", price: 2999, image: "photo-1548126032-079a0fb0099d", tone: "clay", label: "Made to keep", gender: "men", collection: "essentials", sizes },
  { slug: "soft-form-knit", name: "Soft Form Knit", description: "The kind of knit you reach for, again and again.", price: 1799, image: "photo-1576566588028-4147f3842f27", tone: "blue", label: "New colour", gender: "men", collection: "essentials", sizes },
  { slug: "everyday-white-tee", name: "Everyday White Tee", description: "The white tee, done properly.", price: 799, image: "photo-1521572163474-6864f9cf17ab", tone: "sand", label: "Bestseller", gender: "men", collection: "essentials", sizes },
  { slug: "oxford-shirt", name: "Oxford Shirt", description: "A button-down in three colours you will actually wear.", price: 1699, image: "photo-1602810318383-e386cc2a3ccf", tone: "clay", label: "Bestseller", gender: "men", collection: "essentials", sizes },
  { slug: "black-denim-jean", name: "Black Denim Jean", description: "Straight leg, deep black, built to fade well.", price: 2499, image: "photo-1542272604-787c3835535d", tone: "blue", label: "Made to keep", gender: "men", collection: "essentials", sizes },
];

// Stock is not tracked on the website yet, so every size starts at a placeholder quantity.
const startingStock = 5;
const firstDay = Date.UTC(2026, 9, 1);

export const seedProducts: Product[] = siteProducts.map((product, index) => ({
  id: product.slug,
  name: product.name,
  description: product.description,
  price: product.price,
  images: [`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=700&q=85`],
  tone: product.tone,
  label: product.label,
  gender: product.gender,
  collection: product.collection,
  stock: product.sizes.map((size) => ({ size, quantity: startingStock })),
  published: true,
  // One minute apart so the list keeps the website order.
  createdAt: new Date(firstDay - index * 60000).toISOString(),
}));
