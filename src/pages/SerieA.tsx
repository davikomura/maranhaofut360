import { useState } from "react";
import { LeagueTable } from "../components/LeagueTable";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

export const SerieA = () => {
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState("2025");

  const availableYears = ["2025", "2024", "2023"];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-black via-gray-900 to-black text-gray-100">
      <main className="w-full max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-red-500 drop-shadow-sm tracking-tight mb-10">
          {t("serieA.h2")}
        </h2>

        <div className="mb-12 flex justify-center">
          <div className="relative inline-block w-48">
            <label className="block mb-2 text-center font-semibold text-gray-300">
              {t("serieA.selectYear")}
            </label>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="appearance-none w-full bg-gray-800 border border-gray-700 text-white py-2 px-4 pr-8 rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 transition"
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
          </div>
        </div>

        <LeagueTable league="A" year={selectedYear} />
      </main>
    </div>
  );
};
