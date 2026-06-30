import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateJob } from "../../actions";
import { PageHeader } from "@/components/page-header";
import { JobFields } from "@/components/job-fields";
import type { Job } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditJobPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: job } = await supabase.from("jobs").select("*").eq("id", params.id).single<Job>();
  if (!job) notFound();

  return (
    <>
      <PageHeader title="Edit Job" />
      <div className="card max-w-2xl p-6">
        <form action={updateJob.bind(null, job.id)} className="space-y-4">
          <JobFields job={job} />
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="btn-gold">Save Changes</button>
            <Link href={`/jobs/${job.id}`} className="btn-ghost">Cancel</Link>
          </div>
        </form>
      </div>
    </>
  );
}
