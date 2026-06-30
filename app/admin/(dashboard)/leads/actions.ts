"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LEAD_STATUS_LABELS, type LeadStatus } from "@/lib/constants";

export async function createLead(formData: FormData) {
  const supabase = createClient();
  const payload = {
    first_name: String(formData.get("first_name") || "").trim(),
    last_name: emptyToNull(formData.get("last_name")),
    email: emptyToNull(formData.get("email")),
    phone: emptyToNull(formData.get("phone")),
    damage_type: emptyToNull(formData.get("damage_type")),
    insurance_carrier: emptyToNull(formData.get("insurance_carrier")),
    message: emptyToNull(formData.get("message")),
    source: "manual" as const,
    status: "new" as const,
  };

  const { data, error } = await supabase
    .from("leads")
    .insert(payload)
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/leads");
  redirect(`/admin/leads/${data.id}`);
}

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const supabase = createClient();
  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", leadId);
  if (error) throw new Error(error.message);

  await supabase.from("activities").insert({
    lead_id: leadId,
    kind: "status_change",
    body: `Status changed to ${LEAD_STATUS_LABELS[status]}.`,
  });

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");
}

export async function addLeadNote(leadId: string, formData: FormData) {
  const body = String(formData.get("body") || "").trim();
  if (!body) return;
  const supabase = createClient();
  const { error } = await supabase.from("activities").insert({
    lead_id: leadId,
    kind: "note",
    body,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function convertLeadToCustomer(leadId: string) {
  const supabase = createClient();

  const { data: lead, error: leadErr } = await supabase
    .from("leads")
    .select("*")
    .eq("id", leadId)
    .single();
  if (leadErr || !lead) throw new Error(leadErr?.message || "Lead not found");

  // Reuse existing customer link if present
  if (lead.customer_id) redirect(`/admin/customers/${lead.customer_id}`);

  const { data: customer, error: custErr } = await supabase
    .from("customers")
    .insert({
      first_name: lead.first_name,
      last_name: lead.last_name,
      email: lead.email,
      phone: lead.phone,
      insurance_carrier: lead.insurance_carrier,
      notes: lead.message,
    })
    .select("id")
    .single();
  if (custErr) throw new Error(custErr.message);

  await supabase
    .from("leads")
    .update({ customer_id: customer.id, status: "won" })
    .eq("id", leadId);

  await supabase.from("activities").insert([
    {
      lead_id: leadId,
      customer_id: customer.id,
      kind: "system",
      body: "Lead converted to customer.",
    },
  ]);

  revalidatePath("/admin/leads");
  revalidatePath("/admin/customers");
  redirect(`/admin/customers/${customer.id}`);
}

export async function deleteLead(leadId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("leads").delete().eq("id", leadId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/leads");
  redirect("/admin/leads");
}

function emptyToNull(value: FormDataEntryValue | null): string | null {
  const v = String(value ?? "").trim();
  return v.length ? v : null;
}
