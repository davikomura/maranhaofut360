import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { knockoutSeasons, leagueSeasons } from "../lib/footballData";
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

const DESKTOP_ROW_HEIGHT = 176;

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
    const firstLegScore = isTeam1 ? match.firstLeg.score1 : match.firstLeg.score2;
    const secondLegScore =
      showSecondLeg && match.secondLeg
        ? isTeam1
          ? match.secondLeg.score1
          : match.secondLeg.score2
        : "-";
    const isWinner = match.winnerId === team.id;

    return (
      <tr key={team.id} className={isWinner ? "font-semibold text-green-400" : "text-gray-300"}>
        <td className="px-3 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <img
              src={team.image}
              alt={fixDisplayText(team.name)}
              className="h-6 w-6 shrink-0 object-contain"
            />
            <span className="whitespace-normal break-words leading-snug">
              {fixDisplayText(team.name)}
            </span>
          </div>
        </td>
        <td className="px-3 py-3 text-center font-mono">{firstLegScore}</td>
        {showSecondLeg ? (
          <td className="px-3 py-3 text-center font-mono">{secondLegScore}</td>
        ) : null}
        {match.penaltys ? (
          <td className="px-3 py-3 text-center font-mono text-yellow-400">
            {index === 0 ? match.penaltys.score1 : match.penaltys.score2}
          </td>
        ) : null}
      </tr>
    );
  };

  const MatchCard = ({
    match,
    stage,
    compact = false,
  }: {
    match: KnockoutMatch;
    stage: string;
    compact?: boolean;
  }) => {
    const showSecondLeg = !!match.secondLeg;

    return (
      <article
        className={`overflow-hidden border border-gray-800 bg-gray-950 shadow-xl ${
          compact ? "rounded-2xl" : "rounded-[1.75rem]"
        }`}
      >
        <div
          className={`border-b border-gray-800 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 ${
            compact ? "px-3 py-3" : "px-4 py-4"
          }`}
        >
          <div className="text-sm font-bold uppercase tracking-wide text-blue-400">
            {t(`knockout.${stage}`)}
          </div>
        </div>

        <div className={compact ? "p-3" : "p-4"}>
          <table className="w-full table-fixed text-left text-sm">
            <colgroup>
              <col className="w-[48%]" />
              <col className="w-[17%]" />
              {showSecondLeg ? <col className="w-[17%]" /> : null}
              {match.penaltys ? <col className="w-[18%]" /> : null}
            </colgroup>
            <thead>
              <tr className="text-gray-400">
                <th className="px-3 pb-2">{t("knockout.club")}</th>
                <th className="px-3 pb-2 text-center">{t("knockout.firstLeg")}</th>
                {showSecondLeg ? (
                  <th className="px-3 pb-2 text-center">{t("knockout.secondLeg")}</th>
                ) : null}
                {match.penaltys ? (
                  <th className="px-3 pb-2 text-center">{t("knockout.penaltys")}</th>
                ) : null}
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

  const BracketTree = ({ stageData }: { stageData: KnockoutLeagueStage }) => {
    const rounds = getBracketRounds(stageData, t);
    const totalRows = stageData.quarterfinals?.length ? 8 : stageData.semifinals?.length ? 4 : 2;
    const bracketHeight = totalRows * DESKTOP_ROW_HEIGHT;

    return (
      <>
        <div className="space-y-6 xl:hidden">
          {rounds.map((round) => (
            <div
              key={`mobile-${round.key}`}
              className={
                round.key === "final" ? "mx-auto max-w-2xl" : "grid gap-6 md:grid-cols-2 md:gap-8"
              }
            >
              {round.matches.map((match, index) => (
                <MatchCard key={`${round.key}-${index}`} match={match} stage={round.stage} />
              ))}
            </div>
          ))}
        </div>

        <div className="hidden xl:block">
          <div className="rounded-[1.75rem] border border-gray-800 bg-black/20 p-6">
            <div
              className="grid items-start gap-3"
              style={{
                gridTemplateColumns: rounds
                  .map((_, index) =>
                    index < rounds.length - 1 ? "minmax(0,1fr) 52px" : "minmax(0,1fr)"
                  )
                  .join(" "),
              }}
            >
              {rounds.map((round, index) => (
                <RoundFragment key={round.key}>
                  <div>
                    <div className="mb-4 px-1 text-center text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
                      {round.title}
                    </div>
                    <div
                      className="grid"
                      style={{
                        height: `${bracketHeight}px`,
                        gridTemplateRows: `repeat(${totalRows}, minmax(0, 1fr))`,
                      }}
                    >
                      {round.matches.map((match, matchIndex) => (
                        <div
                          key={`${round.key}-${matchIndex}`}
                          className="min-w-0 px-1"
                          style={{ gridRow: `${round.positions[matchIndex]} / span 1` }}
                        >
                          <MatchCard match={match} stage={round.stage} compact />
                        </div>
                      ))}
                    </div>
                  </div>

                  {index < rounds.length - 1 ? (
                    <BracketConnectorColumn
                      from={round.positions}
                      to={rounds[index + 1].positions}
                      height={bracketHeight}
                    />
                  ) : null}
                </RoundFragment>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderStage = (currentStageName: string, stageData: KnockoutLeagueStage) => {
    const championMatch = stageData.final[0];
    const championTeam =
      championMatch.team1.id === stageData.championId
        ? championMatch.team1.name
        : championMatch.team2.name;

    return (
      <section
        key={currentStageName}
        className="rounded-[2rem] border border-gray-800 bg-black/25 p-4 md:p-6"
      >
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

        <div className="mt-6">
          <BracketTree stageData={stageData} />
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
          Object.entries(yearData.stages).map(([stage, data]) => renderStage(stage, data))
        )
      ) : (
        renderStage("mainStage", yearData)
      )}
    </div>
  );
};

function getBracketRounds(
  stageData: KnockoutLeagueStage,
  t: (key: string) => string
) {
  const rounds: Array<{
    key: string;
    title: string;
    stage: string;
    matches: KnockoutMatch[];
    positions: number[];
  }> = [];

  if (stageData.quarterfinals?.length) {
    rounds.push({
      key: "quarterfinals",
      title: t("knockout.quarterfinal"),
      stage: "quarterfinal",
      matches: stageData.quarterfinals,
      positions: [1, 3, 5, 7],
    });
  }

  if (stageData.semifinals?.length) {
    rounds.push({
      key: "semifinals",
      title: t("knockout.semifinal"),
      stage: "semifinal",
      matches: stageData.semifinals,
      positions: stageData.quarterfinals?.length ? [2, 6] : [1, 3],
    });
  }

  rounds.push({
    key: "final",
    title: t("knockout.final"),
    stage: "final",
    matches: stageData.final,
    positions: stageData.quarterfinals?.length ? [4] : stageData.semifinals?.length ? [2] : [1],
  });

  return rounds;
}

function RoundFragment({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function BracketConnectorColumn({
  from,
  to,
  height,
}: {
  from: number[];
  to: number[];
  height: number;
}) {
  const groups = to.map((targetPosition, index) => ({
    targetPosition,
    sourcePositions: from.slice(index * 2, index * 2 + 2),
  }));

  return (
    <div className="relative" style={{ height: `${height}px` }}>
      {groups.map((group) => {
        const centers = group.sourcePositions.map(
          (position) => (position - 0.5) * DESKTOP_ROW_HEIGHT
        );
        const mergePoint = (Math.min(...centers) + Math.max(...centers)) / 2;
        const targetCenter = (group.targetPosition - 0.5) * DESKTOP_ROW_HEIGHT;
        const top = Math.min(...centers);
        const bottom = Math.max(...centers);

        return (
          <div key={`${group.targetPosition}`} className="absolute inset-0">
            <div
              className="absolute left-0 h-[2px] w-1/2 bg-blue-400/70"
              style={{ top: `${top}px` }}
            />
            <div
              className="absolute left-0 h-[2px] w-1/2 bg-blue-400/70"
              style={{ top: `${bottom}px` }}
            />
            <div
              className="absolute left-1/2 w-[2px] -translate-x-1/2 bg-blue-400/70"
              style={{ top: `${top}px`, height: `${bottom - top}px` }}
            />
            <div
              className="absolute left-1/2 w-[2px] -translate-x-1/2 bg-blue-400/70"
              style={{
                top: `${Math.min(mergePoint, targetCenter)}px`,
                height: `${Math.abs(targetCenter - mergePoint)}px`,
              }}
            />
            <div
              className="absolute left-1/2 h-[2px] w-1/2 bg-blue-400/70"
              style={{ top: `${targetCenter}px` }}
            />
          </div>
        );
      })}
    </div>
  );
}

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
      <img src={logo} alt={name} className="h-10 w-10 shrink-0 object-contain" />
      <div className="min-w-0">
        <p className="whitespace-normal break-words font-semibold text-white">{name}</p>
        {position ? <p className="text-xs text-gray-400">{position}o lugar</p> : null}
      </div>
    </div>
  );
}
