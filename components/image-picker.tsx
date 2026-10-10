"use client";

import { useState } from "react";
import { data } from "@/lib/data";
import type { ImageFolder } from "@/lib/data/source";

type Props = {
  images: string[];
  onChange: (images: string[]) => void;
  folder: ImageFolder;
  // One picture (a banner) or several (a product, where the first is the cover).
  multiple?: boolean;
};

export function ImagePicker({ images, onChange, folder, multiple = false }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function add(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) uploaded.push(await data.uploadImage(file, folder));
      onChange(multiple ? [...images, ...uploaded] : uploaded.slice(0, 1));
    } catch {
      setError("That picture could not be added. Try a JPG or PNG file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="image-picker">
      {images.length > 0 && (
        <ul className={multiple ? "image-list" : "image-list image-list-wide"}>
          {images.map((image, index) => (
            <li key={image.slice(-40) + index}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" />
              {multiple && index === 0 && <span className="image-cover">Cover</span>}
              <div className="image-actions">
                {multiple && index > 0 && (
                  <button type="button" onClick={() => onChange([image, ...images.filter((_, other) => other !== index)])}>Make cover</button>
                )}
                <button type="button" onClick={() => onChange(images.filter((_, other) => other !== index))}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <label className="image-add">
        <input type="file" accept="image/*" multiple={multiple} disabled={busy} onChange={(event) => { add(event.target.files); event.target.value = ""; }} />
        {busy ? "Adding…" : multiple ? "Upload photos" : images.length ? "Replace picture" : "Upload picture"}
      </label>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
