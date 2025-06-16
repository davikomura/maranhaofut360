import { useState } from "react";
import { KnockoutStage } from "../components/KnockoutStage";
import { LeagueTable } from "../components/LeagueTable";
import { useTranslation } from "react-i18next";

export const SerieA = () => {
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState("2025");

  const availableYears = ["2025", "2024"];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-black via-gray-900 to-black text-gray-100">
      <main className="w-full max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-red-500 drop-shadow-sm tracking-tight mb-10">
          {t("serieA.h2")}
        </h2>

        <div className="mb-8 text-center">
          <label className="mr-4 font-semibold">{t("serieA.selectYear")}:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-gray-800 text-white border border-gray-600 p-2 rounded"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <LeagueTable league="A" year={selectedYear} />
        <KnockoutStage league="A" year={selectedYear} />
      </main>
    </div>
  );
};