export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col items-center gap-4 text-center">
      <div>
        <h1 className="font-serif text-2xl font-extrabold text-zinc-900 sm:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
      </div>
      {children && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
