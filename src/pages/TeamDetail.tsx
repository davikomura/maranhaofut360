import { useParams } from "react-router-dom";
import teamsData from "../../data.json";

export default function TeamDetail() {
  const { id } = useParams();
  const team = teamsData.Teams.find((t) => t.id === Number(id));

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
        <h1 className="text-xl font-bold">Time não encontrado</h1>
      </div>
    );
  }

  // Pega o ano de fundação da descrição, se possível
  const foundedMatch = team.history.match(/(\d{4})/);
  const foundedYear = foundedMatch ? foundedMatch[1] : "Desconhecido";

  const rival = team.name.includes("Moto Club") ? "Sampaio Corrêa" :
                team.name.includes("Sampaio") ? "Moto Club" : null;

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black text-white px-4 py-10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10">
        {/* LADO ESQUERDO: Escudo */}
        <div className="w-full md:w-1/3 border border-gray-700 rounded-xl bg-gray-950 p-5 shadow-md flex justify-center items-center">
          <img
            src={team.image}
            alt={`Escudo do ${team.name}`}
            className="max-h-64 object-contain"
          />
        </div>

        {/* LADO DIREITO: Info */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold text-blue-400">{team.name}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium
              ${team.status === "A" ? "bg-green-700 text-green-200" : "bg-yellow-600 text-yellow-100"}`}>
              Divisão {team.status}
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm">
              Fundado em {foundedYear}
            </span>
          </div>

          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            {team.history}
          </p>

          {rival && (
            <div className="text-sm text-red-400 font-medium">
              ⚔️ Rival tradicional: <span className="underline">{rival}</span>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Curiosidades</h2>
            <ul className="grid gap-3">
              {team.curiosities.map((fact, index) => (
                <li
                  key={index}
                  className="bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
