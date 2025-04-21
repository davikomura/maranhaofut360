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
  const seriesKey: SeriesKey = league === "B" ? "serieB" : "serieA";
  const data = teamsData as TeamsJSON;

  const renderTableRows = (teams: Team[], topHighlight: number, bottomHighlight = 0) =>
    teams.map((team, index) => {
      const isTop = index < topHighlight;
      const isBottom = bottomHighlight > 0 && index >= teams.length - bottomHighlight;

      return (
        <tr
          key={team.name}
          className={`text-center border-b border-gray-700 text-xs md:text-sm transition duration-200 ${
            isTop
              ? "bg-green-700/70 hover:bg-green-600"
              : isBottom
              ? "bg-red-700/70 hover:bg-red-600"
              : "hover:bg-gray-700/50"
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
    });

  const renderTable = (teams: Omit<Team, "goalDifference">[], title?: string, top = 4, bottom = 2) => {
    const teamsWithGD: Team[] = teams.map((t) => ({
      ...t,
      goalDifference: t.goalsFor - t.goalsAgainst,
    }));
    const sortedTeams = teamsWithGD.sort((a, b) =>
      b.points !== a.points ? b.points - a.points : b.goalDifference - a.goalDifference
    );

    return (
      <div className="mb-10">
        {title && (
          <h4 className="text-center text-md md:text-lg font-bold text-gray-300 mb-2">{title}</h4>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-gray-300">
            <thead>
              <tr className="bg-gray-700 text-xs md:text-sm uppercase">
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
            <tbody>{renderTableRows(sortedTeams, top, bottom)}</tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
      <h3 className="text-lg md:text-xl font-bold text-center text-gray-300 mb-4">
        Classificação - Série {league}
      </h3>

      {seriesKey === "serieA"
        ? renderTable(data.serieA, undefined, 4, 2)
        : ["group1", "group2"].map((groupKey, i) =>
            renderTable(
              data.serieB[groupKey as "group1" | "group2"],
              `Grupo ${i + 1}`,
              2,
              0
            )
          )}
    </div>
  );
};
