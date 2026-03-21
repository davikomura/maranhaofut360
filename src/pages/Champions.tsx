import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getChampionStats } from "../lib/champions";
import { fixDisplayText } from "../utils/text";

export const Champions = () => {
  const { t } = useTranslation();
  const [showTable, setShowTable] = useState(false);

  const { validChampions, titleCounts, cityTitleCounts, finalAppearances } = useMemo(
    () => getChampionStats(),
    []
  );

  const maxTitles = Math.max(...Object.values(titleCounts));
  const maxFinals = Math.max(...Object.values(finalAppearances));
  const maxCityTitles = Math.max(...Object.values(cityTitleCounts));

  const topChampion = Object.entries(titleCounts).reduce((a, b) => (b[1] > a[1] ? b : a));
  const topCity = Object.entries(cityTitleCounts).reduce((a, b) => (b[1] > a[1] ? b : a));

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black px-4 py-10 text-white">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="mb-4 text-center text-4xl font-black tracking-tight drop-shadow-lg md:text-5xl">
          {t("champions.title")}
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-gray-400 md:text-base">
          {t("champions.description")}
        </p>

        <div className="mb-6 text-center">
          <button
            onClick={() => setShowTable(!showTable)}
            className="rounded-full bg-red-600 px-6 py-3 text-lg font-semibold shadow-lg transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {showTable ? t("champions.hideTable") : t("champions.showTable")}
          </button>
        </div>

        {showTable && (
          <div className="overflow-x-auto rounded-2xl border border-gray-700 bg-black/40 shadow-md">
            <table className="w-full min-w-[640px] text-sm sm:text-base">
              <thead>
                <tr className="bg-red-700 text-white">
                  <th className="px-4 py-3 text-left">{t("champions.year")}</th>
                  <th className="px-4 py-3 text-left">{t("champions.champion")}</th>
                  <th className="px-4 py-3 text-left">{t("champions.runnerUp")}</th>
                  <th className="px-4 py-3 text-left">{t("champions.city")}</th>
                </tr>
              </thead>
              <tbody>
                {validChampions.map((item) => (
                  <tr
                    key={`${item.year}-${item.champion}`}
                    className="border-t border-gray-700 even:bg-gray-800/30 hover:bg-gray-700/40"
                  >
                    <td className="px-4 py-3">{item.year}</td>
                    <td className="px-4 py-3 font-semibold text-blue-400">
                      {fixDisplayText(item.champion)}
                    </td>
                    <td className="px-4 py-3">{fixDisplayText(item.runner_up) || "-"}</td>
                    <td className="px-4 py-3">{fixDisplayText(item.cityChampion)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-14 space-y-10">
          <div className="grid gap-6 sm:grid-cols-2">
            <SummaryCard
              title={t("champions.biggestChampion")}
              value={`${topChampion[0]} (${topChampion[1]} ${t("champions.titles")})`}
              tone="text-yellow-400"
            />
            <SummaryCard
              title={t("champions.topCity")}
              value={`${topCity[0]} (${topCity[1]} ${t("champions.titles")})`}
              tone="text-green-400"
            />
          </div>

          <StatsBlock
            title={t("champions.titlesByTeam")}
            entries={Object.entries(titleCounts)}
            maxValue={maxTitles}
            barClass="bg-blue-500"
          />

          <StatsBlock
            title={t("champions.finalsByTeam")}
            entries={Object.entries(finalAppearances)}
            maxValue={maxFinals}
            barClass="bg-pink-400"
          />

          <StatsBlock
            title={t("champions.cityDistribution")}
            entries={Object.entries(cityTitleCounts)}
            maxValue={maxCityTitles}
            barClass="bg-green-400"
          />
        </div>
      </div>
    </div>
  );
};

function SummaryCard({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-6 shadow-xl ring-1 ring-white/5">
      <h2 className="mb-2 text-xl font-bold text-white">{title}</h2>
      <p className={`text-lg font-medium ${tone}`}>{value}</p>
    </div>
  );
}

function StatsBlock({
  title,
  entries,
  maxValue,
  barClass,
}: {
  title: string;
  entries: [string, number][];
  maxValue: number;
  barClass: string;
}) {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-6 shadow-xl ring-1 ring-white/5">
      <h3 className="mb-4 text-xl font-bold text-white">{title}</h3>
      <ul className="space-y-3">
        {entries
          .sort((a, b) => b[1] - a[1])
          .map(([label, count]) => (
            <li key={label}>
              <div className="flex justify-between font-medium">
                <span>{label}</span>
                <span>{count}</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-gray-700">
                <div
                  className={`h-2 rounded-full transition-all ${barClass}`}
                  style={{ width: `${(count / maxValue) * 100}%` }}
                />
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
