import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AuthGate } from "@/components/auth-gate";
import { Sidebar } from "@/components/sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Invidzz Admin",
  description: "Manage the Invidzz catalogue, orders and banners.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} antialiased`}>
      <body>
        <AuthGate>
          <div className="shell">
            <Sidebar />
            <main className="main">{children}</main>
          </div>
        </AuthGate>
      </body>
    </html>
  );
}
