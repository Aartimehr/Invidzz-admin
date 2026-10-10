"use client";

import { useState } from "react";
import { ImagePicker } from "@/components/image-picker";
import { Modal } from "@/components/modal";
import { allSizes, customGarments, type CustomOrder } from "@/lib/types";

type Props = {
  // The customised order being edited, or null for a new one.
  order: CustomOrder | null;
  // References already in use, so a new one cannot overwrite another order.
  takenIds: string[];
  onSave: (order: CustomOrder) => Promise<void>;
  onClose: () => void;
};

export function CustomOrderForm({ order, takenIds, onSave, onClose }: Props) {
  const [id, setId] = useState(order?.id ?? "");
  const [name, setName] = useState(order?.customer.name ?? "");
  const [phone, setPhone] = useState(order?.customer.phone ?? "");
  const [garment, setGarment] = useState(order?.garment ?? customGarments[0]);
  const [fabric, setFabric] = useState(order?.fabric ?? "");
  const [size, setSize] = useState(order?.size ?? "M");
  const [notes, setNotes] = useState(order?.notes ?? "");
  const [images, setImages] = useState(order ? [order.design] : []);
  const [quote, setQuote] = useState(order?.quote ? String(order.quote) : "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    // The customer's message quotes a reference; without one (an older chat, say) a new one is made here.
    const reference = order?.id ?? (id.trim().toUpperCase() || `CUS-${Date.now().toString(36).slice(-6).toUpperCase()}`);
    if (!order && takenIds.includes(reference)) return setError(`${reference} is already in the list. Edit that one instead.`);
    if (!images.length) return setError("Add the customer's drawing.");

    setSaving(true);
    try {
      await onSave({
        id: reference,
        createdAt: order?.createdAt ?? new Date().toISOString(),
        status: order?.status ?? "new",
        customer: { name: name.trim(), phone: phone.trim() },
        garment,
        fabric: fabric.trim(),
        size,
        notes: notes.trim(),
        design: images[0],
        quote: quote.trim() ? Math.round(Number(quote)) : null,
      });
      onClose();
    } catch {
      setError("This customised order could not be saved. Try a smaller picture.");
      setSaving(false);
    }
  }

  return (
    <Modal title={order ? `Edit ${order.id}` : "Add a customised order"} onClose={onClose}>
      <form className="form" onSubmit={submit}>
        {!order && (
          <label className="field">
            <span className="field-label">Design reference</span>
            <input value={id} onChange={(event) => setId(event.target.value)} placeholder="CUS-AB12CD" maxLength={20} />
            <span className="field-hint">It is in the customer&apos;s WhatsApp message. Leave empty to create a new one.</span>
          </label>
        )}

        <div className="field-row">
          <label className="field">
            <span className="field-label">Customer name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} required maxLength={80} />
          </label>
          <label className="field">
            <span className="field-label">Mobile number</span>
            <input value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" inputMode="numeric" required maxLength={15} />
          </label>
        </div>

        <div className="field-row field-row-3">
          <label className="field">
            <span className="field-label">Piece</span>
            <select value={garment} onChange={(event) => setGarment(event.target.value)}>
              {customGarments.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="field">
            <span className="field-label">Fabric colour</span>
            <input value={fabric} onChange={(event) => setFabric(event.target.value)} maxLength={40} />
          </label>
          <label className="field">
            <span className="field-label">Size</span>
            <select value={size} onChange={(event) => setSize(event.target.value)}>
              {allSizes.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
        </div>

        <div className="field design-picker">
          <span className="field-label">Customer&apos;s drawing</span>
          <ImagePicker images={images} onChange={setImages} folder="designs" />
          <span className="field-hint">Save the picture from the WhatsApp chat, then upload it here.</span>
        </div>

        <label className="field">
          <span className="field-label">Customer&apos;s notes (optional)</span>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} maxLength={500} />
        </label>

        <label className="field">
          <span className="field-label">Price you told the customer, in rupees (optional)</span>
          <input value={quote} onChange={(event) => setQuote(event.target.value)} type="number" min={1} step={1} inputMode="numeric" />
        </label>

        {error && <p className="form-error">{error}</p>}

        <footer className="form-actions">
          <button type="button" className="button button-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="button button-dark" disabled={saving}>{saving ? "Saving…" : "Save customised order"}</button>
        </footer>
      </form>
    </Modal>
  );
}
