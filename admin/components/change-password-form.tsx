"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ChangePasswordForm() {
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (password.length < 8) {
      setMsg({ type: "err", text: "Password must be at least 8 characters." });
      return;
    }
    if (password !== confirm) {
      setMsg({ type: "err", text: "Passwords do not match." });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setMsg({ type: "err", text: error.message });
    } else {
      setPassword("");
      setConfirm("");
      setMsg({ type: "ok", text: "Password updated." });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="np">New Password</label>
        <input
          id="np"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          className="input"
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="cp">Confirm Password</label>
        <input
          id="cp"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          className="input"
          required
        />
      </div>
      {msg && (
        <p className={`text-sm ${msg.type === "ok" ? "text-emerald-600" : "text-rose-600"}`}>
          {msg.text}
        </p>
      )}
      <button type="submit" disabled={busy} className="btn-gold">
        {busy ? "Saving…" : "Update Password"}
      </button>
    </form>
  );
}
