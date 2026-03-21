import { useTranslation } from "react-i18next";
import { leagueSeasons } from "../lib/footballData";
import { sortLeagueTeams, withGoalDifference } from "../lib/league";
import type { LeagueSeasons, LeagueTeam } from "../types/football";
import { fixDisplayText } from "../utils/text";
import { KnockoutStage } from "./KnockoutStage";
import { EmptyState } from "./ui/EmptyState";

interface LeagueProps {
  league?: string;
  year: string;
}

type SeriesKey = "serieA" | "serieB";

export const LeagueTable = ({ league, year }: LeagueProps) => {
  const { t } = useTranslation();
  const seriesKey: SeriesKey = league === "B" ? "serieB" : "serieA";
  const data = (leagueSeasons as LeagueSeasons)[year];

  if (!data) {
    return (
      <EmptyState
        title={t("leagueTable.emptyTitle")}
        description={t("leagueTable.emptyDescription", { year })}
      />
    );
  }

  const renderMobileCards = (
    teams: LeagueTeam[],
    topHighlight: number,
    bottomHighlight = 0
  ) => (
    <div className="space-y-3 md:hidden">
      {teams.map((team, index) => {
        const isTop = index < topHighlight;
        const isBottom = bottomHighlight > 0 && index >= teams.length - bottomHighlight;

        return (
          <article
            key={`${team.name}-${index}`}
            className={[
              "rounded-2xl border p-4 shadow-lg",
              isTop
                ? "border-green-600/40 bg-green-600/10"
                : isBottom
                ? "border-red-600/40 bg-red-600/10"
                : "border-gray-800 bg-gray-950/90",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-gray-300">
                  #{index + 1}
                </span>
                <img
                  src={team.logo}
                  alt={fixDisplayText(team.name)}
                  className="h-10 w-10 rounded-full object-contain ring-1 ring-gray-600"
                />
                <div>
                  <h4 className="font-semibold text-white">{fixDisplayText(team.name)}</h4>
                  <p className="text-xs text-gray-400">
                    {t("leagueTable.points")}: {team.points} | {t("leagueTable.goalDifference")}:{" "}
                    {team.goalDifference}
                  </p>
                </div>
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-gray-300">
              <Stat label={t("leagueTable.games")} value={team.games} />
              <Stat label={t("leagueTable.wins")} value={team.wins} />
              <Stat label={t("leagueTable.draws")} value={team.draws} />
              <Stat label={t("leagueTable.losses")} value={team.losses} />
              <Stat label={t("leagueTable.goals")} value={`${team.goalsFor}:${team.goalsAgainst}`} />
              <Stat label={t("leagueTable.goalDifference")} value={team.goalDifference} />
            </dl>
          </article>
        );
      })}
    </div>
  );

  const renderDesktopRows = (
    teams: LeagueTeam[],
    topHighlight: number,
    bottomHighlight = 0
  ) =>
    teams.map((team, index) => {
      const isTop = index < topHighlight;
      const isBottom = bottomHighlight > 0 && index >= teams.length - bottomHighlight;

      return (
        <tr
          key={team.name}
          className={`text-center text-sm transition duration-200 md:text-base ${
            isTop
              ? "bg-green-600/10 hover:bg-green-600/20"
              : isBottom
              ? "bg-red-600/10 hover:bg-red-600/20"
              : "hover:bg-gray-700/30"
          }`}
        >
          <td className="p-2 font-semibold">{index + 1}</td>
          <td className="p-2 text-left">
            <div className="flex items-center gap-3">
              <img
                src={team.logo}
                alt={fixDisplayText(team.name)}
                className="h-7 w-7 rounded-full ring-1 ring-gray-500"
              />
              <span className="truncate font-medium">{fixDisplayText(team.name)}</span>
            </div>
          </td>
          <td className="p-2 font-bold">{team.points}</td>
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
    });

  const renderTable = (
    teams: Omit<LeagueTeam, "goalDifference">[],
    title?: string,
    top = 4,
    bottom = 2
  ) => {
    const sortedTeams = sortLeagueTeams(withGoalDifference(teams));

    return (
      <div className="mb-12">
        {title && (
          <h4 className="mb-5 text-center text-lg font-bold tracking-wide text-gray-100 md:text-xl">
            {title}
          </h4>
        )}
        {renderMobileCards(sortedTeams, top, bottom)}
        <div className="mb-3 hidden justify-end text-xs text-gray-400 md:flex">
          {t("leagueTable.desktopHint")}
        </div>
        <div className="hidden overflow-x-auto rounded-2xl border border-gray-700 shadow-lg md:block">
          <table className="w-full min-w-[720px] table-auto text-gray-200">
            <thead className="bg-gray-800 text-xs uppercase tracking-wide text-gray-300 md:text-sm">
              <tr className="divide-x divide-gray-700">
                <th className="p-3">{t("leagueTable.position")}</th>
                <th className="p-3 text-left">{t("leagueTable.team")}</th>
                <th className="p-3">{t("leagueTable.points")}</th>
                <th className="p-3">{t("leagueTable.games")}</th>
                <th className="p-3">{t("leagueTable.wins")}</th>
                <th className="p-3">{t("leagueTable.draws")}</th>
                <th className="p-3">{t("leagueTable.losses")}</th>
                <th className="p-3">{t("leagueTable.goals")}</th>
                <th className="p-3">{t("leagueTable.goalDifference")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {renderDesktopRows(sortedTeams, top, bottom)}
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
            {Object.entries(data.serieA.stages).map(([stageName, stageData]) => (
              <div key={stageName} className="mb-16">
                <h3 className="mb-8 text-center text-xl font-bold text-gray-100 md:text-2xl">
                  {t(`leagueTable.${stageName}`)}
                </h3>
                {Object.entries(stageData.groups).map(([groupName, teams]) => (
                  <div key={groupName}>
                    {renderTable(
                      teams,
                      `${t("leagueTable.group")} ${groupName.replace(/^group/i, "").toUpperCase()}`,
                      2,
                      0
                    )}
                  </div>
                ))}
                <KnockoutStage league="A" year={year} stageName={stageName} />
              </div>
            ))}
            <KnockoutStage league="A" year={year} stageName="finalStage" />
          </>
        )
      ) : (
        <>
          {Object.entries(data.serieB.stages).map(([stageName, stageData]) => (
            <div key={stageName} className="mb-16">
              <h3 className="mb-8 text-center text-xl font-bold text-gray-100 md:text-2xl">
                {t(`leagueTable.${stageName}`)}
              </h3>
              {Object.entries(stageData.groups).map(([groupName, teams]) => (
                <div key={groupName}>
                  {renderTable(
                    teams,
                    `${t("leagueTable.group")} ${groupName.replace(/^group/i, "").toUpperCase()}`,
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

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-black/40 px-2 py-2">
      <dt className="text-[11px] uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-white">{value}</dd>
    </div>
  );
}
