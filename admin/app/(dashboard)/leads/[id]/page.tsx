import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { LeadStatusSelect } from "@/components/lead-status-select";
import { ActivityTimeline } from "@/components/activity-timeline";
import { fullName, formatDateTime } from "@/lib/format";
import { LEAD_SOURCES } from "@/lib/constants";
import type { Lead, Activity } from "@/lib/types";
import { addLeadNote, convertLeadToCustomer, deleteLead } from "../actions";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("id", params.id)
    .single<Lead>();

  if (!lead) notFound();

  const { data: activities } = await supabase
    .from("activities")
    .select("*")
    .eq("lead_id", lead.id)
    .order("created_at", { ascending: false });

  const sourceLabel =
    LEAD_SOURCES.includes(lead.source) ? lead.source : "manual";

  return (
    <>
      <div className="mb-2">
        <Link href="/leads" className="text-sm font-semibold text-brand-700 hover:underline">
          ← Back to leads
        </Link>
      </div>
      <PageHeader
        title={fullName(lead.first_name, lead.last_name)}
        subtitle={`Lead · ${sourceLabel} · received ${formatDateTime(lead.created_at)}`}
      >
        <LeadStatusSelect leadId={lead.id} status={lead.status} />
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Details */}
        <div className="space-y-6 lg:col-span-2">
          <div className="card p-6">
            <h2 className="mb-4 font-semibold text-zinc-800">Contact &amp; Damage</h2>
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <Field label="Phone" value={lead.phone} href={lead.phone ? `tel:${lead.phone}` : undefined} />
              <Field label="Email" value={lead.email} href={lead.email ? `mailto:${lead.email}` : undefined} />
              <Field label="Type of Damage" value={lead.damage_type} />
              <Field label="Insurance Carrier" value={lead.insurance_carrier} />
            </dl>
            {lead.message && (
              <div className="mt-5 border-t border-zinc-100 pt-4">
                <p className="label">Their Situation</p>
                <p className="whitespace-pre-line text-sm text-zinc-700">{lead.message}</p>
              </div>
            )}
          </div>

          {/* Activity */}
          <div className="card p-6">
            <h2 className="mb-4 font-semibold text-zinc-800">Activity</h2>
            <form action={addLeadNote.bind(null, lead.id)} className="mb-5 flex gap-2">
              <input
                name="body"
                placeholder="Add a note (call summary, next step…)"
                className="input"
                required
              />
              <button className="btn-green shrink-0">Add</button>
            </form>
            <ActivityTimeline activities={(activities as Activity[]) ?? []} />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="mb-3 font-semibold text-zinc-800">Actions</h2>
            {lead.customer_id ? (
              <Link href={`/customers/${lead.customer_id}`} className="btn-green w-full">
                View Customer →
              </Link>
            ) : (
              <form action={convertLeadToCustomer.bind(null, lead.id)}>
                <button className="btn-gold w-full">Convert to Customer</button>
              </form>
            )}
            <p className="mt-3 text-xs text-zinc-400">
              Converting creates a customer record you can attach jobs, appointments,
              and documents to.
            </p>
          </div>

          <div className="card p-5">
            <h2 className="mb-3 font-semibold text-zinc-800">Danger Zone</h2>
            <form action={deleteLead.bind(null, lead.id)}>
              <button className="btn-ghost w-full text-rose-600 hover:bg-rose-50">
                Delete Lead
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  value,
  href,
}: {
  label: string;
  value: string | null;
  href?: string;
}) {
  return (
    <div>
      <dt className="label">{label}</dt>
      <dd className="text-sm text-zinc-800">
        {value ? (
          href ? (
            <a href={href} className="text-brand-700 hover:underline">
              {value}
            </a>
          ) : (
            value
          )
        ) : (
          "—"
        )}
      </dd>
    </div>
  );
}
