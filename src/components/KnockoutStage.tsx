import { useTranslation } from "react-i18next";
import { knockoutSeasons } from "../lib/footballData";
import { leagueSeasons } from "../lib/footballData";
import { sortLeagueTeams, withGoalDifference } from "../lib/league";
import { fixDisplayText } from "../utils/text";
import type {
  KnockoutLeagueStage,
  KnockoutMatch,
  KnockoutMultiStage,
  MatchTeam,
} from "../types/football";
import { EmptyState } from "./ui/EmptyState";

interface KnockoutProps {
  league?: string;
  year: string;
  stageName?: string;
}

export const KnockoutStage = ({
  league = "A",
  year,
  stageName,
}: KnockoutProps) => {
  const { t } = useTranslation();
  const leagueKey = `serie${league.toUpperCase()}` as "serieA" | "serieB";
  const yearData = knockoutSeasons[year]?.[leagueKey];

  if (!yearData) {
    return (
      <EmptyState
        title={t("knockout.emptyTitle")}
        description={t("knockout.noData", { year })}
      />
    );
  }

  const playoffTeams =
    league === "A" && year === "2026" && "group" in leagueSeasons[year].serieA
      ? sortLeagueTeams(withGoalDifference(leagueSeasons[year].serieA.teams)).slice(-3, -1)
      : [];

  const renderMatchRow = (
    team: MatchTeam,
    match: KnockoutMatch,
    index: number,
    showSecondLeg: boolean
  ) => {
    const isTeam1 = index === 0;
    const score1 = isTeam1 ? match.firstLeg.score1 : match.firstLeg.score2;
    const score2 =
      showSecondLeg && match.secondLeg
        ? isTeam1
          ? match.secondLeg.score1
          : match.secondLeg.score2
        : "-";
    const isWinner = match.winnerId === team.id;

    return (
      <tr key={team.id} className={isWinner ? "text-green-400 font-semibold" : "text-gray-300"}>
        <td className="px-3 py-3">
          <div className="flex items-center gap-2">
            <img
              src={team.image}
              alt={fixDisplayText(team.name)}
              className="h-6 w-6 object-contain"
            />
            <span className="truncate">{fixDisplayText(team.name)}</span>
          </div>
        </td>
        <td className="px-3 py-3 text-center font-mono">{score1}</td>
        {showSecondLeg && <td className="px-3 py-3 text-center font-mono">{score2}</td>}
        {match.penaltys && (
          <td className="px-3 py-3 text-center font-mono text-yellow-400">
            {index === 0 ? match.penaltys.score1 : match.penaltys.score2}
          </td>
        )}
      </tr>
    );
  };

  const MatchCard = ({ match, stage }: { match: KnockoutMatch; stage: string }) => {
    const showSecondLeg = !!match.secondLeg;

    return (
      <article className="overflow-hidden rounded-[1.75rem] border border-gray-800 bg-gray-950 shadow-xl">
        <div className="border-b border-gray-800 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 px-4 py-4">
          <div className="text-sm font-bold uppercase tracking-wide text-blue-400">
            {t(`knockout.${stage}`)}
          </div>
        </div>
        <div className="overflow-auto p-4">
          <table className="w-full min-w-[280px] text-left text-sm">
            <thead>
              <tr className="text-gray-400">
                <th className="px-3 pb-2">{t("knockout.club")}</th>
                <th className="px-3 pb-2 text-center">{t("knockout.firstLeg")}</th>
                {showSecondLeg && (
                  <th className="px-3 pb-2 text-center">{t("knockout.secondLeg")}</th>
                )}
                {match.penaltys && (
                  <th className="px-3 pb-2 text-center">{t("knockout.penaltys")}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {[match.team1, match.team2].map((team, index) =>
                renderMatchRow(team, match, index, showSecondLeg)
              )}
            </tbody>
          </table>
        </div>
      </article>
    );
  };

  const renderStage = (currentStageName: string, stageData: KnockoutLeagueStage) => {
    const championMatch = stageData.final[0];
    const championTeam =
      championMatch.team1.id === stageData.championId
        ? championMatch.team1.name
        : championMatch.team2.name;

    return (
      <section key={currentStageName} className="rounded-[2rem] border border-gray-800 bg-black/25 p-4 md:p-6">
        <div className="mb-6 flex flex-col gap-2 border-b border-gray-800 pb-4">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            {t("knockout.stageLabel")}
          </span>
          <h2 className="text-2xl font-bold uppercase text-red-500 md:text-3xl">
            {t(`knockout.${currentStageName}`)}
          </h2>
        </div>

        {currentStageName === "mainStage" &&
        playoffTeams.length === 2 &&
        !stageData.playoff?.length ? (
          <div className="mb-6 rounded-[1.75rem] border border-yellow-500/30 bg-yellow-500/5 p-5">
            <div className="mb-4">
              <h3 className="text-lg font-bold uppercase tracking-wide text-yellow-300">
                {t("knockout.playoff")}
              </h3>
              <p className="mt-1 text-sm text-gray-400">{t("knockout.playoffDescription")}</p>
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <PlayoffTeamCard
                name={fixDisplayText(playoffTeams[0].name)}
                logo={playoffTeams[0].logo}
                position={playoffTeams.length === 2 ? 6 : undefined}
              />
              <div className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-yellow-200">
                {t("knockout.vs")}
              </div>
              <PlayoffTeamCard
                name={fixDisplayText(playoffTeams[1].name)}
                logo={playoffTeams[1].logo}
                position={playoffTeams.length === 2 ? 7 : undefined}
              />
            </div>
          </div>
        ) : null}

        {stageData.playoff?.length ? (
          <div className="mb-6 grid gap-6">
            {stageData.playoff.map((match, index) => (
              <MatchCard key={`playoff-${index}`} match={match} stage="playoff" />
            ))}
          </div>
        ) : null}

        {stageData.semifinals?.length ? (
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {stageData.semifinals.map((match, index) => (
              <MatchCard key={index} match={match} stage="semifinal" />
            ))}
          </div>
        ) : null}

        <div className="mx-auto mt-6 max-w-2xl">
          <MatchCard match={championMatch} stage="final" />
        </div>

        <div className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/5 px-4 py-4 text-center">
          <h3 className="text-lg font-semibold text-green-400 md:text-xl">
            {t("knockout.champion")}:{" "}
            <span className="font-bold text-yellow-300">{fixDisplayText(championTeam)}</span>
          </h3>
        </div>
      </section>
    );
  };

  const isMultiStage = (
    data: KnockoutLeagueStage | KnockoutMultiStage
  ): data is KnockoutMultiStage => "stages" in data;

  return (
    <div className="space-y-8">
      {isMultiStage(yearData) ? (
        stageName ? (
          yearData.stages[stageName] ? (
            renderStage(stageName, yearData.stages[stageName])
          ) : (
            <EmptyState
              title={t("knockout.emptyTitle")}
              description={t("knockout.noStageData", { stageName })}
            />
          )
        ) : (
          Object.entries(yearData.stages).map(([stage, stageData]) =>
            renderStage(stage, stageData)
          )
        )
      ) : (
        renderStage("mainStage", yearData)
      )}
    </div>
  );
};

function PlayoffTeamCard({
  name,
  logo,
  position,
}: {
  name: string;
  logo: string;
  position?: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-800 bg-black/30 px-4 py-4">
      <img src={logo} alt={name} className="h-10 w-10 object-contain" />
      <div>
        <p className="font-semibold text-white">{name}</p>
        {position ? <p className="text-xs text-gray-400">{position}º lugar</p> : null}
      </div>
    </div>
  );
}
