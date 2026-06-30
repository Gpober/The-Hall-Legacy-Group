"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function emptyToNull(value: FormDataEntryValue | null): string | null {
  const v = String(value ?? "").trim();
  return v.length ? v : null;
}

function customerPayload(formData: FormData) {
  return {
    first_name: String(formData.get("first_name") || "").trim(),
    last_name: emptyToNull(formData.get("last_name")),
    email: emptyToNull(formData.get("email")),
    phone: emptyToNull(formData.get("phone")),
    address: emptyToNull(formData.get("address")),
    city: emptyToNull(formData.get("city")),
    state: emptyToNull(formData.get("state")),
    zip: emptyToNull(formData.get("zip")),
    insurance_carrier: emptyToNull(formData.get("insurance_carrier")),
    policy_number: emptyToNull(formData.get("policy_number")),
    notes: emptyToNull(formData.get("notes")),
  };
}

export async function createCustomer(formData: FormData) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("customers")
    .insert(customerPayload(formData))
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/customers");
  redirect(`/customers/${data.id}`);
}

export async function updateCustomer(customerId: string, formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase
    .from("customers")
    .update(customerPayload(formData))
    .eq("id", customerId);
  if (error) throw new Error(error.message);
  revalidatePath(`/customers/${customerId}`);
  redirect(`/customers/${customerId}`);
}

export async function addCustomerNote(customerId: string, formData: FormData) {
  const body = String(formData.get("body") || "").trim();
  if (!body) return;
  const supabase = createClient();
  const { error } = await supabase.from("activities").insert({
    customer_id: customerId,
    kind: "note",
    body,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/customers/${customerId}`);
}

export async function deleteCustomer(customerId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("customers").delete().eq("id", customerId);
  if (error) throw new Error(error.message);
  revalidatePath("/customers");
  redirect("/customers");
}
