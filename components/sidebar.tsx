"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth";

const links = [
  { href: "/", title: "Dashboard", icon: "M3 3h8v10H3zM13 3h8v6h-8zM13 11h8v10h-8zM3 15h8v6H3z" },
  { href: "/catalog", title: "Catalog", icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  { href: "/orders", title: "Orders", icon: "M6 3h12l1 4H5zM5 7h14v14H5zM9 11v2a3 3 0 0 0 6 0v-2" },
  { href: "/banners", title: "Banners", icon: "M3 5h18v14H3zM3 15l5-5 4 4 3-3 6 6" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/" className="sidebar-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/invidzz-logo.png" alt="Invidzz" />
        <span>Admin</span>
      </Link>
      <nav className="sidebar-nav" aria-label="Admin sections">
        {links.map((link) => {
          const current = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <Link key={link.href} href={link.href} className={current ? "sidebar-link is-current" : "sidebar-link"} aria-current={current ? "page" : undefined}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d={link.icon} /></svg>
              {link.title}
            </Link>
          );
        })}
      </nav>
      <p className="sidebar-note">Trial storage: everything is saved in this browser only and is not on the website yet.</p>
      <button type="button" className="sidebar-signout" onClick={signOut}>Sign out</button>
    </aside>
  );
}
