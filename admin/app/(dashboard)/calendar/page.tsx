import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { AppointmentActions } from "@/components/appointment-actions";
import { createAppointment } from "./actions";
import { formatDateTime, fullName } from "@/lib/format";
import {
  APPOINTMENT_TYPES,
  APPOINTMENT_TYPE_LABELS,
} from "@/lib/constants";
import type { Appointment, Customer } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  scheduled: "bg-violet-100 text-violet-800",
  completed: "bg-emerald-100 text-emerald-800",
  canceled: "bg-zinc-200 text-zinc-600",
};

export default async function CalendarPage() {
  const supabase = createClient();
  const nowIso = new Date().toISOString();

  const [{ data: upcoming }, { data: past }, { data: customers }] = await Promise.all([
    supabase
      .from("appointments")
      .select("*")
      .gte("starts_at", nowIso)
      .neq("status", "canceled")
      .order("starts_at", { ascending: true }),
    supabase
      .from("appointments")
      .select("*")
      .lt("starts_at", nowIso)
      .order("starts_at", { ascending: false })
      .limit(20),
    supabase.from("customers").select("id,first_name,last_name").order("first_name"),
  ]);

  return (
    <>
      <PageHeader title="Calendar" subtitle="Inspections, walkthroughs, and meetings." />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* New appointment */}
        <div className="card h-fit p-6 lg:order-2">
          <h2 className="mb-4 font-semibold text-zinc-800">Schedule Appointment</h2>
          <form action={createAppointment} className="space-y-3">
            <div>
              <label className="label" htmlFor="title">Title *</label>
              <input id="title" name="title" required placeholder="Roof inspection — Smith" className="input" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="type">Type</label>
                <select id="type" name="type" className="input" defaultValue="inspection">
                  {APPOINTMENT_TYPES.map((t) => (
                    <option key={t} value={t}>{APPOINTMENT_TYPE_LABELS[t]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="customer_id">Customer</label>
                <select id="customer_id" name="customer_id" className="input" defaultValue="">
                  <option value="">None</option>
                  {(customers as Pick<Customer, "id" | "first_name" | "last_name">[] | null)?.map((c) => (
                    <option key={c.id} value={c.id}>{fullName(c.first_name, c.last_name)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="starts_at">Starts *</label>
                <input id="starts_at" name="starts_at" type="datetime-local" required className="input" />
              </div>
              <div>
                <label className="label" htmlFor="ends_at">Ends</label>
                <input id="ends_at" name="ends_at" type="datetime-local" className="input" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="location">Location</label>
              <input id="location" name="location" placeholder="Property address" className="input" />
            </div>
            <div>
              <label className="label" htmlFor="notes">Notes</label>
              <textarea id="notes" name="notes" rows={2} className="input" />
            </div>
            <button type="submit" className="btn-gold w-full">Add to Calendar</button>
          </form>
        </div>

        {/* Lists */}
        <div className="space-y-6 lg:col-span-2 lg:order-1">
          <Section title="Upcoming" appts={(upcoming as Appointment[]) ?? []} statusStyle={STATUS_STYLE} empty="No upcoming appointments." />
          <Section title="Past" appts={(past as Appointment[]) ?? []} statusStyle={STATUS_STYLE} empty="No past appointments." muted />
        </div>
      </div>
    </>
  );
}

function Section({
  title,
  appts,
  statusStyle,
  empty,
  muted,
}: {
  title: string;
  appts: Appointment[];
  statusStyle: Record<string, string>;
  empty: string;
  muted?: boolean;
}) {
  return (
    <div className="card">
      <div className="border-b border-zinc-100 px-5 py-3">
        <h2 className="font-semibold text-zinc-800">{title}</h2>
      </div>
      {appts.length ? (
        <div className="divide-y divide-zinc-100">
          {appts.map((a) => (
            <div key={a.id} className={`flex flex-wrap items-center justify-between gap-3 px-5 py-3 ${muted ? "opacity-80" : ""}`}>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-zinc-800">{a.title}</p>
                  <span className={`badge ${statusStyle[a.status]}`}>{a.status}</span>
                </div>
                <p className="text-xs text-zinc-400">
                  {formatDateTime(a.starts_at)}
                  {a.location ? ` · ${a.location}` : ""}
                </p>
              </div>
              <AppointmentActions id={a.id} status={a.status} />
            </div>
          ))}
        </div>
      ) : (
        <p className="px-5 py-8 text-center text-sm text-zinc-400">{empty}</p>
      )}
    </div>
  );
}
