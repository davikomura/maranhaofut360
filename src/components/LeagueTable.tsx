import { useEffect, useState } from "react";

interface Team {
  name: string;
  logo: string;
  points: number;
  games: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference?: number;
}

interface LeagueProps {
  league?: string;
}

export const LeagueTable = ({ league }: LeagueProps) => {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    fetch("/src/components/data/teams.json")
      .then((response) => response.json())
      .then((data: Team[]) => {
        // Adiciona o saldo de gols a cada time
        const teamsWithGoalDifference = data.map((team) => ({
          ...team,
          goalDifference: team.goalsFor - team.goalsAgainst, // Calcula saldo de gols
        }));
  
        // Ordena os times com base em pontos e saldo de gols
        const sortedTeams = teamsWithGoalDifference.sort((a, b) => {
          if (b.points !== a.points) {
            return b.points - a.points; // Ordena por pontos
          }
          return b.goalDifference - a.goalDifference; // Desempata por saldo de gols
        });
  
        setTeams(sortedTeams);
      })
      .catch((error) => console.error("Erro ao carregar os dados: ", error));
  }, []);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-center text-gray-300 mb-4">
        Classificação - Série {league}
      </h3>
      <table className="w-full text-gray-300">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-2">Pos</th>
            <th className="p-2">Time</th>
            <th className="p-2">Pts</th>
            <th className="p-2">J</th>
            <th className="p-2">V</th>
            <th className="p-2">E</th>
            <th className="p-2">D</th>
            <th className="p-2">Gols</th>
            <th className="p-2">SG</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => {
            const isTop4 = index < 4;
            const isBottom2 = index >= teams.length - 2;

            return (
              <tr
                key={team.name}
                className={`text-center border-b border-gray-700 ${
                  isTop4 ? "bg-green-700" : isBottom2 ? "bg-red-700" : ""
                }`}
              >
                <td className="p-2">{index + 1}</td>
                <td className="p-2 flex items-center gap-2">
                  <img src={team.logo} alt={team.name} className="w-6 h-6" />
                  {team.name}
                </td>
                <td className="p-2">{team.points}</td>
                <td className="p-2">{team.games}</td>
                <td className="p-2">{team.wins}</td>
                <td className="p-2">{team.draws}</td>
                <td className="p-2">{team.losses}</td>
                <td className="p-2">
                  {team.goalsFor}:{team.goalsAgainst}
                </td>
                <td className="p-2">{team.goalsFor - team.goalsAgainst}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};