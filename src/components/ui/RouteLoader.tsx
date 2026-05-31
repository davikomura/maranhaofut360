export function RouteLoader() {
  return (
    <div className="min-h-[60vh] px-4 py-16 transition-theme">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="h-8 w-40 animate-pulse rounded-full bg-slate-200/60 dark:bg-zinc-800/60" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-32 animate-pulse rounded-3xl bg-slate-200/40 dark:bg-zinc-900/40" />
          <div className="h-32 animate-pulse rounded-3xl bg-slate-200/40 dark:bg-zinc-900/40" />
        </div>
        <div className="h-56 animate-pulse rounded-3xl bg-slate-200/30 dark:bg-zinc-900/30" />
      </div>
    </div>
  );
}
export default RouteLoader;
