import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { JobStageBadge } from "@/components/badges";
import { EmptyState } from "@/components/empty-state";
import { formatCurrency, formatDate, fullName } from "@/lib/format";
import {
  JOB_STAGES,
  JOB_STAGE_LABELS,
  type JobStage,
} from "@/lib/constants";

export const dynamic = "force-dynamic";

type JobRow = {
  id: string;
  title: string;
  stage: JobStage;
  claim_number: string | null;
  estimated_value: number | null;
  approved_value: number | null;
  created_at: string;
  customers: { first_name: string; last_name: string | null } | null;
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { stage?: string };
}) {
  const supabase = createClient();
  const activeStage = searchParams.stage as JobStage | undefined;

  let query = supabase
    .from("jobs")
    .select("id,title,stage,claim_number,estimated_value,approved_value,created_at,customers(first_name,last_name)")
    .order("created_at", { ascending: false });
  if (activeStage && JOB_STAGES.includes(activeStage)) {
    query = query.eq("stage", activeStage);
  }
  const { data } = await query;
  const jobs = (data as unknown as JobRow[]) ?? [];

  return (
    <>
      <PageHeader title="Jobs" subtitle="Restoration projects and insurance claims." />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Chip label="All" href="/jobs" active={!activeStage} />
        {JOB_STAGES.map((s) => (
          <Chip key={s} label={JOB_STAGE_LABELS[s]} href={`/jobs?stage=${s}`} active={activeStage === s} />
        ))}
      </div>

      {jobs.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-400">
                  <th className="px-5 py-3 font-semibold">Job</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Value</th>
                  <th className="px-5 py-3 font-semibold">Created</th>
                  <th className="px-5 py-3 font-semibold">Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-zinc-50">
                    <td className="px-5 py-3">
                      <Link href={`/jobs/${job.id}`} className="font-medium text-brand-800 hover:underline">
                        {job.title}
                      </Link>
                      {job.claim_number && (
                        <p className="text-xs text-zinc-400">Claim {job.claim_number}</p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-zinc-600">
                      {job.customers ? fullName(job.customers.first_name, job.customers.last_name) : "—"}
                    </td>
                    <td className="px-5 py-3 text-zinc-600">
                      {formatCurrency(job.approved_value ?? job.estimated_value)}
                    </td>
                    <td className="px-5 py-3 text-zinc-500">{formatDate(job.created_at)}</td>
                    <td className="px-5 py-3"><JobStageBadge stage={job.stage} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No jobs yet"
          hint="Open a customer record and create a job to start tracking restoration work."
        />
      )}
    </>
  );
}

function Chip({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
        active ? "bg-brand-800 text-white" : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50"
      }`}
    >
      {label}
    </Link>
  );
}
