"use client";

import { useState } from "react";
import { ImagePicker } from "@/components/image-picker";
import { Modal } from "@/components/modal";
import { bannerPages, type Banner, type BannerPage } from "@/lib/types";

type Props = {
  // The banner being edited, or null for a new one.
  banner: Banner | null;
  // The page a new banner starts on.
  page: BannerPage;
  onSave: (banner: Banner) => Promise<void>;
  onClose: () => void;
};

export function BannerForm({ banner, page: startPage, onSave, onClose }: Props) {
  const [page, setPage] = useState<BannerPage>(banner?.page ?? startPage);
  const [images, setImages] = useState(banner ? [banner.image] : []);
  const [heading, setHeading] = useState(banner?.heading ?? "");
  const [text, setText] = useState(banner?.text ?? "");
  const [buttonLabel, setButtonLabel] = useState(banner?.buttonLabel ?? "");
  const [buttonLink, setButtonLink] = useState(banner?.buttonLink ?? "");
  const [active, setActive] = useState(banner?.active ?? true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!images.length) return setError("Add the banner picture.");
    if (buttonLabel.trim() && !buttonLink.trim()) return setError("Say where the button should go, for example /your-styles/women.");

    setSaving(true);
    try {
      await onSave({
        id: banner?.id ?? crypto.randomUUID(),
        page,
        image: images[0],
        heading: heading.trim(),
        text: text.trim(),
        buttonLabel: buttonLabel.trim(),
        buttonLink: buttonLink.trim(),
        active,
        createdAt: banner?.createdAt ?? new Date().toISOString(),
      });
      onClose();
    } catch {
      setError("This banner could not be saved. Try a smaller picture.");
      setSaving(false);
    }
  }

  return (
    <Modal title={banner ? "Edit banner" : "Add a banner"} onClose={onClose}>
      <form className="form" onSubmit={submit}>
        <label className="field">
          <span className="field-label">Website page</span>
          <select value={page} onChange={(event) => setPage(event.target.value as BannerPage)}>
            {bannerPages.map((option) => <option key={option.id} value={option.id}>{option.title}</option>)}
          </select>
        </label>

        <div className="field">
          <span className="field-label">Picture</span>
          <ImagePicker images={images} onChange={setImages} folder="banners" />
          <span className="field-hint">A wide picture works best, about 2000 pixels across.</span>
        </div>

        <label className="field">
          <span className="field-label">Heading (optional)</span>
          <input value={heading} onChange={(event) => setHeading(event.target.value)} maxLength={80} />
        </label>

        <label className="field">
          <span className="field-label">Text under the heading (optional)</span>
          <textarea value={text} onChange={(event) => setText(event.target.value)} rows={2} maxLength={200} />
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field-label">Button text (optional)</span>
            <input value={buttonLabel} onChange={(event) => setButtonLabel(event.target.value)} maxLength={30} />
          </label>
          <label className="field">
            <span className="field-label">Button goes to</span>
            <input value={buttonLink} onChange={(event) => setButtonLink(event.target.value)} placeholder="/your-styles/women" />
          </label>
        </div>

        <label className="check">
          <input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} />
          Show this banner on the website
        </label>

        {error && <p className="form-error">{error}</p>}

        <footer className="form-actions">
          <button type="button" className="button button-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="button button-dark" disabled={saving}>{saving ? "Saving…" : "Save banner"}</button>
        </footer>
      </form>
    </Modal>
  );
}
