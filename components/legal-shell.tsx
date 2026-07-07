import Link from "next/link";

export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-brand-900">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg border-2 border-gold font-serif text-sm font-extrabold text-gold">
              HLG
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-extrabold tracking-wider text-white">
                HALL LEGACY GROUP
              </span>
              <span className="block text-[9px] font-semibold tracking-[0.28em] text-white/50">
                INSURANCE RESTORATION
              </span>
            </span>
          </Link>
          <Link href="/" className="text-sm font-semibold text-gold-soft hover:text-gold-bright">
            ← Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-serif text-3xl font-extrabold text-zinc-900 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: {updated}</p>
        <div className="legal mt-8 space-y-6 text-[15px] leading-relaxed text-zinc-700">
          {children}
        </div>
      </main>

      <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-400">
        © {new Date().getFullYear()} Hall Legacy Group ·{" "}
        <Link href="/privacy" className="hover:text-brand-700">Privacy</Link> ·{" "}
        <Link href="/terms" className="hover:text-brand-700">Terms</Link>
      </footer>
    </div>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 font-sans text-lg font-bold text-zinc-900">{heading}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
