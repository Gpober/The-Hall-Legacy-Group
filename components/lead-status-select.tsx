"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LEAD_STATUSES, LEAD_STATUS_LABELS, type LeadStatus } from "@/lib/constants";
import { updateLeadStatus } from "@/app/admin/(dashboard)/leads/actions";

export function LeadStatusSelect({
  leadId,
  status,
}: {
  leadId: string;
  status: LeadStatus;
}) {
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) =>
        start(async () => {
          await updateLeadStatus(leadId, e.target.value as LeadStatus);
          router.refresh();
        })
      }
      className="input w-auto font-semibold"
    >
      {LEAD_STATUSES.map((s) => (
        <option key={s} value={s}>
          {LEAD_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
