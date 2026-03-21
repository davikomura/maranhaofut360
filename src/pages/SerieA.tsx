import { useDeferredValue, useState, useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LeagueTable } from "../components/LeagueTable";

export const SerieA = () => {
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState("2026");
  const deferredYear = useDeferredValue(selectedYear);
  const [isPending, startTransition] = useTransition();

  const availableYears = ["2026", "2025", "2024", "2023"];

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black text-gray-100">
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-center text-3xl font-extrabold tracking-tight text-red-500 drop-shadow-sm sm:text-4xl md:text-5xl">
          {t("serieA.h2")}
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-gray-400 md:text-base">
          {t("serieA.description")}
        </p>

        <div className="mb-10 flex justify-center">
          <div className="w-full max-w-xs rounded-3xl border border-gray-800 bg-gray-950/80 p-4 shadow-xl">
            <label className="mb-2 block text-center font-semibold text-gray-300">
              {t("serieA.selectYear")}
            </label>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => startTransition(() => setSelectedYear(e.target.value))}
                className="w-full appearance-none rounded-2xl border border-gray-700 bg-gray-800 py-3 px-4 pr-9 text-white shadow-md transition focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <ChevronDown size={18} />
              </div>
            </div>
            {(isPending || deferredYear !== selectedYear) && (
              <p className="mt-3 text-center text-xs text-gray-400">{t("common.loading")}</p>
            )}
          </div>
        </div>

        <LeagueTable league="A" year={deferredYear} />
      </main>
    </div>
  );
};
