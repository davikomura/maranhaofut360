import { useState } from "react";
import data from "../../data.json";

export const Champions = () => {
  const { champions } = data;
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="max-w-5xl w-full mx-auto p-6 md:p-10 flex-1 bg-black/60 shadow-xl backdrop-blur-md rounded-xl">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-white drop-shadow">
          Lista de Campeões
        </h1>

        <button
          onClick={() => setShowTable(!showTable)}
          className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-md text-lg font-semibold transition-all shadow-md"
        >
          {showTable ? "Ocultar Lista" : "Mostrar Lista"}
        </button>

        {showTable && (
          <div className="overflow-x-auto mt-4 transition-all duration-500">
            <table className="table-auto w-full text-white border-collapse">
              <thead>
                <tr className="border-b border-gray-600 bg-red-700 text-lg">
                  <th className="px-4 py-3 text-left">Ano</th>
                  <th className="px-4 py-3 text-left">Campeão</th>
                  <th className="px-4 py-3 text-left">Vice</th>
                  <th className="px-4 py-3 text-left">Cidade do Campeão</th>
                </tr>
              </thead>
              <tbody>
                {validChampions.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-800 transition-colors even:bg-gray-900"
                  >
                    <td className="px-4 py-3 border-b border-gray-700">
                      {item.year}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-700 font-semibold text-blue-400">
                      {item.champion}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-700">
                      {item.runner_up || "-"}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-700">
                      {item.cityChampion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-10 border-t border-gray-700 pt-6">
          <h2 className="text-3xl font-bold mb-6 text-center text-white">
            Estatísticas
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-800 rounded-lg shadow-md transition-transform hover:scale-105">
              <h3 className="text-xl font-bold text-white">
                Maior Campeão
              </h3>
              <p className="text-gray-300 text-lg mt-1">
                {Object.entries(titleCounts).reduce((a, b) => (b[1] > a[1] ? b : a))[0]} {" "}
                <span className="font-semibold text-yellow-400">
                  ({maxTitles} títulos)
                </span>
              </p>
            </div>

            <div className="p-6 bg-gray-800 rounded-lg shadow-md transition-transform hover:scale-105">
              <h3 className="text-xl font-bold text-white">
                Cidade com mais títulos
              </h3>
              <p className="text-gray-300 text-lg mt-1">
                {Object.entries(cityTitleCounts).reduce((a, b) => (b[1] > a[1] ? b : a))[0]} {" "}
                <span className="font-semibold text-green-400">
                  ({maxCityTitles} títulos)
                </span>
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-white mb-4">
              Títulos por Equipe
            </h3>
            <ul className="space-y-3">
              {Object.entries(titleCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([team, count]) => (
                  <li key={team} className="flex flex-col">
                    <div className="flex justify-between text-lg font-medium text-white">
                      <span>{team}</span>
                      <span>{count} títulos</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-3 mt-1">
                      <div
                        className="h-3 rounded-full transition-all bg-blue-500"
                        style={{ width: `${(count / maxTitles) * 100}%` }}
                      ></div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>

          <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-white mb-4">
              Times que mais chegaram à final
            </h3>
            <ul className="space-y-3">
              {Object.entries(finalAppearances)
                .sort((a, b) => b[1] - a[1])
                .map(([team, count]) => (
                  <li key={team} className="flex flex-col">
                    <div className="flex justify-between text-lg font-medium text-white">
                      <span>{team}</span>
                      <span>{count} finais</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-3 mt-1">
                      <div
                        className="h-3 rounded-full transition-all bg-pink-400"
                        style={{ width: `${(count / maxFinals) * 100}%` }}
                      ></div>
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