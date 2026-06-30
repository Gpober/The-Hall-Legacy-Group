import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { formatCurrency } from "@/lib/format";
import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_STYLES,
  JOB_STAGES,
  JOB_STAGE_LABELS,
  JOB_STAGE_STYLES,
  LEAD_SOURCES,
  type LeadStatus,
  type JobStage,
  type LeadSource,
} from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const supabase = createClient();

  const [{ data: leads }, { data: jobs }] = await Promise.all([
    supabase.from("leads").select("status,source,created_at"),
    supabase.from("jobs").select("stage,estimated_value,approved_value"),
  ]);

  const leadRows = (leads ?? []) as { status: LeadStatus; source: LeadSource; created_at: string }[];
  const jobRows = (jobs ?? []) as { stage: JobStage; estimated_value: number | null; approved_value: number | null }[];

  const totalLeads = leadRows.length;
  const won = leadRows.filter((l) => l.status === "won").length;
  const conversion = totalLeads ? Math.round((won / totalLeads) * 100) : 0;

  const leadByStatus = Object.fromEntries(
    LEAD_STATUSES.map((s) => [s, leadRows.filter((l) => l.status === s).length])
  ) as Record<LeadStatus, number>;

  const leadBySource = Object.fromEntries(
    LEAD_SOURCES.map((s) => [s, leadRows.filter((l) => l.source === s).length])
  ) as Record<LeadSource, number>;

  const jobByStage = Object.fromEntries(
    JOB_STAGES.map((s) => [s, jobRows.filter((j) => j.stage === s).length])
  ) as Record<JobStage, number>;

  const activePipeline = jobRows
    .filter((j) => j.stage !== "completed")
    .reduce((sum, j) => sum + (j.approved_value ?? j.estimated_value ?? 0), 0);

  const completedValue = jobRows
    .filter((j) => j.stage === "completed")
    .reduce((sum, j) => sum + (j.approved_value ?? j.estimated_value ?? 0), 0);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const leadsThisMonth = leadRows.filter((l) => new Date(l.created_at) >= monthStart).length;

  const maxStatus = Math.max(1, ...Object.values(leadByStatus));
  const maxSource = Math.max(1, ...Object.values(leadBySource));

  return (
    <>
      <PageHeader title="Reports" subtitle="Pipeline health and conversion metrics." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Leads" value={totalLeads} accent="blue" hint={`${leadsThisMonth} this month`} />
        <StatCard label="Conversion" value={`${conversion}%`} accent="green" hint={`${won} won`} />
        <StatCard label="Active Pipeline" value={formatCurrency(activePipeline)} accent="gold" hint="Open job value" />
        <StatCard label="Completed Value" value={formatCurrency(completedValue)} accent="green" hint="Finished jobs" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-4 font-semibold text-zinc-800">Leads by Status</h2>
          <div className="space-y-3">
            {LEAD_STATUSES.map((s) => (
              <BarRow
                key={s}
                label={LEAD_STATUS_LABELS[s]}
                value={leadByStatus[s]}
                max={maxStatus}
                badge={LEAD_STATUS_STYLES[s]}
              />
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 font-semibold text-zinc-800">Jobs by Stage</h2>
          <div className="space-y-3">
            {JOB_STAGES.map((s) => (
              <BarRow
                key={s}
                label={JOB_STAGE_LABELS[s]}
                value={jobByStage[s]}
                max={Math.max(1, ...Object.values(jobByStage))}
                badge={JOB_STAGE_STYLES[s]}
              />
            ))}
          </div>
        </div>

        <div className="card p-6 lg:col-span-2">
          <h2 className="mb-4 font-semibold text-zinc-800">Lead Sources</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {LEAD_SOURCES.map((s) => (
              <BarRow
                key={s}
                label={s.charAt(0).toUpperCase() + s.slice(1)}
                value={leadBySource[s]}
                max={maxSource}
                badge="bg-brand-700/15 text-brand-700"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function BarRow({
  label,
  value,
  max,
  badge,
}: {
  label: string;
  value: number;
  max: number;
  badge: string;
}) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-sm text-zinc-600">{label}</span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
        <div className={`h-full rounded-full ${badge.split(" ")[0]}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 shrink-0 text-right text-sm font-semibold text-zinc-700">{value}</span>
    </div>
  );
}
