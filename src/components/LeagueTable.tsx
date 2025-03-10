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
  const teamsWithGoalDifference: Team[] = teamsData.map(
    (team: Omit<Team, "goalDifference">) => ({
      ...team,
      goalDifference: team.goalsFor - team.goalsAgainst,
    })
  );

  const sortedTeams = teamsWithGoalDifference.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.goalDifference - a.goalDifference;
  });

  return (
    <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
      <h3 className="text-lg md:text-xl font-bold text-center text-gray-300 mb-4">
        Classificação - Série {league}
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-gray-300">
          <thead>
            <tr className="bg-gray-700 text-xs md:text-sm">
              <th className="p-2">Pos</th>
              <th className="p-2 text-left">Time</th>
              <th className="p-2">Pts</th>
              <th className="p-2 hidden md:table-cell">J</th>
              <th className="p-2">V</th>
              <th className="p-2">E</th>
              <th className="p-2">D</th>
              <th className="p-2 hidden md:table-cell">Gols</th>
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
                  className={`text-center border-b border-gray-700 text-xs md:text-sm ${
                    isTop4 ? "bg-green-700" : isBottom2 ? "bg-red-700" : ""
                  }`}
                >
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2 flex items-center gap-2">
                    <img src={team.logo} alt={team.name} className="w-5 h-5 md:w-6 md:h-6" />
                    <span className="truncate">{team.name}</span>
                  </td>
                  <td className="p-2 font-bold">{team.points}</td>
                  <td className="p-2 hidden md:table-cell">{team.games}</td>
                  <td className="p-2">{team.wins}</td>
                  <td className="p-2">{team.draws}</td>
                  <td className="p-2">{team.losses}</td>
                  <td className="p-2 hidden md:table-cell">
                    {team.goalsFor}:{team.goalsAgainst}
                  </td>
                  <td className="p-2">{team.goalDifference}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};