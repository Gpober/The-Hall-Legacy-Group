export function StatCard({
  label,
  value,
  hint,
  accent = "green",
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "green" | "gold" | "blue" | "rose";
}) {
  const accents: Record<string, string> = {
    green: "text-brand-700",
    gold: "text-gold",
    blue: "text-blue-600",
    rose: "text-rose-600",
  };
  return (
    <div className="card flex flex-col items-center p-5 text-center">
      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
        {label}
      </p>
      <p className={`mt-2 font-serif text-3xl font-extrabold ${accents[accent]}`}>
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-zinc-400">{hint}</p>}
    </div>
  );
}
