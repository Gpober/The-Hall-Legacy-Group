import { login } from "./actions";
import { Logo } from "@/components/logo";
import { GoogleSignInButton } from "@/components/google-signin-button";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-850 via-brand-900 to-brand-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="card p-8">
          <h1 className="font-serif text-2xl font-extrabold text-zinc-900">
            Admin Sign In
          </h1>
          <p className="mb-6 mt-1 text-sm text-zinc-500">
            Hall Legacy Group internal CRM.
          </p>

          {searchParams.error && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {searchParams.error}
            </div>
          )}

          <form action={login} className="space-y-4">
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="input"
                placeholder="you@thehalllegacygrp.com"
              />
            </div>
            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="input"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="btn-gold w-full">
              Sign In
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-zinc-200" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">or</span>
            <span className="h-px flex-1 bg-zinc-200" />
          </div>

          <GoogleSignInButton />
        </div>
        <p className="mt-6 text-center text-xs text-white/40">
          Authorized personnel only.
        </p>
      </div>
    </div>
  );
}
