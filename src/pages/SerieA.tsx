import { useDeferredValue, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { LeagueTable } from "../components/LeagueTable";
import { YearTabs } from "../components/ui/YearTabs";
import { useSEO } from "../hooks/useSEO";

export const SerieA = () => {
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState("2026");
  const deferredYear = useDeferredValue(selectedYear);
  const [isPending, startTransition] = useTransition();

  const availableYears = ["2026", "2025", "2024", "2023", "2022"];

  // Strong dynamic page-level SEO based on selected season
  useSEO({
    title: `${t("serieA.h2")} ${selectedYear}`,
    description: `${t("serieA.description")} - Temporada ${selectedYear}`,
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.04),_transparent_28%)] transition-theme animate-fade-in-up">
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 text-center space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-5xl font-heading">
            {t("serieA.h2")}
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-500 dark:text-zinc-400">
            {t("serieA.description")}
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <YearTabs
            label={t("serieA.selectYear")}
            years={availableYears}
            selectedYear={selectedYear}
            onChange={(year) => startTransition(() => setSelectedYear(year))}
            isLoading={isPending || deferredYear !== selectedYear}
            loadingLabel={t("common.loading")}
          />
        </div>

        <div className="transition-all duration-300">
          <LeagueTable league="A" year={deferredYear} />
        </div>
      </main>
    </div>
  );
};
