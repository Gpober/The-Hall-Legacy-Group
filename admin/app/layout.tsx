import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
