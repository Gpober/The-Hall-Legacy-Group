"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { AppointmentType } from "@/lib/constants";

function emptyToNull(value: FormDataEntryValue | null): string | null {
  const v = String(value ?? "").trim();
  return v.length ? v : null;
}

export async function createAppointment(formData: FormData) {
  const supabase = createClient();
  const starts_at = String(formData.get("starts_at") || "");
  if (!starts_at) throw new Error("A start date/time is required.");

  const { error } = await supabase.from("appointments").insert({
    title: String(formData.get("title") || "").trim(),
    type: (String(formData.get("type") || "inspection") as AppointmentType),
    starts_at: new Date(starts_at).toISOString(),
    ends_at: formData.get("ends_at")
      ? new Date(String(formData.get("ends_at"))).toISOString()
      : null,
    location: emptyToNull(formData.get("location")),
    notes: emptyToNull(formData.get("notes")),
    customer_id: emptyToNull(formData.get("customer_id")),
    status: "scheduled",
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/calendar");
}

export async function setAppointmentStatus(
  id: string,
  status: "scheduled" | "completed" | "canceled"
) {
  const supabase = createClient();
  const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/calendar");
}

export async function deleteAppointment(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("appointments").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/calendar");
}
