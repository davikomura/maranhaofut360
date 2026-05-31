interface YearTabsProps {
  label: string;
  years: string[];
  selectedYear: string;
  onChange: (year: string) => void;
  loadingLabel?: string;
  isLoading?: boolean;
}

export function YearTabs({
  label,
  years,
  selectedYear,
  onChange,
  loadingLabel,
  isLoading = false,
}: YearTabsProps) {
  return (
    <div className="mb-10 py-1 transition-theme w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200/60 dark:border-zinc-900/60 pb-5">
      <div className="flex items-center gap-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
          {label}
        </p>
        
        {isLoading && loadingLabel ? (
          <span className="text-[10px] font-bold text-red-600 dark:text-red-400 animate-pulse">
            {loadingLabel}
          </span>
        ) : null}
      </div>

      <div className="-mx-1 overflow-x-auto">
        <div className="flex min-w-max gap-2 px-1">
          {years.map((year) => {
            const active = year === selectedYear;

            return (
              <button
                key={year}
                type="button"
                onClick={() => onChange(year)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
                  active
                    ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
                    : "border border-slate-300 dark:border-zinc-800 bg-[#FAF8F5]/40 text-slate-600 hover:bg-[#F5F2EC] dark:bg-zinc-950/20 dark:text-zinc-400 dark:hover:bg-zinc-900"
                }`}
              >
                {year}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default YearTabs;
