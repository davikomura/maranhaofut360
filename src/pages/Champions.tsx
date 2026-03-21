import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import championsData from "../data/champions.json";
import { fixDisplayText } from "../utils/text";

export const Champions = () => {
  const { t } = useTranslation();
  const { champions } = championsData;
  const [showTable, setShowTable] = useState(false);

  const validChampions = useMemo(
    () =>
      champions.filter(({ champion }) => {
        const championName = fixDisplayText(champion);
        return (
          championName !== "N\u00E3o houve campeonato" &&
          championName !== "Campeonato n\u00E3o conclu\u00EDdo"
        );
      }),
    [champions]
  );

  const titleCounts: Record<string, number> = {};
  const viceCounts: Record<string, number> = {};
  const cityTitleCounts: Record<string, number> = {};

  validChampions.forEach(({ champion, runner_up, cityChampion }) => {
    const championName = fixDisplayText(champion);
    const runnerUpName = fixDisplayText(runner_up);
    const championCity = fixDisplayText(cityChampion);

    titleCounts[championName] = (titleCounts[championName] || 0) + 1;
    if (runnerUpName) {
      viceCounts[runnerUpName] = (viceCounts[runnerUpName] || 0) + 1;
    }
    if (championCity) {
      cityTitleCounts[championCity] = (cityTitleCounts[championCity] || 0) + 1;
    }
  });

  const finalAppearances: Record<string, number> = {};
  Object.keys({ ...titleCounts, ...viceCounts }).forEach((team) => {
    finalAppearances[team] = (titleCounts[team] || 0) + (viceCounts[team] || 0);
  });

  const maxTitles = Math.max(...Object.values(titleCounts));
  const maxFinals = Math.max(...Object.values(finalAppearances));
  const maxCityTitles = Math.max(...Object.values(cityTitleCounts));

  const topChampion = Object.entries(titleCounts).reduce((a, b) => (b[1] > a[1] ? b : a));
  const topCity = Object.entries(cityTitleCounts).reduce((a, b) => (b[1] > a[1] ? b : a));

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-black text-white py-10 px-4">
      <div className="max-w-6xl w-full mx-auto">
        <h1 className="text-5xl font-black text-center mb-10 tracking-tight drop-shadow-lg">
          {t("champions.title")}
        </h1>

        <div className="text-center mb-6">
          <button
            onClick={() => setShowTable(!showTable)}
            className="px-6 py-3 bg-red-600 hover:bg-red-500 transition rounded-full text-lg font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {showTable ? t("champions.hideTable") : t("champions.showTable")}
          </button>
        </div>

        {showTable && (
          <div className="overflow-x-auto transition-all duration-500">
            <table className="w-full text-sm sm:text-base border border-gray-700 rounded-xl bg-black/40 backdrop-blur-md shadow-md overflow-hidden">
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
                    className="border-t border-gray-700 even:bg-gray-800/30 hover:bg-gray-700/40 transition-colors"
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
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-6 shadow-xl ring-1 ring-white/5">
              <h2 className="text-xl font-bold text-white mb-2">{t("champions.biggestChampion")}</h2>
              <p className="text-lg text-yellow-400 font-medium">
                {topChampion[0]} ({topChampion[1]} {t("champions.titles")})
              </p>
            </div>

            <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-6 shadow-xl ring-1 ring-white/5">
              <h2 className="text-xl font-bold text-white mb-2">{t("champions.topCity")}</h2>
              <p className="text-lg text-green-400 font-medium">
                {topCity[0]} ({topCity[1]} {t("champions.titles")})
              </p>
            </div>
          </div>

          <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-6 shadow-xl ring-1 ring-white/5">
            <h3 className="text-xl font-bold text-white mb-4">{t("champions.titlesByTeam")}</h3>
            <ul className="space-y-3">
              {Object.entries(titleCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([team, count]) => (
                  <li key={team}>
                    <div className="flex justify-between font-medium">
                      <span>{team}</span>
                      <span>{count}</span>
                    </div>
                    <div className="w-full bg-gray-700 h-2 rounded-full mt-1">
                      <div
                        className="h-2 rounded-full bg-blue-500 transition-all"
                        style={{ width: `${(count / maxTitles) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
            </ul>
          </div>

          <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-6 shadow-xl ring-1 ring-white/5">
            <h3 className="text-xl font-bold text-white mb-4">{t("champions.finalsByTeam")}</h3>
            <ul className="space-y-3">
              {Object.entries(finalAppearances)
                .sort((a, b) => b[1] - a[1])
                .map(([team, count]) => (
                  <li key={team}>
                    <div className="flex justify-between font-medium">
                      <span>{team}</span>
                      <span>{count}</span>
                    </div>
                    <div className="w-full bg-gray-700 h-2 rounded-full mt-1">
                      <div
                        className="h-2 rounded-full bg-pink-400 transition-all"
                        style={{ width: `${(count / maxFinals) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
            </ul>
          </div>

          <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-6 shadow-xl ring-1 ring-white/5">
            <h3 className="text-xl font-bold text-white mb-4">{t("champions.cityDistribution")}</h3>
            <ul className="space-y-3">
              {Object.entries(cityTitleCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([city, count]) => (
                  <li key={city}>
                    <div className="flex justify-between font-medium">
                      <span>{city}</span>
                      <span>{count}</span>
                    </div>
                    <div className="w-full bg-gray-700 h-2 rounded-full mt-1">
                      <div
                        className="h-2 rounded-full bg-green-400 transition-all"
                        style={{ width: `${(count / maxCityTitles) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
