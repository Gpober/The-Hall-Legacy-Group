import { createCustomer } from "../actions";
import { PageHeader } from "@/components/page-header";
import { CustomerForm } from "@/components/customer-form";

export default function NewCustomerPage() {
  return (
    <>
      <PageHeader title="New Customer" subtitle="Add a client record manually." />
      <div className="card max-w-2xl p-6">
        <CustomerForm action={createCustomer} submitLabel="Create Customer" cancelHref="/admin/customers" />
      </div>
    </>
  );
}
