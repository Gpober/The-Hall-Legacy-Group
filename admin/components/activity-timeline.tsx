import { relativeTime } from "@/lib/format";
import type { Activity } from "@/lib/types";

const KIND_DOT: Record<Activity["kind"], string> = {
  note: "bg-brand-600",
  status_change: "bg-blue-500",
  call: "bg-amber-500",
  email: "bg-violet-500",
  system: "bg-zinc-400",
};

export function ActivityTimeline({ activities }: { activities: Activity[] }) {
  if (!activities.length) {
    return (
      <p className="px-1 py-6 text-center text-sm text-zinc-400">
        No activity yet.
      </p>
    );
  }
  return (
    <ul className="space-y-4">
      {activities.map((a) => (
        <li key={a.id} className="flex gap-3">
          <span className="mt-1.5 flex flex-col items-center">
            <span className={`h-2.5 w-2.5 rounded-full ${KIND_DOT[a.kind]}`} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-zinc-700">{a.body}</p>
            <p className="text-xs text-zinc-400">
              {a.author ? `${a.author} · ` : ""}
              {relativeTime(a.created_at)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
