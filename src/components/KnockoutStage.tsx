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

  const serieAData = leagueSeasons[year]?.serieA;
  const playoffTeams =
    league === "A" && year === "2026" && serieAData && "group" in serieAData
      ? sortLeagueTeams(withGoalDifference(serieAData.teams)).slice(-3, -1)
      : [];

  const renderMatchRow = (
    team: MatchTeam,
    match: KnockoutMatch,
    index: number,
    showSecondLeg: boolean,
    mobileCompact = false
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
      <tr key={team.id} className={isWinner ? "font-bold text-emerald-600 dark:text-emerald-400" : "text-slate-650 dark:text-zinc-400"}>
        <td className="px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <img
              src={team.image}
              alt={fixDisplayText(team.name)}
              className={`${mobileCompact ? "h-5 w-5" : "h-6 w-6"} shrink-0 object-contain bg-slate-50 dark:bg-zinc-900 rounded-sm p-0.5`}
            />
            <span className={`truncate ${mobileCompact ? "leading-5" : "leading-snug"}`}>
              {fixDisplayText(team.name)}
            </span>
          </div>
        </td>
        <td className="px-3 py-2.5 text-center font-mono font-semibold">{firstLegScore}</td>
        {showSecondLeg ? (
          <td className="px-3 py-2.5 text-center font-mono font-semibold">{secondLegScore}</td>
        ) : null}
        {match.penaltys ? (
          <td className="px-3 py-2.5 text-center font-mono text-amber-500 font-black">
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
    mobileCompact = false,
  }: {
    match: KnockoutMatch;
    stage: string;
    compact?: boolean;
    mobileCompact?: boolean;
  }) => {
    const showSecondLeg = !!match.secondLeg;
    const condensed = compact || mobileCompact;

    return (
      <article
        className="overflow-hidden border-b border-slate-200/60 dark:border-zinc-900/60 py-2.5"
      >
        <div
          className={`pb-2 ${
            condensed ? "px-1" : "px-3"
          }`}
        >
          <div className={`${mobileCompact ? "text-[9px]" : "text-xs"} font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400`}>
            {t(`knockout.${stage}`)}
          </div>
        </div>

        <div className="p-1">
          <table className={`w-full table-fixed text-left ${mobileCompact ? "text-[10px]" : "text-xs"}`}>
            <colgroup>
              <col className="w-[48%]" />
              <col className="w-[17%]" />
              {showSecondLeg ? <col className="w-[17%]" /> : null}
              {match.penaltys ? <col className="w-[18%]" /> : null}
            </colgroup>
            <thead>
              <tr className="text-slate-400 dark:text-zinc-550 font-bold">
                <th className="px-3 pb-1.5">{t("knockout.club")}</th>
                <th className="px-3 pb-1.5 text-center">{t("knockout.firstLeg")}</th>
                {showSecondLeg ? (
                  <th className="px-3 pb-1.5 text-center">{t("knockout.secondLeg")}</th>
                ) : null}
                {match.penaltys ? (
                  <th className="px-3 pb-1.5 text-center">{t("knockout.penaltys")}</th>
                ) : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-zinc-900/60">
              {[match.team1, match.team2].map((team, index) =>
                renderMatchRow(team, match, index, showSecondLeg, mobileCompact)
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
        {/* Mobile Bracket */}
        <div className="space-y-4 overflow-hidden xl:hidden">
          {rounds.map((round, index) => (
            <section key={`mobile-${round.key}`} className="space-y-3">
              <div className="py-1 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-550">
                {round.title}
              </div>

              <div
                className="grid gap-3"
                style={{ gridTemplateColumns: `repeat(${round.matches.length}, minmax(0, 1fr))` }}
              >
                {round.matches.map((match, matchIndex) => (
                  <MobileBracketNode
                    key={`${round.key}-${matchIndex}`}
                    match={match}
                    highlightWinner={round.key === "final"}
                  />
                ))}
              </div>

              {index < rounds.length - 1 ? (
                <MobileRoundConnector
                  fromCount={round.matches.length}
                  toCount={rounds[index + 1].matches.length}
                />
              ) : null}
            </section>
          ))}
        </div>

        {/* Desktop Bracket tree directly floating on the canvas */}
        <div className="hidden xl:block">
          <div className="py-6">
            <div
              className="grid items-start gap-4"
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
                    <div className="mb-4 px-1 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-550">
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
        className="py-4"
      >
        <div className="mb-6 flex flex-col gap-1 border-b border-slate-200/60 pb-3 dark:border-zinc-900/60">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-550">
            {t("knockout.stageLabel")}
          </span>
          <h2 className="text-2xl font-extrabold uppercase tracking-tight text-red-500 md:text-3xl font-heading">
            {t(`knockout.${currentStageName}`)}
          </h2>
        </div>

        {currentStageName === "mainStage" &&
        playoffTeams.length === 2 &&
        !stageData.playoff?.length ? (
          <div className="mb-8 border-b border-slate-200/60 dark:border-zinc-900/60 pb-6">
            <div className="mb-4">
              <h3 className="text-lg font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {t("knockout.playoff")}
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">{t("knockout.playoffDescription")}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center pt-2">
              <PlayoffTeamCard
                name={fixDisplayText(playoffTeams[0].name)}
                logo={playoffTeams[0].logo}
                position={playoffTeams.length === 2 ? 6 : undefined}
              />
              <div className="text-center text-xs font-bold uppercase tracking-wider text-amber-500/70">
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
          <div className="mb-8 divide-y divide-slate-200/50 dark:divide-zinc-900/60">
            {stageData.playoff.map((match, index) => (
              <MatchCard key={`playoff-${index}`} match={match} stage="playoff" />
            ))}
          </div>
        ) : null}

        <div className="mt-4">
          <BracketTree stageData={stageData} />
        </div>

        <div className="mt-8 py-4 text-center border-t border-slate-200/60 dark:border-zinc-900/60">
          <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 md:text-xl font-heading">
            {t("knockout.champion")}:{" "}
            <span className="font-extrabold text-amber-600 dark:text-amber-400">{fixDisplayText(championTeam)}</span>
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

function MobileBracketNode({
  match,
  highlightWinner = false,
}: {
  match: KnockoutMatch;
  highlightWinner?: boolean;
}) {
  const teams = [match.team1, match.team2];

  return (
    <article
      className={`py-2 border-b ${
        highlightWinner
          ? "border-amber-500/20"
          : "border-slate-200/50 dark:border-zinc-900/60"
      }`}
    >
      <div className="space-y-1.5">
        {teams.map((team, index) => {
          const isWinner = match.winnerId === team.id;
          const firstLegScore = index === 0 ? match.firstLeg.score1 : match.firstLeg.score2;
          const secondLegScore = match.secondLeg
            ? index === 0
              ? match.secondLeg.score1
              : match.secondLeg.score2
            : null;
          const penaltyScore = match.penaltys
            ? index === 0
              ? match.penaltys.score1
              : match.penaltys.score2
            : null;

          return (
            <div
              key={`${team.id}-${index}`}
              className={`rounded-lg px-2 py-1.5 ${isWinner ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-[#F5F2EC]/40 text-slate-600 dark:bg-zinc-900/40 dark:text-zinc-400"}`}
            >
              <div className="flex items-center gap-2">
                <img
                  src={team.image}
                  alt={fixDisplayText(team.name)}
                  className="h-4 w-4 shrink-0 object-contain bg-white dark:bg-zinc-900 rounded-sm p-0.5"
                />
                <span className="min-w-0 flex-1 truncate text-[10px] font-bold">
                  {fixDisplayText(team.name)}
                </span>
              </div>
              <div className="mt-0.5 text-right text-[9px] font-mono font-semibold text-slate-400 dark:text-zinc-500">
                {firstLegScore}
                {secondLegScore !== null ? ` | ${secondLegScore}` : ""}
                {penaltyScore !== null ? ` | p ${penaltyScore}` : ""}
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function MobileRoundConnector({
  fromCount,
  toCount,
}: {
  fromCount: number;
  toCount: number;
}) {
  const width = 100;
  const height = 34;
  const fromPoints = Array.from({ length: fromCount }, (_, index) => ((index + 0.5) / fromCount) * width);
  const toPoints = Array.from({ length: toCount }, (_, index) => ((index + 0.5) / toCount) * width);

  return (
    <div className="px-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-9 w-full overflow-visible">
        <g stroke="rgba(99,102,241,0.25)" strokeWidth="1.6" fill="none" strokeLinecap="round">
          {toPoints.map((toX, index) => {
            const fromA = fromPoints[index * 2];
            const fromB = fromPoints[index * 2 + 1] ?? fromPoints[index * 2];
            const mergeY = 18;

            return (
              <g key={`${toX}-${index}`}>
                <path d={`M ${fromA} 2 V ${mergeY} H ${toX} V ${height - 2}`} />
                {fromB !== fromA ? <path d={`M ${fromB} 2 V ${mergeY} H ${toX}`} /> : null}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
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
              className="absolute left-0 h-[2.5px] w-1/2 bg-slate-300 dark:bg-zinc-800/80"
              style={{ top: `${top}px` }}
            />
            <div
              className="absolute left-0 h-[2.5px] w-1/2 bg-slate-300 dark:bg-zinc-800/80"
              style={{ top: `${bottom}px` }}
            />
            <div
              className="absolute left-1/2 w-[2.5px] -translate-x-1/2 bg-slate-300 dark:bg-zinc-800/80"
              style={{ top: `${top}px`, height: `${bottom - top}px` }}
            />
            <div
              className="absolute left-1/2 w-[2.5px] -translate-x-1/2 bg-slate-300 dark:bg-zinc-800/80"
              style={{
                top: `${Math.min(mergePoint, targetCenter)}px`,
                height: `${Math.abs(targetCenter - mergePoint)}px`,
              }}
            />
            <div
              className="absolute left-1/2 h-[2.5px] w-1/2 bg-slate-300 dark:bg-zinc-800/80"
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
    <div className="flex items-center gap-3 py-2">
      <img src={logo} alt={name} className="h-9 w-9 shrink-0 object-contain bg-slate-50 dark:bg-zinc-900 rounded-sm p-0.5" />
      <div className="min-w-0">
        <p className="truncate font-bold text-slate-800 dark:text-zinc-200 text-sm leading-none">{name}</p>
        {position ? <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1.5">{position}o lugar</p> : null}
      </div>
    </div>
  );
}
