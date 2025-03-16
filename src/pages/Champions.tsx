import { useState } from "react";
import data from "../../data.json";

export const Champions = () => {
  const { champions } = data;
  const [showTable, setShowTable] = useState(false);

  // Filtra os campeonatos válidos
  const validChampions = champions.filter(
    ({ champion }) =>
      champion !== "Não houve campeonato" && champion !== "Campeonato não concluído"
  );

  // Contadores de títulos e vices por time e cidade
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

  // Times que mais chegaram à final (soma de títulos e vices)
  const finalAppearances: Record<string, number> = {};
  Object.keys(titleCounts).forEach((team) => {
    finalAppearances[team] = (titleCounts[team] || 0) + (viceCounts[team] || 0);
  });

  // Máximos para definir tamanhos das barras
  const maxTitles = Math.max(...Object.values(titleCounts));
  const maxFinals = Math.max(...Object.values(finalAppearances));
  const maxCityTitles = Math.max(...Object.values(cityTitleCounts));

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-4xl w-full mx-auto p-8 flex-1 bg-gray-950/50 shadow-xl backdrop-blur-md">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-100">
          Lista de Campeões
        </h1>

        {/* Botão para exibir/ocultar a tabela */}
        <button
          onClick={() => setShowTable(!showTable)}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-md text-lg font-semibold transition-all"
        >
          {showTable ? "Ocultar Lista" : "Mostrar Lista"}
        </button>

        {/* Tabela de Campeões */}
        {showTable && (
          <div className="overflow-x-auto mt-4 transition-all duration-500">
            <table className="table-auto w-full text-white border-collapse">
              <thead>
                <tr className="border-b border-gray-600 bg-gray-800 text-lg">
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
                    className="hover:bg-gray-700/50 transition-colors even:bg-gray-800/50"
                  >
                    <td className="px-4 py-3 border-b border-gray-600">
                      {item.year}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-600 font-semibold">
                      {item.champion}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-600">
                      {item.runner_up || "-"}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-600">
                      {item.cityChampion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Seção de Estatísticas */}
        <div className="mt-8 border-t border-gray-700 pt-6">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-100">
            Estatísticas
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Maior campeão */}
            <div className="p-6 bg-gray-800/60 rounded-lg shadow-md transition-transform hover:scale-105 hover:shadow-2xl">
              <h3 className="text-xl font-bold text-gray-200">
                Maior Campeão
              </h3>
              <p className="text-gray-300 text-lg mt-1">
                {Object.entries(titleCounts).reduce((a, b) => (b[1] > a[1] ? b : a))[0]}{" "}
                <span className="font-semibold text-yellow-400">
                  ({maxTitles} títulos)
                </span>
              </p>
            </div>

            {/* Cidade com mais títulos */}
            <div className="p-6 bg-gray-800/60 rounded-lg shadow-md transition-transform hover:scale-105 hover:shadow-2xl">
              <h3 className="text-xl font-bold text-gray-200">
                Cidade com mais títulos
              </h3>
              <p className="text-gray-300 text-lg mt-1">
                {Object.entries(cityTitleCounts).reduce((a, b) => (b[1] > a[1] ? b : a))[0]}{" "}
                <span className="font-semibold text-green-400">
                  ({maxCityTitles} títulos)
                </span>
              </p>
            </div>
          </div>

          {/* Lista de títulos por equipe */}
          <div className="mt-6 p-6 bg-gray-800/60 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-200 mb-3">
              Títulos por Equipe
            </h3>
            <ul className="space-y-3">
              {Object.entries(titleCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([team, count]) => (
                  <li key={team} className="flex flex-col">
                    <div className="flex justify-between text-lg font-medium text-gray-300">
                      <span>{team}</span>
                      <span>{count} títulos</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 mt-1">
                      <div
                        className="h-3 rounded-full transition-all"
                        style={{
                          width: `${(count / maxTitles) * 100}%`,
                          background: "rgb(59 130 246)",
                        }}
                      ></div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>

          {/* Lista de times que mais chegaram à final */}
          <div className="mt-6 p-6 bg-gray-800/60 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-200 mb-3">
              Times que mais chegaram à final
            </h3>
            <ul className="space-y-3">
              {Object.entries(finalAppearances)
                .sort((a, b) => b[1] - a[1])
                .map(([team, count]) => (
                  <li key={team} className="flex flex-col">
                    <div className="flex justify-between text-lg font-medium text-gray-300">
                      <span>{team}</span>
                      <span>{count} finais</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 mt-1">
                      <div
                        className="h-3 rounded-full transition-all"
                        style={{
                          width: `${(count / maxFinals) * 100}%`,
                          background: "rgb(244 114 182)",
                        }}
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