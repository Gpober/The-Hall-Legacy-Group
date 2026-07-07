import type { Metadata } from "next";
import "./globals.css";
import "./site.css";

// Google Search Console verification token (URL-prefix / HTML-tag method).
// Public token (safe to commit); can be overridden via env var.
const googleSiteVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
  "naNXOn9bDd8K3s-fdTpriZSd_j55hhENzdu8TYrOg_Q";

export const metadata: Metadata = {
  // Default (the CRM at the root) is not indexed; the marketing page overrides
  // this with indexable metadata.
  title: "Hall Legacy Group — CRM",
  description: "Internal CRM and lead management for Hall Legacy Group.",
  robots: { index: false, follow: false },
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
