import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { JobStageBadge } from "@/components/badges";
import { ActivityTimeline } from "@/components/activity-timeline";
import { fullName, formatDate, formatCurrency } from "@/lib/format";
import type { Customer, Job, Activity, Appointment } from "@/lib/types";
import { addCustomerNote, deleteCustomer } from "../actions";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", params.id)
    .single<Customer>();
  if (!customer) notFound();

  const [{ data: jobs }, { data: activities }, { data: appts }] = await Promise.all([
    supabase.from("jobs").select("*").eq("customer_id", customer.id).order("created_at", { ascending: false }),
    supabase.from("activities").select("*").eq("customer_id", customer.id).order("created_at", { ascending: false }),
    supabase
      .from("appointments")
      .select("*")
      .eq("customer_id", customer.id)
      .order("starts_at", { ascending: true }),
  ]);

  const location = [customer.address, customer.city, customer.state, customer.zip]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <div className="mb-2">
        <Link href="/customers" className="text-sm font-semibold text-brand-700 hover:underline">
          ← Back to customers
        </Link>
      </div>
      <PageHeader title={fullName(customer.first_name, customer.last_name)} subtitle="Customer account">
        <Link href={`/customers/${customer.id}/edit`} className="btn-ghost">Edit</Link>
        <Link href={`/jobs/new?customer=${customer.id}`} className="btn-gold">+ New Job</Link>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Jobs */}
          <div className="card">
            <div className="border-b border-zinc-100 px-5 py-3">
              <h2 className="font-semibold text-zinc-800">Jobs</h2>
            </div>
            {jobs && jobs.length > 0 ? (
              <div className="divide-y divide-zinc-100">
                {(jobs as Job[]).map((job) => (
                  <Link key={job.id} href={`/jobs/${job.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-zinc-50">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-zinc-800">{job.title}</p>
                      <p className="text-xs text-zinc-400">
                        {job.claim_number ? `Claim ${job.claim_number} · ` : ""}
                        {formatCurrency(job.approved_value ?? job.estimated_value)}
                      </p>
                    </div>
                    <JobStageBadge stage={job.stage} />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="px-5 py-8 text-center text-sm text-zinc-400">
                No jobs yet. Create one to start tracking restoration work.
              </p>
            )}
          </div>

          {/* Activity */}
          <div className="card p-6">
            <h2 className="mb-4 font-semibold text-zinc-800">Activity</h2>
            <form action={addCustomerNote.bind(null, customer.id)} className="mb-5 flex gap-2">
              <input name="body" placeholder="Add a note…" className="input" required />
              <button className="btn-green shrink-0">Add</button>
            </form>
            <ActivityTimeline activities={(activities as Activity[]) ?? []} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="mb-3 font-semibold text-zinc-800">Details</h2>
            <dl className="space-y-3 text-sm">
              <Row label="Phone" value={customer.phone} href={customer.phone ? `tel:${customer.phone}` : undefined} />
              <Row label="Email" value={customer.email} href={customer.email ? `mailto:${customer.email}` : undefined} />
              <Row label="Location" value={location || null} />
              <Row label="Insurance" value={customer.insurance_carrier} />
              <Row label="Policy #" value={customer.policy_number} />
            </dl>
            {customer.notes && (
              <div className="mt-4 border-t border-zinc-100 pt-3">
                <p className="label">Notes</p>
                <p className="whitespace-pre-line text-sm text-zinc-700">{customer.notes}</p>
              </div>
            )}
          </div>

          {appts && appts.length > 0 && (
            <div className="card p-5">
              <h2 className="mb-3 font-semibold text-zinc-800">Appointments</h2>
              <ul className="space-y-2 text-sm">
                {(appts as Appointment[]).map((a) => (
                  <li key={a.id} className="flex justify-between">
                    <span className="text-zinc-700">{a.title}</span>
                    <span className="text-zinc-400">{formatDate(a.starts_at)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="card p-5">
            <h2 className="mb-3 font-semibold text-zinc-800">Danger Zone</h2>
            <form action={deleteCustomer.bind(null, customer.id)}>
              <button className="btn-ghost w-full text-rose-600 hover:bg-rose-50">
                Delete Customer
              </button>
            </form>
            <p className="mt-2 text-xs text-zinc-400">Also removes their jobs, appointments, and documents.</p>
          </div>
        </div>
      </div>
    </>
  );
}

function Row({ label, value, href }: { label: string; value: string | null; href?: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-zinc-400">{label}</dt>
      <dd className="text-right text-zinc-800">
        {value ? (
          href ? (
            <a href={href} className="text-brand-700 hover:underline">{value}</a>
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
