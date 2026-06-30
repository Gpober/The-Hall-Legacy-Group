import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateCustomer } from "../../actions";
import { PageHeader } from "@/components/page-header";
import { CustomerForm } from "@/components/customer-form";
import type { Customer } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditCustomerPage({
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

  return (
    <>
      <PageHeader title="Edit Customer" />
      <div className="card max-w-2xl p-6">
        <CustomerForm
          action={updateCustomer.bind(null, customer.id)}
          customer={customer}
          submitLabel="Save Changes"
          cancelHref={`/customers/${customer.id}`}
        />
      </div>
    </>
  );
}
