import type { Metadata } from "next";
import { Process } from "@/components/process";

export const metadata: Metadata = {
  title: "Our Process | Hall Legacy Group",
  description:
    "How a Hall Legacy Group restoration runs, stage by stage — inspection and documentation, emergency drying, controlled demolition, treatment, structural repairs, and the final walkthrough — with before-and-after photography from real jobs.",
  robots: { index: true, follow: true },
};

export default function ProcessPage() {
  return <Process />;
}
