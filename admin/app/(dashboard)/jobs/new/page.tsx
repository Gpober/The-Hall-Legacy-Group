import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createJob } from "../actions";
import { PageHeader } from "@/components/page-header";
import { JobFields } from "@/components/job-fields";
import { fullName } from "@/lib/format";
import { EmptyState } from "@/components/empty-state";
import type { Customer } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function NewJobPage({
  searchParams,
}: {
  searchParams: { customer?: string };
}) {
  const supabase = createClient();
  const preselected = searchParams.customer;

  let customer: Customer | null = null;
  if (preselected) {
    const { data } = await supabase.from("customers").select("*").eq("id", preselected).single<Customer>();
    if (!data) notFound();
    customer = data;
  }

  const { data: customers } = await supabase
    .from("customers")
    .select("id,first_name,last_name")
    .order("first_name", { ascending: true });

  if (!customers || customers.length === 0) {
    return (
      <>
        <PageHeader title="New Job" />
        <EmptyState
          title="Add a customer first"
          hint="Jobs are attached to a customer. Create a customer, then add a job."
        />
        <div className="mt-4">
          <Link href="/customers/new" className="btn-gold">+ New Customer</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="New Job"
        subtitle={customer ? `For ${fullName(customer.first_name, customer.last_name)}` : "Track a new restoration project."}
      />
      <div className="card max-w-2xl p-6">
        <form action={createJob} className="space-y-4">
          {customer ? (
            <input type="hidden" name="customer_id" value={customer.id} />
          ) : (
            <div>
              <label className="label" htmlFor="customer_id">Customer *</label>
              <select id="customer_id" name="customer_id" required defaultValue="" className="input">
                <option value="" disabled>Select a customer…</option>
                {(customers as Pick<Customer, "id" | "first_name" | "last_name">[]).map((c) => (
                  <option key={c.id} value={c.id}>{fullName(c.first_name, c.last_name)}</option>
                ))}
              </select>
            </div>
          )}
          <JobFields />
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="btn-gold">Create Job</button>
            <Link href={customer ? `/customers/${customer.id}` : "/jobs"} className="btn-ghost">Cancel</Link>
          </div>
        </form>
      </div>
    </>
  );
}
