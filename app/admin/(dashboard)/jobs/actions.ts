"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { JOB_STAGE_LABELS, type JobStage } from "@/lib/constants";

function emptyToNull(value: FormDataEntryValue | null): string | null {
  const v = String(value ?? "").trim();
  return v.length ? v : null;
}
function numOrNull(value: FormDataEntryValue | null): number | null {
  const v = String(value ?? "").replace(/[^0-9.]/g, "").trim();
  return v.length ? Number(v) : null;
}

function jobPayload(formData: FormData) {
  return {
    title: String(formData.get("title") || "").trim(),
    job_type: emptyToNull(formData.get("job_type")),
    claim_number: emptyToNull(formData.get("claim_number")),
    insurance_carrier: emptyToNull(formData.get("insurance_carrier")),
    adjuster_name: emptyToNull(formData.get("adjuster_name")),
    adjuster_phone: emptyToNull(formData.get("adjuster_phone")),
    estimated_value: numOrNull(formData.get("estimated_value")),
    approved_value: numOrNull(formData.get("approved_value")),
    start_date: emptyToNull(formData.get("start_date")),
    target_completion: emptyToNull(formData.get("target_completion")),
    address: emptyToNull(formData.get("address")),
    notes: emptyToNull(formData.get("notes")),
  };
}

export async function createJob(formData: FormData) {
  const supabase = createClient();
  const customer_id = String(formData.get("customer_id") || "");
  if (!customer_id) throw new Error("A customer is required to create a job.");

  const { data, error } = await supabase
    .from("jobs")
    .insert({ ...jobPayload(formData), customer_id, stage: "inspection" })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  await supabase.from("activities").insert({
    job_id: data.id,
    customer_id,
    kind: "system",
    body: "Job created.",
  });

  revalidatePath("/admin/jobs");
  revalidatePath(`/admin/customers/${customer_id}`);
  redirect(`/admin/jobs/${data.id}`);
}

export async function updateJob(jobId: string, formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.from("jobs").update(jobPayload(formData)).eq("id", jobId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/jobs/${jobId}`);
  redirect(`/admin/jobs/${jobId}`);
}

export async function updateJobStage(jobId: string, stage: JobStage) {
  const supabase = createClient();
  const { data: job, error } = await supabase
    .from("jobs")
    .update({ stage })
    .eq("id", jobId)
    .select("customer_id")
    .single();
  if (error) throw new Error(error.message);

  await supabase.from("activities").insert({
    job_id: jobId,
    customer_id: job?.customer_id ?? null,
    kind: "status_change",
    body: `Stage moved to ${JOB_STAGE_LABELS[stage]}.`,
  });

  revalidatePath(`/admin/jobs/${jobId}`);
  revalidatePath("/admin/jobs");
}

export async function addJobNote(jobId: string, formData: FormData) {
  const body = String(formData.get("body") || "").trim();
  if (!body) return;
  const supabase = createClient();
  const { data: job } = await supabase.from("jobs").select("customer_id").eq("id", jobId).single();
  const { error } = await supabase.from("activities").insert({
    job_id: jobId,
    customer_id: job?.customer_id ?? null,
    kind: "note",
    body,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/jobs/${jobId}`);
}

export async function deleteJob(jobId: string) {
  const supabase = createClient();
  const { data: job } = await supabase.from("jobs").select("customer_id").eq("id", jobId).single();
  const { error } = await supabase.from("jobs").delete().eq("id", jobId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/jobs");
  if (job?.customer_id) redirect(`/admin/customers/${job.customer_id}`);
  redirect("/admin/jobs");
}
