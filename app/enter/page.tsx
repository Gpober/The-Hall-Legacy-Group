import { enterSite } from "./actions";
import { Logo } from "@/components/logo";

export const metadata = {
  title: "Hall Legacy Group",
  robots: { index: false, follow: false },
};

export default function EnterPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-850 via-brand-900 to-brand-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo showTagline={false} />
        </div>
        <div className="card p-8">
          <h1 className="font-serif text-2xl font-extrabold text-zinc-900">
            Enter Password
          </h1>
          <p className="mb-6 mt-1 text-sm text-zinc-500">
            This site is private. Please enter the password to continue.
          </p>

          {searchParams.error && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              Incorrect password. Please try again.
            </div>
          )}

          <form action={enterSite} className="space-y-4">
            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoFocus
                autoComplete="off"
                className="input"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="btn-gold w-full">
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
