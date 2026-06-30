import Link from "next/link";
import type { Customer } from "@/lib/types";

export function CustomerForm({
  action,
  customer,
  submitLabel,
  cancelHref,
}: {
  action: (formData: FormData) => void;
  customer?: Partial<Customer>;
  submitLabel: string;
  cancelHref: string;
}) {
  const c = customer ?? {};
  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="first_name">First Name *</label>
          <input id="first_name" name="first_name" required defaultValue={c.first_name ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="last_name">Last Name</label>
          <input id="last_name" name="last_name" defaultValue={c.last_name ?? ""} className="input" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" defaultValue={c.phone ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" defaultValue={c.email ?? ""} className="input" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="address">Street Address</label>
        <input id="address" name="address" defaultValue={c.address ?? ""} className="input" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="city">City</label>
          <input id="city" name="city" defaultValue={c.city ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="state">State</label>
          <input id="state" name="state" defaultValue={c.state ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="zip">ZIP</label>
          <input id="zip" name="zip" defaultValue={c.zip ?? ""} className="input" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="insurance_carrier">Insurance Carrier</label>
          <input id="insurance_carrier" name="insurance_carrier" defaultValue={c.insurance_carrier ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="policy_number">Policy Number</label>
          <input id="policy_number" name="policy_number" defaultValue={c.policy_number ?? ""} className="input" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="notes">Notes</label>
        <textarea id="notes" name="notes" rows={3} defaultValue={c.notes ?? ""} className="input" />
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" className="btn-gold">{submitLabel}</button>
        <Link href={cancelHref} className="btn-ghost">Cancel</Link>
      </div>
    </form>
  );
}
