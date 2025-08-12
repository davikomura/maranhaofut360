import { useState } from "react";
import championsData from "../data/champions.json";

export const Champions = () => {
  const { champions } = championsData;
  const [showTable, setShowTable] = useState(false);

  const validChampions = champions.filter(
    ({ champion }) =>
      champion !== "Não houve campeonato" && champion !== "Campeonato não concluído"
  );

  const titleCounts: Record<string, number> = {};
  const viceCounts: Record<string, number> = {};
  const cityTitleCounts: Record<string, number> = {};

  validChampions.forEach(({ champion, runner_up, cityChampion }) => {
    titleCounts[champion] = (titleCounts[champion] || 0) + 1;
    if (runner_up) {
      viceCounts[runner_up] = (viceCounts[runner_up] || 0) + 1;
    }
    if (cityChampion) {
      cityTitleCounts[cityChampion] = (cityTitleCounts[cityChampion] || 0) + 1;
    }
  });

  const finalAppearances: Record<string, number> = {};
  Object.keys(titleCounts).forEach((team) => {
    finalAppearances[team] = (titleCounts[team] || 0) + (viceCounts[team] || 0);
  });

  const maxTitles = Math.max(...Object.values(titleCounts));
  const maxFinals = Math.max(...Object.values(finalAppearances));
  const maxCityTitles = Math.max(...Object.values(cityTitleCounts));

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-black text-white py-10 px-4">
      <div className="max-w-6xl w-full mx-auto">
        <h1 className="text-5xl font-black text-center mb-10 tracking-tight drop-shadow-lg">
          Campeões Maranhenses
        </h1>

        <div className="text-center mb-6">
          <button
            onClick={() => setShowTable(!showTable)}
            className="px-6 py-3 bg-red-600 hover:bg-red-500 transition rounded-full text-lg font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {showTable ? "Ocultar Tabela" : "Mostrar Tabela"}
          </button>
        </div>

        {showTable && (
          <div className="overflow-x-auto transition-all duration-500">
            <table className="w-full text-sm sm:text-base border border-gray-700 rounded-xl bg-black/40 backdrop-blur-md shadow-md overflow-hidden">
              <thead>
                <tr className="bg-red-700 text-white">
                  <th className="px-4 py-3 text-left">Ano</th>
                  <th className="px-4 py-3 text-left">Campeão</th>
                  <th className="px-4 py-3 text-left">Vice</th>
                  <th className="px-4 py-3 text-left">Cidade</th>
                </tr>
              </thead>
              <tbody>
                {validChampions.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-700 even:bg-gray-800/30 hover:bg-gray-700/40 transition-colors"
                  >
                    <td className="px-4 py-3">{item.year}</td>
                    <td className="px-4 py-3 font-semibold text-blue-400">
                      {item.champion}
                    </td>
                    <td className="px-4 py-3">{item.runner_up || "-"}</td>
                    <td className="px-4 py-3">{item.cityChampion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-14 space-y-10">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-6 shadow-xl ring-1 ring-white/5">
              <h2 className="text-xl font-bold text-white mb-2">Maior Campeão</h2>
              <p className="text-lg text-yellow-400 font-medium">
                {Object.entries(titleCounts).reduce((a, b) => (b[1] > a[1] ? b : a))[0]} ({maxTitles} títulos)
              </p>
            </div>

            <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-6 shadow-xl ring-1 ring-white/5">
              <h2 className="text-xl font-bold text-white mb-2">Cidade com Mais Títulos</h2>
              <p className="text-lg text-green-400 font-medium">
                {Object.entries(cityTitleCounts).reduce((a, b) => (b[1] > a[1] ? b : a))[0]} ({maxCityTitles} títulos)
              </p>
            </div>
          </div>

          <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-6 shadow-xl ring-1 ring-white/5">
            <h3 className="text-xl font-bold text-white mb-4">Títulos por Equipe</h3>
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
            <h3 className="text-xl font-bold text-white mb-4">Finais Disputadas por Equipe</h3>
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
        </div>
      </div>
    </div>
  );
};
