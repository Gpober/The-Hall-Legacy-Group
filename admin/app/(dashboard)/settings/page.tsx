import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { ChangePasswordForm } from "@/components/change-password-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your admin account." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-4 font-semibold text-zinc-800">Account</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-zinc-400">Email</dt>
              <dd className="text-zinc-800">{user?.email}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-zinc-400">User ID</dt>
              <dd className="truncate text-xs text-zinc-500">{user?.id}</dd>
            </div>
          </dl>
        </div>
        <div className="card p-6">
          <h2 className="mb-4 font-semibold text-zinc-800">Change Password</h2>
          <ChangePasswordForm />
        </div>
      </div>
    </>
  );
}
