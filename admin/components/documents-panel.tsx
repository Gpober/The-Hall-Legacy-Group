"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  DOC_CATEGORIES,
  DOC_CATEGORY_LABELS,
  type DocCategory,
} from "@/lib/constants";
import { addDocument, deleteDocument, getSignedUrl } from "@/app/(dashboard)/documents/actions";
import type { DocumentRow } from "@/lib/types";

function fileSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentsPanel({
  jobId,
  customerId,
  documents,
}: {
  jobId: string;
  customerId: string | null;
  documents: DocumentRow[];
}) {
  const supabase = createClient();
  const router = useRouter();
  const [category, setCategory] = useState<DocCategory>("scope");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `jobs/${jobId}/${Date.now()}-${safe}`;
      const { error: upErr } = await supabase.storage
        .from("documents")
        .upload(path, file, { upsert: false });
      if (upErr) throw upErr;
      await addDocument({
        name: file.name,
        storage_path: path,
        file_type: file.type || null,
        size: file.size,
        category,
        job_id: jobId,
        customer_id: customerId,
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDownload(path: string) {
    const url = await getSignedUrl(path);
    if (url) window.open(url, "_blank");
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as DocCategory)}
          className="input w-auto"
        >
          {DOC_CATEGORIES.map((c) => (
            <option key={c} value={c}>{DOC_CATEGORY_LABELS[c]}</option>
          ))}
        </select>
        <label className={`btn-green cursor-pointer ${uploading ? "opacity-60" : ""}`}>
          {uploading ? "Uploading…" : "Upload File"}
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {error && <p className="mb-3 text-sm text-rose-600">{error}</p>}

      {documents.length ? (
        <ul className="divide-y divide-zinc-100">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <button
                  onClick={() => handleDownload(doc.storage_path)}
                  className="truncate text-left text-sm font-medium text-brand-700 hover:underline"
                >
                  {doc.name}
                </button>
                <p className="text-xs text-zinc-400">
                  {DOC_CATEGORY_LABELS[doc.category]} · {fileSize(doc.size)}
                </p>
              </div>
              <button
                onClick={() =>
                  startTransition(async () => {
                    await deleteDocument(doc.id, doc.storage_path, jobId);
                    router.refresh();
                  })
                }
                disabled={pending}
                className="text-xs font-semibold text-rose-500 hover:text-rose-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-6 text-center text-sm text-zinc-400">
          No documents. Upload scopes, estimates, contracts, or photos.
        </p>
      )}
    </div>
  );
}
