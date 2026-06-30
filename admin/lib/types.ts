import type {
  LeadStatus,
  JobStage,
  LeadSource,
  AppointmentType,
  DocCategory,
} from "./constants";

export type Lead = {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  damage_type: string | null;
  insurance_carrier: string | null;
  message: string | null;
  status: LeadStatus;
  source: LeadSource;
  customer_id: string | null;
};

export type Customer = {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  insurance_carrier: string | null;
  policy_number: string | null;
  notes: string | null;
};

export type Job = {
  id: string;
  created_at: string;
  updated_at: string;
  customer_id: string;
  lead_id: string | null;
  title: string;
  job_type: string | null;
  stage: JobStage;
  claim_number: string | null;
  insurance_carrier: string | null;
  adjuster_name: string | null;
  adjuster_phone: string | null;
  estimated_value: number | null;
  approved_value: number | null;
  start_date: string | null;
  target_completion: string | null;
  address: string | null;
  notes: string | null;
};

export type Appointment = {
  id: string;
  created_at: string;
  title: string;
  type: AppointmentType;
  lead_id: string | null;
  customer_id: string | null;
  job_id: string | null;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  notes: string | null;
  status: "scheduled" | "completed" | "canceled";
};

export type DocumentRow = {
  id: string;
  created_at: string;
  lead_id: string | null;
  customer_id: string | null;
  job_id: string | null;
  name: string;
  storage_path: string;
  file_type: string | null;
  size: number | null;
  category: DocCategory;
};

export type Activity = {
  id: string;
  created_at: string;
  lead_id: string | null;
  customer_id: string | null;
  job_id: string | null;
  kind: "note" | "status_change" | "call" | "email" | "system";
  body: string;
  author: string | null;
};
