"use client";

import { useState } from "react";
import { ProductForm } from "@/components/product-form";
import { data } from "@/lib/data";
import { collections, formatPrice, genders, totalStock, type Product } from "@/lib/types";
import { useTable } from "@/lib/use-table";

export default function CatalogPage() {
  const { rows, error, save, remove } = useTable(data.products);
  const [gender, setGender] = useState("all");
  const [collection, setCollection] = useState("all");
  const [search, setSearch] = useState("");
  // undefined: form closed. null: adding a new piece.
  const [editing, setEditing] = useState<Product | null | undefined>(undefined);

  const products = (rows ?? [])
    .filter((product) => gender === "all" || product.gender === gender)
    .filter((product) => collection === "all" || product.collection === collection)
    .filter((product) => product.name.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  function confirmRemove(product: Product) {
    if (window.confirm(`Delete "${product.name}"? This cannot be undone.`)) remove(product.id);
  }

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Catalog</h1>
          <p className="page-sub">{rows ? `${rows.length} pieces. Add photos, prices, sizes and stock here.` : "Loading…"}</p>
        </div>
        <button type="button" className="button button-dark" onClick={() => setEditing(null)}>Add a piece</button>
      </header>

      {error && <p className="notice-error">{error}</p>}

      <div className="toolbar">
        <div className="chips">
          {[{ id: "all", title: "All" }, ...genders].map((option) => (
            <button key={option.id} type="button" className={gender === option.id ? "chip is-current" : "chip"} onClick={() => setGender(option.id)}>{option.title}</button>
          ))}
        </div>
        <select value={collection} onChange={(event) => setCollection(event.target.value)} aria-label="Collection">
          <option value="all">All collections</option>
          {collections.map((option) => <option key={option.id} value={option.id}>{option.title}</option>)}
        </select>
        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name" aria-label="Search by name" />
      </div>

      {rows && products.length === 0 && <p className="empty">No pieces match. Change the filters, or add a piece.</p>}

      <ul className="product-grid">
        {products.map((product) => {
          const inStock = totalStock(product);
          return (
            <li key={product.id} className="product-card">
              <div className="product-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {product.images[0] && <img src={product.images[0]} alt="" loading="lazy" />}
                {product.label && <span className="product-label">{product.label}</span>}
                {!product.published && <span className="product-hidden">Hidden</span>}
              </div>
              <div className="product-body">
                <h3>{product.name}</h3>
                <p className="product-meta">{genders.find((option) => option.id === product.gender)?.title} · {collections.find((option) => option.id === product.collection)?.title}</p>
                <p className="product-price">
                  {formatPrice(product.price)}
                  <span className={inStock ? "stock" : "stock is-out"}>{inStock ? `${inStock} in stock` : "Sold out"}</span>
                </p>
                <p className="product-sizes">{product.stock.map((entry) => `${entry.size} ${entry.quantity}`).join(" · ")}</p>
                <div className="card-actions">
                  <button type="button" onClick={() => setEditing(product)}>Edit</button>
                  <button type="button" className="is-danger" onClick={() => confirmRemove(product)}>Delete</button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {editing !== undefined && (
        <ProductForm product={editing} takenIds={(rows ?? []).map((product) => product.id)} onSave={save} onClose={() => setEditing(undefined)} />
      )}
    </>
  );
}
