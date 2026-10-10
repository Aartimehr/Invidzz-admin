"use client";

import { useState } from "react";
import { ImagePicker } from "@/components/image-picker";
import { Modal } from "@/components/modal";
import { allSizes, collections, genders, tones, type Collection, type Gender, type Product } from "@/lib/types";

type Props = {
  // The piece being edited, or null for a new one.
  product: Product | null;
  takenIds: string[];
  onSave: (product: Product) => Promise<void>;
  onClose: () => void;
};

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function ProductForm({ product, takenIds, onSave, onClose }: Props) {
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [images, setImages] = useState(product?.images ?? []);
  const [label, setLabel] = useState(product?.label ?? "Just landed");
  const [tone, setTone] = useState(product?.tone ?? tones[0]);
  const [gender, setGender] = useState<Gender>(product?.gender ?? "women");
  const [collection, setCollection] = useState<Collection>(product?.collection ?? "new-in");
  const [stock, setStock] = useState(product?.stock ?? []);
  const [published, setPublished] = useState(product?.published ?? true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Sizes already on the piece that are not in the standard list still get a row.
  const sizes = [...allSizes, ...stock.map((entry) => entry.size).filter((size) => !allSizes.includes(size))];

  function toggleSize(size: string, offered: boolean) {
    setStock(offered ? [...stock, { size, quantity: 0 }] : stock.filter((entry) => entry.size !== size));
  }

  function setQuantity(size: string, quantity: number) {
    setStock(stock.map((entry) => (entry.size === size ? { size, quantity } : entry)));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const id = product?.id ?? slugify(name);
    const amount = Number(price);
    if (!id) return setError("Give the piece a name.");
    if (!product && takenIds.includes(id)) return setError("Another piece already has this name. Choose a different one.");
    if (!Number.isInteger(amount) || amount <= 0) return setError("Enter the price in whole rupees, for example 1499.");
    if (!images.length) return setError("Add at least one photo.");
    if (!stock.length) return setError("Tick at least one size.");

    setSaving(true);
    try {
      await onSave({
        id,
        name: name.trim(),
        description: description.trim(),
        price: amount,
        images,
        tone,
        label: label.trim(),
        gender,
        collection,
        stock: sizes.flatMap((size) => stock.filter((entry) => entry.size === size)),
        published,
        createdAt: product?.createdAt ?? new Date().toISOString(),
      });
      onClose();
    } catch {
      setError("This piece could not be saved. If it has many large photos, remove one and try again.");
      setSaving(false);
    }
  }

  return (
    <Modal title={product ? "Edit piece" : "Add a piece"} onClose={onClose}>
      <form className="form" onSubmit={submit}>
        <div className="field">
          <span className="field-label">Photos</span>
          <ImagePicker images={images} onChange={setImages} folder="products" multiple />
        </div>

        <label className="field">
          <span className="field-label">Name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} required maxLength={80} />
          {!product && name && <span className="field-hint">Website address: /your-styles/{slugify(name)}</span>}
        </label>

        <label className="field">
          <span className="field-label">Description</span>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={2} maxLength={200} />
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field-label">Price (₹)</span>
            <input value={price} onChange={(event) => setPrice(event.target.value)} inputMode="numeric" required />
          </label>
          <label className="field">
            <span className="field-label">Label on the card</span>
            <input value={label} onChange={(event) => setLabel(event.target.value)} maxLength={30} />
          </label>
        </div>

        <div className="field-row field-row-3">
          <label className="field">
            <span className="field-label">For</span>
            <select value={gender} onChange={(event) => setGender(event.target.value as Gender)}>
              {genders.map((option) => <option key={option.id} value={option.id}>{option.title}</option>)}
            </select>
          </label>
          <label className="field">
            <span className="field-label">Collection</span>
            <select value={collection} onChange={(event) => setCollection(event.target.value as Collection)}>
              {collections.map((option) => <option key={option.id} value={option.id}>{option.title}</option>)}
            </select>
          </label>
          <label className="field">
            <span className="field-label">Card colour</span>
            <select value={tone} onChange={(event) => setTone(event.target.value)}>
              {tones.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
        </div>

        <fieldset className="field">
          <legend className="field-label">Sizes and stock</legend>
          <div className="size-grid">
            {sizes.map((size) => {
              const entry = stock.find((candidate) => candidate.size === size);
              return (
                <div key={size} className={entry ? "size-cell is-offered" : "size-cell"}>
                  <label>
                    <input type="checkbox" checked={Boolean(entry)} onChange={(event) => toggleSize(size, event.target.checked)} />
                    {size}
                  </label>
                  <input
                    type="number"
                    min={0}
                    aria-label={`${size} in stock`}
                    disabled={!entry}
                    value={entry ? entry.quantity : ""}
                    onChange={(event) => setQuantity(size, Math.max(0, Math.floor(Number(event.target.value) || 0)))}
                  />
                </div>
              );
            })}
          </div>
          <span className="field-hint">Tick the sizes this piece comes in and type how many of each you have.</span>
        </fieldset>

        <label className="check">
          <input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} />
          Show this piece on the website
        </label>

        {error && <p className="form-error">{error}</p>}

        <footer className="form-actions">
          <button type="button" className="button button-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="button button-dark" disabled={saving}>{saving ? "Saving…" : "Save piece"}</button>
        </footer>
      </form>
    </Modal>
  );
}
