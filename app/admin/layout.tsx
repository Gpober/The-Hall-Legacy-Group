import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hall Legacy Group — CRM",
  description: "Internal CRM and lead management for Hall Legacy Group.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
