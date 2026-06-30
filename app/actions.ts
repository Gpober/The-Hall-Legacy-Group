"use server";

import { createClient } from "@/lib/supabase/server";

export type LeadInput = {
  firstName: string;
  lastName?: string;
  phone?: string;
  email?: string;
  damageType?: string;
  carrier?: string;
  message?: string;
  company?: string; // honeypot
};

export async function submitLead(
  data: LeadInput
): Promise<{ ok: boolean; error?: string }> {
  // Honeypot: bots fill this hidden field. Pretend success, store nothing.
  if (data.company && data.company.trim()) return { ok: true };

  if (!data.firstName || !data.firstName.trim()) {
    return { ok: false, error: "Please enter your name." };
  }

  const supabase = createClient();
  const { error } = await supabase.from("leads").insert({
    first_name: data.firstName.trim(),
    last_name: data.lastName?.trim() || null,
    phone: data.phone?.trim() || null,
    email: data.email?.trim() || null,
    damage_type: data.damageType?.trim() || null,
    insurance_carrier: data.carrier?.trim() || null,
    message: data.message?.trim() || null,
    status: "new",
    source: "website",
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
