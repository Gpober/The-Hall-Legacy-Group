import type { Metadata } from "next";
import "./globals.css";
import "./site.css";

export const metadata: Metadata = {
  // Default (the CRM at the root) is not indexed; the marketing page overrides
  // this with indexable metadata.
  title: "Hall Legacy Group — CRM",
  description: "Internal CRM and lead management for Hall Legacy Group.",
  robots: { index: false, follow: false },
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
