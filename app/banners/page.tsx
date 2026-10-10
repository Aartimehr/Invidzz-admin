"use client";

import { useState } from "react";
import { BannerForm } from "@/components/banner-form";
import { data } from "@/lib/data";
import { bannerPages, type Banner, type BannerPage } from "@/lib/types";
import { useTable } from "@/lib/use-table";

export default function BannersPage() {
  const { rows, error, save, remove } = useTable(data.banners);
  // Which form is open: an existing banner, or a new one for a page.
  const [editing, setEditing] = useState<{ banner: Banner | null; page: BannerPage } | null>(null);

  function confirmRemove(banner: Banner) {
    if (window.confirm("Delete this banner? This cannot be undone.")) remove(banner.id);
  }

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Banners</h1>
          <p className="page-sub">{rows ? "Upload the large pictures shown at the top of each website page." : "Loading…"}</p>
        </div>
        <button type="button" className="button button-dark" onClick={() => setEditing({ banner: null, page: "home" })}>Add a banner</button>
      </header>

      {error && <p className="notice-error">{error}</p>}

      {rows && bannerPages.map((page) => {
        const banners = rows.filter((banner) => banner.page === page.id).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        return (
          <section key={page.id} className="banner-group">
            <header>
              <h2>{page.title}</h2>
              <button type="button" className="link-button" onClick={() => setEditing({ banner: null, page: page.id })}>+ Add banner</button>
            </header>
            {banners.length === 0 && <p className="banner-none">No banner yet. The website shows its built-in picture.</p>}
            <ul className="banner-grid">
              {banners.map((banner) => (
                <li key={banner.id} className={banner.active ? "banner-card" : "banner-card is-off"}>
                  <div className="banner-photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={banner.image} alt="" loading="lazy" />
                    {!banner.active && <span className="product-hidden">Switched off</span>}
                  </div>
                  <div className="banner-body">
                    <h3>{banner.heading || "No heading"}</h3>
                    {banner.text && <p>{banner.text}</p>}
                    {banner.buttonLabel && <p className="product-meta">Button: {banner.buttonLabel} → {banner.buttonLink}</p>}
                    <div className="card-actions">
                      <button type="button" onClick={() => setEditing({ banner, page: banner.page })}>Edit</button>
                      <button type="button" onClick={() => save({ ...banner, active: !banner.active })}>{banner.active ? "Switch off" : "Switch on"}</button>
                      <button type="button" className="is-danger" onClick={() => confirmRemove(banner)}>Delete</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {editing && <BannerForm banner={editing.banner} page={editing.page} onSave={save} onClose={() => setEditing(null)} />}
    </>
  );
}
