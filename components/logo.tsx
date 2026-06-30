export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`grid h-10 w-10 flex-none place-items-center rounded-lg border-2 font-serif text-sm font-extrabold ${
          dark ? "border-gold text-gold" : "border-gold text-gold"
        }`}
      >
        HLG
      </span>
      <span className="leading-tight">
        <span
          className={`block text-sm font-extrabold tracking-wider ${
            dark ? "text-zinc-900" : "text-white"
          }`}
        >
          HALL LEGACY GROUP
        </span>
        <span
          className={`block text-[9px] font-semibold tracking-[0.28em] ${
            dark ? "text-zinc-400" : "text-white/50"
          }`}
        >
          INSURANCE RESTORATION
        </span>
      </span>
    </div>
  );
}
