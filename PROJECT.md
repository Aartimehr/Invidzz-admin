# Invidzz Admin: project guide

Loaded into every Claude Code session through `CLAUDE.md`. Keep it current when a decision below changes.

Last reviewed: 2026-10-11.

## What this is

The owner's back office for the Invidzz website (the `invizz` folder next to this one; read its `PROJECT.md` for the business rules). The owner is not a developer: explain in plain language, say what was and was not checked, and do not commit unless asked.

## Current stage: screens only, no database

The owner chose Supabase but asked for the screens first and the connection later. So today:

- Everything is saved in the browser (IndexedDB) on the computer the admin is opened on. Nothing reaches the website yet.
- The catalogue starts as a copy of the website's 30 placeholder pieces (`lib/data/seed.ts`), each size at a placeholder stock of 5.
- The Orders page has no real orders. "Show sample orders" adds three made-up ones (`INV-SAMPLE1` to `3`) for previewing.
- The Orders page has a second tab, Customised orders, for pieces customers drew on the website's Try Customise page. Those drawings reach the owner on WhatsApp, so the owner adds each one by hand with "Add a customised order" (reference `CUS-XXXXXX`, customer, piece, size, the drawing, the price sent). "Show sample customised orders" adds two made-up ones (`CUS-SAMPLE1` and `2`).
- Uploaded pictures are shrunk to 1600px and stored inside the product or banner as `data:` addresses.
- There is no login. Do not put this admin online until Supabase sign-in is added.

## Stack

Same as the website: Next.js 16.3 App Router, React 19.2, TypeScript, Tailwind 4 with hand-written classes in `app/globals.css` (one rule per line, same colour variables). No runtime dependencies beyond Next and React. **Read `AGENTS.md` first.**

## Commands

- `npm run dev`: dev server on port **3001** (the website uses 3000, so both can run together).
- `npm run build`: production build and typecheck. `npm run lint`: ESLint. No tests.

## Where things live

| Path | What it holds |
|---|---|
| `lib/types.ts` | `Product`, `Order`, `Banner` and their option lists. Each type becomes one Supabase table |
| `lib/data/source.ts` | The `DataSource` contract every page uses: `list`, `save`, `remove` per table, plus `uploadImage` |
| `lib/data/local.ts` | The browser-only stand-in that satisfies the contract. A new table must be added to `storeNames` and the version number in `indexedDB.open` raised |
| `lib/data/index.ts` | The one line that chooses the storage. Swap it here for Supabase |
| `lib/use-table.ts` | Hook that loads a table and reloads after each change |
| `components/sidebar.tsx` | The menu: Dashboard, Catalog, Orders, Banners |
| `components/product-form.tsx`, `banner-form.tsx`, `custom-order-form.tsx` | The add/edit pop-ups |
| `components/custom-orders.tsx` | The Customised orders tab of the Orders page |
| `components/image-picker.tsx` | Upload, remove and choose-cover for pictures |
| `app/page.tsx` | Dashboard, left empty on purpose for now |
| `app/catalog`, `app/orders`, `app/banners` | The three working pages |

## Connecting Supabase (next stage, not started)

1. Create tables `products`, `orders`, `custom_orders`, `banners` matching `lib/types.ts`, and a public storage bucket for pictures.
2. Write `lib/data/supabase.ts` satisfying `DataSource` (`uploadImage` returns the bucket's public address) and export it from `lib/data/index.ts`. Pages should not need changes.
3. Add owner sign-in, and database rules so only the signed-in owner can write and the public can only read published products and active banners and insert orders.
4. In the website: read products and banners from Supabase instead of `lib/products.ts` and the fixed hero pictures, save each order at checkout, upload each Try Customise drawing and save it as a customised order, and allow the bucket's host in `next.config.ts` for `next/image`.

## Conventions

- Pages never touch storage directly; they go through `data` from `lib/data`.
- A product's `id` is its website address slug and never changes after creation.
- Prices are whole rupees as numbers; display with `formatPrice`.
- Plain `<img>` is used (not `next/image`) because pictures are `data:` addresses today.
