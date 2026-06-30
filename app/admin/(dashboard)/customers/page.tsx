import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { fullName, formatDate, initials } from "@/lib/format";
import type { Customer } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const supabase = createClient();
  const q = (searchParams.q || "").trim();

  let query = supabase.from("customers").select("*").order("created_at", { ascending: false });
  if (q) {
    query = query.or(
      `first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,city.ilike.%${q}%`
    );
  }
  const { data: customers } = await query;

  return (
    <>
      <PageHeader title="Customers" subtitle="Converted clients and active accounts.">
        <Link href="/admin/customers/new" className="btn-gold">
          + New Customer
        </Link>
      </PageHeader>

      <form className="mb-4" action="/admin/customers">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search customers…"
          className="input max-w-xs"
        />
      </form>

      {customers && customers.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(customers as Customer[]).map((c) => (
            <Link key={c.id} href={`/admin/customers/${c.id}`} className="card p-5 transition hover:shadow-md">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-brand-700/10 font-bold text-brand-700">
                  {initials(c.first_name, c.last_name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-zinc-800">
                    {fullName(c.first_name, c.last_name)}
                  </p>
                  <p className="truncate text-xs text-zinc-400">
                    {[c.city, c.state].filter(Boolean).join(", ") || "No location"}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-1 text-sm text-zinc-500">
                <p>{c.phone || c.email || "No contact info"}</p>
                <p className="text-xs text-zinc-400">Added {formatDate(c.created_at)}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No customers yet"
          hint="Convert a lead or add a customer manually to get started."
        />
      )}
    </>
  );
}
