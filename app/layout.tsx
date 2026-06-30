import type { Metadata } from "next";
import "./globals.css";
import "./site.css";

export const metadata: Metadata = {
  title: "Hall Legacy Group | Insurance Restoration Specialists",
  description:
    "Hall Legacy Group handles your insurance restoration from start to finish — working directly from your carrier's scope of work to restore your property to pre-loss condition with no out-of-pocket surprises.",
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
