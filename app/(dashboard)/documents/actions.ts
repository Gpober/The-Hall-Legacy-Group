"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { DocCategory } from "@/lib/constants";

export async function addDocument(input: {
  name: string;
  storage_path: string;
  file_type: string | null;
  size: number | null;
  category: DocCategory;
  job_id?: string | null;
  customer_id?: string | null;
  lead_id?: string | null;
}) {
  const supabase = createClient();
  const { error } = await supabase.from("documents").insert({
    name: input.name,
    storage_path: input.storage_path,
    file_type: input.file_type,
    size: input.size,
    category: input.category,
    job_id: input.job_id ?? null,
    customer_id: input.customer_id ?? null,
    lead_id: input.lead_id ?? null,
  });
  if (error) throw new Error(error.message);
  if (input.job_id) revalidatePath(`/jobs/${input.job_id}`);
  if (input.customer_id) revalidatePath(`/customers/${input.customer_id}`);
}

export async function deleteDocument(id: string, storagePath: string, jobId?: string | null) {
  const supabase = createClient();
  await supabase.storage.from("documents").remove([storagePath]);
  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) throw new Error(error.message);
  if (jobId) revalidatePath(`/jobs/${jobId}`);
}

export async function getSignedUrl(storagePath: string): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(storagePath, 60 * 5);
  if (error) return null;
  return data.signedUrl;
}
