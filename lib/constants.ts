// Shared domain constants for the Hall Legacy CRM.

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "scheduled",
  "inspected",
  "quoted",
  "won",
  "lost",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  scheduled: "Scheduled",
  inspected: "Inspected",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
};

export const LEAD_STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-amber-100 text-amber-800",
  scheduled: "bg-violet-100 text-violet-800",
  inspected: "bg-cyan-100 text-cyan-800",
  quoted: "bg-indigo-100 text-indigo-800",
  won: "bg-emerald-100 text-emerald-800",
  lost: "bg-rose-100 text-rose-700",
};

export const JOB_STAGES = [
  "inspection",
  "scope_review",
  "approved",
  "in_progress",
  "walkthrough",
  "completed",
  "on_hold",
] as const;
export type JobStage = (typeof JOB_STAGES)[number];

export const JOB_STAGE_LABELS: Record<JobStage, string> = {
  inspection: "Inspection",
  scope_review: "Scope Review",
  approved: "Approved",
  in_progress: "In Progress",
  walkthrough: "Walkthrough",
  completed: "Completed",
  on_hold: "On Hold",
};

export const JOB_STAGE_STYLES: Record<JobStage, string> = {
  inspection: "bg-blue-100 text-blue-800",
  scope_review: "bg-amber-100 text-amber-800",
  approved: "bg-teal-100 text-teal-800",
  in_progress: "bg-indigo-100 text-indigo-800",
  walkthrough: "bg-violet-100 text-violet-800",
  completed: "bg-emerald-100 text-emerald-800",
  on_hold: "bg-zinc-200 text-zinc-700",
};

export const DAMAGE_TYPES = [
  "Roof / Storm / Hail",
  "Water / Flood",
  "Fire / Smoke",
  "Siding / Exterior",
  "Interior Damage",
  "Other / Not Sure",
] as const;

export const LEAD_SOURCES = ["website", "phone", "referral", "manual"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const APPOINTMENT_TYPES = [
  "inspection",
  "walkthrough",
  "meeting",
  "other",
] as const;
export type AppointmentType = (typeof APPOINTMENT_TYPES)[number];

export const APPOINTMENT_TYPE_LABELS: Record<AppointmentType, string> = {
  inspection: "Inspection",
  walkthrough: "Walkthrough",
  meeting: "Meeting",
  other: "Other",
};

export const DOC_CATEGORIES = [
  "scope",
  "estimate",
  "photo",
  "contract",
  "other",
] as const;
export type DocCategory = (typeof DOC_CATEGORIES)[number];

export const DOC_CATEGORY_LABELS: Record<DocCategory, string> = {
  scope: "Carrier Scope",
  estimate: "Estimate",
  photo: "Photo",
  contract: "Contract",
  other: "Other",
};
