import { DAMAGE_TYPES } from "@/lib/constants";
import type { Job } from "@/lib/types";

export function JobFields({ job }: { job?: Partial<Job> }) {
  const j = job ?? {};
  return (
    <>
      <div>
        <label className="label" htmlFor="title">Job Title *</label>
        <input id="title" name="title" required defaultValue={j.title ?? ""} placeholder="e.g. Roof replacement — 123 Oak St" className="input" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="job_type">Type of Work</label>
          <select id="job_type" name="job_type" defaultValue={j.job_type ?? ""} className="input">
            <option value="">Select…</option>
            {DAMAGE_TYPES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="claim_number">Claim Number</label>
          <input id="claim_number" name="claim_number" defaultValue={j.claim_number ?? ""} className="input" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="insurance_carrier">Insurance Carrier</label>
          <input id="insurance_carrier" name="insurance_carrier" defaultValue={j.insurance_carrier ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="address">Property Address</label>
          <input id="address" name="address" defaultValue={j.address ?? ""} className="input" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="adjuster_name">Adjuster Name</label>
          <input id="adjuster_name" name="adjuster_name" defaultValue={j.adjuster_name ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="adjuster_phone">Adjuster Phone</label>
          <input id="adjuster_phone" name="adjuster_phone" defaultValue={j.adjuster_phone ?? ""} className="input" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="estimated_value">Estimated Value ($)</label>
          <input id="estimated_value" name="estimated_value" inputMode="decimal" defaultValue={j.estimated_value ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="approved_value">Approved Value ($)</label>
          <input id="approved_value" name="approved_value" inputMode="decimal" defaultValue={j.approved_value ?? ""} className="input" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="start_date">Start Date</label>
          <input id="start_date" name="start_date" type="date" defaultValue={j.start_date ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="target_completion">Target Completion</label>
          <input id="target_completion" name="target_completion" type="date" defaultValue={j.target_completion ?? ""} className="input" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="notes">Notes</label>
        <textarea id="notes" name="notes" rows={3} defaultValue={j.notes ?? ""} className="input" />
      </div>
    </>
  );
}
