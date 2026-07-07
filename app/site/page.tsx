import type { Metadata } from "next";
import { Landing } from "@/components/landing";

export const metadata: Metadata = {
  title: "Hall Legacy Group | Insurance Restoration Specialists",
  description:
    "Hall Legacy Group handles your insurance restoration from start to finish — working directly from your carrier's scope of work to restore your property to pre-loss condition with no out-of-pocket surprises.",
  robots: { index: true, follow: true },
};

export default function MarketingPage() {
  return <Landing />;
}
