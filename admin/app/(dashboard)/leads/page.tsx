import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { LeadStatusBadge } from "@/components/badges";
import { EmptyState } from "@/components/empty-state";
import { fullName, formatDate } from "@/lib/format";
import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  type LeadStatus,
} from "@/lib/constants";
import type { Lead } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string };
}) {
  const supabase = createClient();
  const activeStatus = searchParams.status as LeadStatus | undefined;
  const q = (searchParams.q || "").trim();

  let query = supabase.from("leads").select("*").order("created_at", { ascending: false });
  if (activeStatus && LEAD_STATUSES.includes(activeStatus)) {
    query = query.eq("status", activeStatus);
  }
  if (q) {
    query = query.or(
      `first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`
    );
  }
  const { data: leads } = await query;

  return (
    <>
      <PageHeader title="Leads" subtitle="Inbound inspection requests and inquiries.">
        <Link href="/leads/new" className="btn-gold">
          + New Lead
        </Link>
      </PageHeader>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <FilterChip label="All" href="/leads" active={!activeStatus} />
        {LEAD_STATUSES.map((s) => (
          <FilterChip
            key={s}
            label={LEAD_STATUS_LABELS[s]}
            href={`/leads?status=${s}`}
            active={activeStatus === s}
          />
        ))}
        <form className="ml-auto" action="/leads">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search name, email, phone…"
            className="input w-56"
          />
        </form>
      </div>

      {leads && leads.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-400">
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Damage</th>
                  <th className="px-5 py-3 font-semibold">Contact</th>
                  <th className="px-5 py-3 font-semibold">Received</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {(leads as Lead[]).map((lead) => (
                  <tr key={lead.id} className="hover:bg-zinc-50">
                    <td className="px-5 py-3">
                      <Link href={`/leads/${lead.id}`} className="font-medium text-brand-800 hover:underline">
                        {fullName(lead.first_name, lead.last_name)}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-zinc-600">{lead.damage_type || "—"}</td>
                    <td className="px-5 py-3 text-zinc-600">
                      {lead.phone || lead.email || "—"}
                    </td>
                    <td className="px-5 py-3 text-zinc-500">{formatDate(lead.created_at)}</td>
                    <td className="px-5 py-3">
                      <LeadStatusBadge status={lead.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No leads found"
          hint={q || activeStatus ? "Try clearing your filters." : "New website submissions will show up here automatically."}
        />
      )}
    </>
  );
}

function FilterChip({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-brand-800 text-white"
          : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50"
      }`}
    >
      {label}
    </Link>
  );
}
