import Link from "next/link";
import { createLead } from "../actions";
import { PageHeader } from "@/components/page-header";
import { DAMAGE_TYPES } from "@/lib/constants";

export default function NewLeadPage() {
  return (
    <>
      <PageHeader title="New Lead" subtitle="Manually log a phone, referral, or walk-in inquiry." />
      <div className="card max-w-2xl p-6">
        <form action={createLead} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="first_name">First Name *</label>
              <input id="first_name" name="first_name" required className="input" />
            </div>
            <div>
              <label className="label" htmlFor="last_name">Last Name</label>
              <input id="last_name" name="last_name" className="input" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="phone">Phone</label>
              <input id="phone" name="phone" type="tel" className="input" />
            </div>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" className="input" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="damage_type">Type of Damage</label>
              <select id="damage_type" name="damage_type" className="input" defaultValue="">
                <option value="">Select…</option>
                {DAMAGE_TYPES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="insurance_carrier">Insurance Carrier</label>
              <input id="insurance_carrier" name="insurance_carrier" className="input" />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="message">Notes / Situation</label>
            <textarea id="message" name="message" rows={4} className="input" />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="btn-gold">Create Lead</button>
            <Link href="/admin/leads" className="btn-ghost">Cancel</Link>
          </div>
        </form>
      </div>
    </>
  );
}
