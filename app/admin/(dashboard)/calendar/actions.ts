"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { AppointmentType } from "@/lib/constants";
import {
  createCalendarEvent,
  deleteCalendarEvent,
  googleConfigured,
} from "@/lib/google-calendar";

function emptyToNull(value: FormDataEntryValue | null): string | null {
  const v = String(value ?? "").trim();
  return v.length ? v : null;
}

// Returns the signed-in admin's Google refresh token, if they connected Google.
async function getGoogleRefreshToken(
  supabase: ReturnType<typeof createClient>
): Promise<string | null> {
  if (!googleConfigured()) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("google_tokens")
    .select("refresh_token")
    .eq("user_id", user.id)
    .maybeSingle();
  return data?.refresh_token ?? null;
}

export async function createAppointment(formData: FormData) {
  const supabase = createClient();
  const starts_at = String(formData.get("starts_at") || "");
  if (!starts_at) throw new Error("A start date/time is required.");

  const ends_at = formData.get("ends_at")
    ? new Date(String(formData.get("ends_at"))).toISOString()
    : null;
  const title = String(formData.get("title") || "").trim();
  const location = emptyToNull(formData.get("location"));
  const notes = emptyToNull(formData.get("notes"));

  const { data: appt, error } = await supabase
    .from("appointments")
    .insert({
      title,
      type: String(formData.get("type") || "inspection") as AppointmentType,
      starts_at: new Date(starts_at).toISOString(),
      ends_at,
      location,
      notes,
      customer_id: emptyToNull(formData.get("customer_id")),
      status: "scheduled",
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  // Best-effort Google Calendar sync — never block scheduling on it.
  try {
    const refreshToken = await getGoogleRefreshToken(supabase);
    if (refreshToken) {
      const eventId = await createCalendarEvent(refreshToken, {
        title,
        description: notes,
        location,
        startsAt: new Date(starts_at).toISOString(),
        endsAt: ends_at,
      });
      if (eventId) {
        await supabase
          .from("appointments")
          .update({ google_event_id: eventId })
          .eq("id", appt.id);
      }
    }
  } catch (err) {
    console.error("Google Calendar sync failed:", err);
  }

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

  // Remove the linked Google Calendar event first, if any.
  try {
    const { data: appt } = await supabase
      .from("appointments")
      .select("google_event_id")
      .eq("id", id)
      .maybeSingle();
    if (appt?.google_event_id) {
      const refreshToken = await getGoogleRefreshToken(supabase);
      if (refreshToken) await deleteCalendarEvent(refreshToken, appt.google_event_id);
    }
  } catch (err) {
    console.error("Google Calendar delete failed:", err);
  }

  const { error } = await supabase.from("appointments").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/calendar");
}
