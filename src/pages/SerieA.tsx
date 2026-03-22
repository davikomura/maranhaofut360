import { useDeferredValue, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { LeagueTable } from "../components/LeagueTable";
import { YearTabs } from "../components/ui/YearTabs";

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

        <YearTabs
          label={t("serieA.selectYear")}
          years={availableYears}
          selectedYear={selectedYear}
          onChange={(year) => startTransition(() => setSelectedYear(year))}
          isLoading={isPending || deferredYear !== selectedYear}
          loadingLabel={t("common.loading")}
        />

        <LeagueTable league="A" year={deferredYear} />
      </main>
    </div>
  );
};
