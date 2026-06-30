"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { JOB_STAGES, JOB_STAGE_LABELS, type JobStage } from "@/lib/constants";
import { updateJobStage } from "@/app/(dashboard)/jobs/actions";

const FLOW: JobStage[] = [
  "inspection",
  "scope_review",
  "approved",
  "in_progress",
  "walkthrough",
  "completed",
];

export function JobStageTracker({
  jobId,
  stage,
}: {
  jobId: string;
  stage: JobStage;
}) {
  const [pending, start] = useTransition();
  const router = useRouter();
  const currentIndex = FLOW.indexOf(stage);

  const setStage = (s: JobStage) =>
    start(async () => {
      await updateJobStage(jobId, s);
      router.refresh();
    });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5">
        {FLOW.map((s, i) => {
          const done = currentIndex >= 0 && i <= currentIndex;
          return (
            <button
              key={s}
              onClick={() => setStage(s)}
              disabled={pending}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                s === stage
                  ? "bg-brand-800 text-white ring-2 ring-brand-800 ring-offset-1"
                  : done
                  ? "bg-brand-600/15 text-brand-700 hover:bg-brand-600/25"
                  : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
              }`}
            >
              {JOB_STAGE_LABELS[s]}
            </button>
          );
        })}
        <button
          onClick={() => setStage("on_hold")}
          disabled={pending}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            stage === "on_hold"
              ? "bg-zinc-700 text-white"
              : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
          }`}
        >
          On Hold
        </button>
      </div>
    </div>
  );
}
