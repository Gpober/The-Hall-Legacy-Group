"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  setAppointmentStatus,
  deleteAppointment,
} from "@/app/(dashboard)/calendar/actions";

export function AppointmentActions({
  id,
  status,
}: {
  id: string;
  status: "scheduled" | "completed" | "canceled";
}) {
  const [pending, start] = useTransition();
  const router = useRouter();

  const run = (fn: () => Promise<void>) =>
    start(async () => {
      await fn();
      router.refresh();
    });

  return (
    <div className="flex items-center gap-2 text-xs font-semibold">
      {status !== "completed" && (
        <button
          onClick={() => run(() => setAppointmentStatus(id, "completed"))}
          disabled={pending}
          className="text-emerald-600 hover:text-emerald-800"
        >
          Mark done
        </button>
      )}
      {status !== "canceled" && (
        <button
          onClick={() => run(() => setAppointmentStatus(id, "canceled"))}
          disabled={pending}
          className="text-amber-600 hover:text-amber-800"
        >
          Cancel
        </button>
      )}
      <button
        onClick={() => run(() => deleteAppointment(id))}
        disabled={pending}
        className="text-rose-500 hover:text-rose-700"
      >
        Delete
      </button>
    </div>
  );
}
