import {
  LEAD_STATUS_LABELS,
  LEAD_STATUS_STYLES,
  JOB_STAGE_LABELS,
  JOB_STAGE_STYLES,
  type LeadStatus,
  type JobStage,
} from "@/lib/constants";

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={`badge ${LEAD_STATUS_STYLES[status]}`}>
      {LEAD_STATUS_LABELS[status]}
    </span>
  );
}

export function JobStageBadge({ stage }: { stage: JobStage }) {
  return (
    <span className={`badge ${JOB_STAGE_STYLES[stage]}`}>
      {JOB_STAGE_LABELS[stage]}
    </span>
  );
}
