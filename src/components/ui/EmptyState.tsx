interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="py-12 text-center space-y-2 border border-dashed border-slate-200/60 dark:border-zinc-800/60 rounded-3xl p-6">
      <h3 className="text-base font-bold text-slate-800 dark:text-white font-heading">{title}</h3>
      <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold">{description}</p>
    </div>
  );
}
export default EmptyState;
