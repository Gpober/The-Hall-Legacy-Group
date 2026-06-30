import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { JobStageTracker } from "@/components/job-stage-tracker";
import { ActivityTimeline } from "@/components/activity-timeline";
import { DocumentsPanel } from "@/components/documents-panel";
import { fullName, formatCurrency, formatDate } from "@/lib/format";
import type { Job, Activity, DocumentRow, Customer } from "@/lib/types";
import { addJobNote, deleteJob } from "../actions";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: job } = await supabase
    .from("jobs")
    .select("*, customers(id,first_name,last_name)")
    .eq("id", params.id)
    .single();
  if (!job) notFound();

  const customer = (job as { customers: Pick<Customer, "id" | "first_name" | "last_name"> | null }).customers;

  const [{ data: activities }, { data: documents }] = await Promise.all([
    supabase.from("activities").select("*").eq("job_id", job.id).order("created_at", { ascending: false }),
    supabase.from("documents").select("*").eq("job_id", job.id).order("created_at", { ascending: false }),
  ]);

  const j = job as Job;

  return (
    <>
      <div className="mb-2 flex items-center gap-2 text-sm">
        <Link href="/admin/jobs" className="font-semibold text-brand-700 hover:underline">← Jobs</Link>
        {customer && (
          <>
            <span className="text-zinc-300">/</span>
            <Link href={`/admin/customers/${customer.id}`} className="font-semibold text-brand-700 hover:underline">
              {fullName(customer.first_name, customer.last_name)}
            </Link>
          </>
        )}
      </div>
      <PageHeader title={j.title} subtitle={j.job_type ?? "Restoration job"}>
        <Link href={`/admin/jobs/${j.id}/edit`} className="btn-ghost">Edit</Link>
      </PageHeader>

      <div className="card mb-6 p-5">
        <p className="label mb-2">Stage</p>
        <JobStageTracker jobId={j.id} stage={j.stage} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card p-6">
            <h2 className="mb-4 font-semibold text-zinc-800">Claim &amp; Project Details</h2>
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <Field label="Claim Number" value={j.claim_number} />
              <Field label="Insurance Carrier" value={j.insurance_carrier} />
              <Field label="Adjuster" value={j.adjuster_name} />
              <Field label="Adjuster Phone" value={j.adjuster_phone} href={j.adjuster_phone ? `tel:${j.adjuster_phone}` : undefined} />
              <Field label="Estimated Value" value={formatCurrency(j.estimated_value)} />
              <Field label="Approved Value" value={formatCurrency(j.approved_value)} />
              <Field label="Start Date" value={formatDate(j.start_date)} />
              <Field label="Target Completion" value={formatDate(j.target_completion)} />
              <Field label="Property Address" value={j.address} />
            </dl>
            {j.notes && (
              <div className="mt-5 border-t border-zinc-100 pt-4">
                <p className="label">Notes</p>
                <p className="whitespace-pre-line text-sm text-zinc-700">{j.notes}</p>
              </div>
            )}
          </div>

          <div className="card p-6">
            <h2 className="mb-4 font-semibold text-zinc-800">Documents</h2>
            <DocumentsPanel
              jobId={j.id}
              customerId={customer?.id ?? null}
              documents={(documents as DocumentRow[]) ?? []}
            />
          </div>

          <div className="card p-6">
            <h2 className="mb-4 font-semibold text-zinc-800">Activity</h2>
            <form action={addJobNote.bind(null, j.id)} className="mb-5 flex gap-2">
              <input name="body" placeholder="Add a note (progress, adjuster call…)" className="input" required />
              <button className="btn-green shrink-0">Add</button>
            </form>
            <ActivityTimeline activities={(activities as Activity[]) ?? []} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="mb-3 font-semibold text-zinc-800">Summary</h2>
            <dl className="space-y-3 text-sm">
              <Row label="Customer" value={customer ? fullName(customer.first_name, customer.last_name) : "—"} />
              <Row label="Approved" value={formatCurrency(j.approved_value)} />
              <Row label="Created" value={formatDate(j.created_at)} />
            </dl>
          </div>
          <div className="card p-5">
            <h2 className="mb-3 font-semibold text-zinc-800">Danger Zone</h2>
            <form action={deleteJob.bind(null, j.id)}>
              <button className="btn-ghost w-full text-rose-600 hover:bg-rose-50">Delete Job</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({ label, value, href }: { label: string; value: string | null; href?: string }) {
  return (
    <div>
      <dt className="label">{label}</dt>
      <dd className="text-sm text-zinc-800">
        {value && value !== "—" ? (
          href ? <a href={href} className="text-brand-700 hover:underline">{value}</a> : value
        ) : "—"}
      </dd>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-zinc-400">{label}</dt>
      <dd className="text-right font-medium text-zinc-800">{value}</dd>
    </div>
  );
}
