import teamsData from "./data/teams.json";

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
  goalDifference: number;
}

interface LeagueProps {
  league?: string;
}

export const LeagueTable = ({ league }: LeagueProps) => {
  // Calcula o saldo de gols para cada time e ordena por pontos e saldo de gols
  const teamsWithGoalDifference: Team[] = teamsData.map(
    (team: Omit<Team, "goalDifference">) => ({
      ...team,
      goalDifference: team.goalsFor - team.goalsAgainst,
    })
  );

  const sortedTeams = teamsWithGoalDifference.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    return b.goalDifference - a.goalDifference;
  });

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
          {sortedTeams.map((team, index) => {
            const isTop4 = index < 4;
            const isBottom2 = index >= sortedTeams.length - 2;
            return (
              <tr
                key={team.name}
                className={`text-center border-b border-gray-700 ${
                  isTop4
                    ? "bg-green-700"
                    : isBottom2
                    ? "bg-red-700"
                    : ""
                }`}
              >
                <td className="p-2">{index + 1}</td>
                <td className="p-2 flex items-center gap-2">
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="w-6 h-6"
                  />
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
                <td className="p-2">{team.goalDifference}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
