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

  const renderTableRows = (
    teams: Team[],
    topHighlight: number,
    bottomHighlight = 0
  ) =>
    teams.map((team, index) => {
      const isTop = index < topHighlight;
      const isBottom =
        bottomHighlight > 0 && index >= teams.length - bottomHighlight;

      return (
        <tr
          key={team.name}
          className={`text-center border-b border-gray-700 text-sm md:text-base transition duration-200 ${
            isTop
              ? "bg-green-600/10 hover:bg-green-600/20"
              : isBottom
              ? "bg-red-600/10 hover:bg-red-600/20"
              : "hover:bg-gray-700/30"
          }`}
        >
          <td className="p-2 font-semibold">{index + 1}</td>
          <td className="p-2 flex items-center gap-3 text-left">
            <img
              src={team.logo}
              alt={team.name}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full ring-1 ring-gray-500"
            />
            <span className="truncate font-medium">{team.name}</span>
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

  const renderTable = (
    teams: Omit<Team, "goalDifference">[],
    title?: string,
    top = 4,
    bottom = 2
  ) => {
    const teamsWithGD: Team[] = teams.map((t) => ({
      ...t,
      goalDifference: t.goalsFor - t.goalsAgainst,
    }));
    const sortedTeams = teamsWithGD.sort((a, b) =>
      b.points !== a.points
        ? b.points - a.points
        : b.goalDifference !== a.goalDifference
        ? b.goalDifference - a.goalDifference
        : b.goalsFor - a.goalsFor
    );

    return (
      <div className="mb-12">
        {title && (
          <h4 className="text-center text-lg md:text-xl font-bold text-gray-100 mb-6 tracking-wide">
            {title}
          </h4>
        )}
        <div className="overflow-x-auto rounded-xl border border-gray-700 shadow-lg">
          <table className="w-full min-w-[650px] table-auto text-sm md:text-base text-gray-200">
            <thead className="bg-gray-800 text-gray-300 uppercase text-xs md:text-sm tracking-wide">
              <tr className="divide-x divide-gray-700">
                <th className="p-3">Pos</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3">Pts</th>
                <th className="p-3 hidden md:table-cell">J</th>
                <th className="p-3">V</th>
                <th className="p-3">E</th>
                <th className="p-3">D</th>
                <th className="p-3 hidden md:table-cell">Gols</th>
                <th className="p-3">SG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {renderTableRows(sortedTeams, top, bottom)}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {seriesKey === "serieA"
        ? renderTable(data.serieA, undefined, 4, 2)
        : ["group1", "group2"].map((groupKey, i) => (
            <div key={groupKey}>
              {renderTable(
                data.serieB[groupKey as "group1" | "group2"],
                `Grupo ${i + 1}`,
                2,
                0
              )}
            </div>
          ))}
    </div>
  );
};