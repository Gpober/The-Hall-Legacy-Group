import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { LeadStatusBadge } from "@/components/badges";
import { fullName, relativeTime, formatDateTime } from "@/lib/format";
import type { Lead, Appointment } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const now = new Date().toISOString();

  const [
    newLeads,
    openJobs,
    wonThisMonth,
    upcomingAppts,
    recentLeads,
    nextAppts,
    activeJobValue,
  ] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("jobs").select("id", { count: "exact", head: true }).neq("stage", "completed"),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "won")
      .gte("updated_at", startOfMonth.toISOString()),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("status", "scheduled")
      .gte("starts_at", now),
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("appointments")
      .select("*")
      .eq("status", "scheduled")
      .gte("starts_at", now)
      .order("starts_at", { ascending: true })
      .limit(5),
    supabase.from("jobs").select("approved_value, estimated_value").neq("stage", "completed"),
  ]);

  const pipeline = (activeJobValue.data ?? []).reduce(
    (sum, j: { approved_value: number | null; estimated_value: number | null }) =>
      sum + (j.approved_value ?? j.estimated_value ?? 0),
    0
  );

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Hall Legacy Group — operations at a glance.">
        <Link href="/leads/new" className="btn-gold">
          + New Lead
        </Link>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="New Leads" value={newLeads.count ?? 0} accent="blue" hint="Awaiting first contact" />
        <StatCard label="Open Jobs" value={openJobs.count ?? 0} accent="green" hint="In progress" />
        <StatCard label="Upcoming Appts" value={upcomingAppts.count ?? 0} accent="gold" hint="Scheduled ahead" />
        <StatCard
          label="Active Pipeline"
          value={pipeline ? `$${Math.round(pipeline / 1000)}k` : "$0"}
          accent="green"
          hint={`${wonThisMonth.count ?? 0} won this month`}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Recent leads */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3">
            <h2 className="font-semibold text-zinc-800">Recent Leads</h2>
            <Link href="/leads" className="text-sm font-semibold text-brand-700 hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-zinc-100">
            {(recentLeads.data as Lead[] | null)?.length ? (
              (recentLeads.data as Lead[]).map((lead) => (
                <Link
                  key={lead.id}
                  href={`/leads/${lead.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-zinc-50"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-zinc-800">
                      {fullName(lead.first_name, lead.last_name)}
                    </p>
                    <p className="truncate text-xs text-zinc-400">
                      {lead.damage_type || "—"} · {relativeTime(lead.created_at)}
                    </p>
                  </div>
                  <LeadStatusBadge status={lead.status} />
                </Link>
              ))
            ) : (
              <p className="px-5 py-8 text-center text-sm text-zinc-400">
                No leads yet. They’ll appear here as the website form is submitted.
              </p>
            )}
          </div>
        </div>

        {/* Upcoming appointments */}
        <div className="card">
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3">
            <h2 className="font-semibold text-zinc-800">Upcoming</h2>
            <Link href="/calendar" className="text-sm font-semibold text-brand-700 hover:underline">
              Calendar
            </Link>
          </div>
          <div className="divide-y divide-zinc-100">
            {(nextAppts.data as Appointment[] | null)?.length ? (
              (nextAppts.data as Appointment[]).map((a) => (
                <div key={a.id} className="px-5 py-3">
                  <p className="text-sm font-medium text-zinc-800">{a.title}</p>
                  <p className="text-xs text-zinc-400">{formatDateTime(a.starts_at)}</p>
                </div>
              ))
            ) : (
              <p className="px-5 py-8 text-center text-sm text-zinc-400">
                No upcoming appointments.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
