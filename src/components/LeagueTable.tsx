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

interface TeamsJSON {
  serieA: Omit<Team, "goalDifference">[];
  serieB: {
    group1: Omit<Team, "goalDifference">[];
    group2: Omit<Team, "goalDifference">[];
  };
}

interface LeagueProps {
  league?: string;
}

type SeriesKey = "serieA" | "serieB";

export const LeagueTable = ({ league }: LeagueProps) => {
  // Define a divisão: "serieB" se league for "B", caso contrário "serieA"
  const seriesKey: SeriesKey = league === "B" ? "serieB" : "serieA";
  const data = teamsData as TeamsJSON;

  // Se for SerieA, os dados são um array simples
  if (seriesKey === "serieA") {
    const teamsList = data.serieA;
    const teamsWithGoalDifference: Team[] = teamsList.map((team) => ({
      ...team,
      goalDifference: team.goalsFor - team.goalsAgainst,
    }));
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
                // Para SerieA, os quatro primeiros (verde) e os dois últimos (vermelho)
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
                      <img
                        src={team.logo}
                        alt={team.name}
                        className="w-5 h-5 md:w-6 md:h-6"
                      />
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
  } else {
    // SerieB: dados agrupados em dois grupos
    const groupKeys = ["group1", "group2"] as const;
    return (
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
        <h3 className="text-lg md:text-xl font-bold text-center text-gray-300 mb-4">
          Classificação - Série {league}
        </h3>
        {groupKeys.map((groupKey) => {
          const teamsList = (data.serieB as { [key: string]: Omit<Team, "goalDifference">[] })[groupKey];
          const teamsWithGoalDifference: Team[] = teamsList.map((team) => ({
            ...team,
            goalDifference: team.goalsFor - team.goalsAgainst,
          }));
          const sortedTeams = teamsWithGoalDifference.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            return b.goalDifference - a.goalDifference;
          });
          return (
            <div key={groupKey} className="mb-8">
              <h4 className="text-center text-md md:text-lg font-bold text-gray-300 mb-2">
                Grupo {groupKey === "group1" ? "1" : "2"}
              </h4>
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
                      // Em SerieB, destaque apenas os dois primeiros de cada grupo
                      const isTop2 = index < 2;
                      return (
                        <tr
                          key={team.name}
                          className={`text-center border-b border-gray-700 text-xs md:text-sm ${
                            isTop2 ? "bg-green-700" : ""
                          }`}
                        >
                          <td className="p-2">{index + 1}</td>
                          <td className="p-2 flex items-center gap-2">
                            <img
                              src={team.logo}
                              alt={team.name}
                              className="w-5 h-5 md:w-6 md:h-6"
                            />
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
        })}
      </div>
    );
  }
};