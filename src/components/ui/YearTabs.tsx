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
    <section className="mb-10 rounded-[2rem] border border-gray-800 bg-gray-950/80 p-4 shadow-xl md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.24em] text-gray-500 md:text-left">
            {label}
          </p>
        </div>

        <div className="-mx-1 overflow-x-auto pb-1">
          <div className="flex min-w-max gap-2 px-1">
            {years.map((year) => {
              const active = year === selectedYear;

              return (
                <button
                  key={year}
                  type="button"
                  onClick={() => onChange(year)}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold transition md:px-5 ${
                    active
                      ? "bg-red-500 text-white shadow-lg shadow-red-900/30"
                      : "border border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-500 hover:bg-gray-800"
                  }`}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {isLoading && loadingLabel ? (
        <p className="mt-3 text-center text-xs text-gray-400 md:text-left">{loadingLabel}</p>
      ) : null}
    </section>
  );
}
