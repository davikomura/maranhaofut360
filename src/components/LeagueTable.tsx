import teamsData from "./data/groupStage.json";
import { useTranslation } from "react-i18next";
import { KnockoutStage } from "./KnockoutStage";

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

interface SerieAUnique {
  group: "unique";
  teams: Omit<Team, "goalDifference">[];
}

interface SerieAStages {
  stages: {
    [stageName: string]: {
      groups: {
        [groupName: string]: Omit<Team, "goalDifference">[];
      };
    };
  };
}

type SerieAData = SerieAUnique | SerieAStages;

interface SerieBStages {
  stages: {
    [stageName: string]: {
      groups: {
        [groupName: string]: Omit<Team, "goalDifference">[];
      };
    };
  };
}

type SerieBData = SerieBStages;

interface TeamsJSON {
  [year: string]: {
    serieA: SerieAData;
    serieB: SerieBData;
  };
}

interface LeagueProps {
  league?: string;
  year: string;
}

type SeriesKey = "serieA" | "serieB";

export const LeagueTable = ({ league, year }: LeagueProps) => {
  const seriesKey: SeriesKey = league === "B" ? "serieB" : "serieA";
  const data = (teamsData as TeamsJSON)[year];
  const { t } = useTranslation();

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
          <td className="p-2">{team.goalsFor - team.goalsAgainst}</td>
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
                <th className="p-3">{t("leagueTable.position")}</th>
                <th className="p-3 text-left">{t("leagueTable.team")}</th>
                <th className="p-3">{t("leagueTable.points")}</th>
                <th className="p-3 hidden md:table-cell">
                  {t("leagueTable.games")}
                </th>
                <th className="p-3">{t("leagueTable.wins")}</th>
                <th className="p-3">{t("leagueTable.draws")}</th>
                <th className="p-3">{t("leagueTable.losses")}</th>
                <th className="p-3 hidden md:table-cell">
                  {t("leagueTable.goals")}
                </th>
                <th className="p-3">{t("leagueTable.goalDifference")}</th>
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
      {seriesKey === "serieA" ? (
        "group" in data.serieA ? (
          <>
            {renderTable(data.serieA.teams, undefined, 4, 2)}
            <KnockoutStage league="A" year={year} stageName="unique" />
          </>
        ) : (
          <>
            {Object.entries(data.serieA.stages).map(
              ([stageName, stageData]) => (
                <div key={stageName} className="mb-16">
                  <h3 className="text-xl md:text-2xl font-bold text-center text-gray-100 mb-8">
                    {t(`leagueTable.${stageName}`)}
                  </h3>
                  {Object.entries(stageData.groups).map(
                    ([groupName, teams]) => (
                      <div key={groupName}>
                        {renderTable(
                          teams,
                          `${t("leagueTable.group")} ${groupName
                            .replace(/^group/i, "")
                            .toUpperCase()}`,
                          2,
                          0
                        )}
                      </div>
                    )
                  )}

                  <KnockoutStage league="A" year={year} stageName={stageName} />
                </div>
              )
            )}
            <KnockoutStage league="A" year={year} stageName="finalStage" />
          </>
        )
      ) : (
        <>
          {Object.entries(data.serieB.stages).map(([stageName, stageData]) => (
            <div key={stageName} className="mb-16">
              <h3 className="text-xl md:text-2xl font-bold text-center text-gray-100 mb-8">
                {t(`leagueTable.${stageName}`)}
              </h3>
              {Object.entries(stageData.groups).map(([groupName, teams]) => (
                <div key={groupName}>
                  {renderTable(
                    teams,
                    `${t("leagueTable.group")} ${groupName
                      .replace(/^group/i, "")
                      .toUpperCase()}`,
                    2,
                    0
                  )}
                </div>
              ))}
            </div>
          ))}

          <KnockoutStage league="B" year={year} />
        </>
      )}
    </div>
  );
};
