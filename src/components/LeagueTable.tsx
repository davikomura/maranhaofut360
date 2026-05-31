import type { ReactNode } from "react";
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
type ZoneTone = "green" | "yellow" | "red" | "neutral";

interface TableZone {
  key: string;
  label: string;
  tone: ZoneTone;
  indices: number[];
}

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

  const renderTable = (
    teams: Omit<LeagueTeam, "goalDifference">[],
    title?: string,
    subtitle?: string,
    top = 4,
    bottom = 2
  ) => {
    const sortedTeams = sortLeagueTeams(withGoalDifference(teams));
    const zones = getTableZones({
      league: seriesKey,
      year,
      total: sortedTeams.length,
      top,
      bottom,
      t,
    });

    return (
      <section className="mb-10 py-2">
        {/* Typographic Header (No borders, cardless) */}
        <div className="pb-4 mb-4 border-b border-slate-200/60 dark:border-zinc-900/60">
          {title && <h4 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">{title}</h4>}
          {subtitle && <p className="mt-1 text-xs text-slate-400 dark:text-zinc-550 font-semibold">{subtitle}</p>}
        </div>

        {/* Legend pills directly floating */}
        <div className="mb-6 flex flex-wrap gap-2 text-xs">
          {zones.map((zone) => (
            <LegendPill key={zone.key} tone={zone.tone} label={zone.label} />
          ))}
        </div>

        {/* Mobile (Cardless vertical list rows) */}
        <div className="md:hidden">
          <div className="divide-y divide-slate-200/50 dark:divide-zinc-900/60">
            {sortedTeams.map((team, index) => (
              <MobileTeamCard
                key={`${team.name}-${index}`}
                team={team}
                index={index}
                zone={getZoneForIndex(index, zones)}
              />
            ))}
          </div>
        </div>

        {/* Desktop (Clean borderless table) */}
        <div className="hidden md:block">
          <div className="flex justify-end text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">
            {t("leagueTable.desktopHint")}
          </div>
          <div className="overflow-x-auto">
            <table className="mt-2.5 w-full min-w-[760px] table-auto text-left text-sm text-slate-700 dark:text-zinc-300">
              <thead>
                <tr className="border-b border-slate-200/60 text-xs font-bold uppercase tracking-wider text-slate-400 dark:border-zinc-900/60 dark:text-zinc-550">
                  <th className="px-3 py-3 text-center">{t("leagueTable.position")}</th>
                  <th className="px-3 py-3">{t("leagueTable.team")}</th>
                  <th className="px-3 py-3 text-center">{t("leagueTable.points")}</th>
                  <th className="px-3 py-3 text-center">{t("leagueTable.games")}</th>
                  <th className="px-3 py-3 text-center">{t("leagueTable.wins")}</th>
                  <th className="px-3 py-3 text-center">{t("leagueTable.draws")}</th>
                  <th className="px-3 py-3 text-center">{t("leagueTable.losses")}</th>
                  <th className="px-3 py-3 text-center">{t("leagueTable.goals")}</th>
                  <th className="px-3 py-3 text-center">{t("leagueTable.goalDifference")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-zinc-900/60">
                {sortedTeams.map((team, index) => (
                  <DesktopTeamRow
                    key={`${team.name}-${index}`}
                    team={team}
                    index={index}
                    zone={getZoneForIndex(index, zones)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  };

  const renderStageSection = (
    stageName: string,
    groups: Record<string, Omit<LeagueTeam, "goalDifference">[]>,
    knockout?: ReactNode
  ) => (
    <section className="mb-14 py-2">
      <div className="mb-8 flex flex-col gap-1 border-b border-slate-200/60 pb-3 dark:border-zinc-900/60">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-550">
          {t("leagueTable.stageLabel")}
        </span>
        <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-3xl font-heading">
          {t(`leagueTable.${stageName}`)}
        </h3>
      </div>

      <div className="space-y-12">
        {Object.entries(groups).map(([groupName, teams]) =>
          renderTable(
            teams,
            `${t("leagueTable.group")} ${groupName.replace(/^group/i, "").toUpperCase()}`,
            t("leagueTable.groupDescription", { group: groupName.replace(/^group/i, "").toUpperCase() }),
            getQualifiedSpots({
              league: seriesKey,
              year,
              stageName,
              groupName,
              totalTeams: teams.length,
            }),
            0
          )
        )}
      </div>

      {knockout ? <div className="mt-8">{knockout}</div> : null}
    </section>
  );

  if (seriesKey === "serieA") {
    if ("group" in data.serieA) {
      return (
        <div className="w-full space-y-12">
          {renderTable(
            data.serieA.teams,
            t("leagueTable.overallTable"),
            t("leagueTable.overallDescription"),
            4,
            2
          )}
          <KnockoutStage league="A" year={year} stageName="unique" />
        </div>
      );
    }

    return (
      <div className="w-full">
        {Object.entries(data.serieA.stages).map(([stageName, stageData]) =>
          renderStageSection(
            stageName,
            stageData.groups,
            <KnockoutStage league="A" year={year} stageName={stageName} />
          )
        )}
        <KnockoutStage league="A" year={year} stageName="finalStage" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {Object.entries(data.serieB.stages).map(([stageName, stageData]) =>
        renderStageSection(stageName, stageData.groups)
      )}
      <KnockoutStage league="B" year={year} />
    </div>
  );
};

function MobileTeamCard({
  team,
  index,
  zone,
}: {
  team: LeagueTeam;
  index: number;
  zone: TableZone;
}) {
  const { t } = useTranslation();
  const tone = getZoneStyles(zone.tone);

  return (
    <article className="flex flex-col py-4 first:pt-0 last:pb-0">
      <div className="flex items-center gap-3">
        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${tone.badge}`}>
          {index + 1}
        </div>
        <img
          src={team.logo}
          alt={fixDisplayText(team.name)}
          className="h-8 w-8 shrink-0 rounded-full object-contain bg-slate-50 dark:bg-zinc-900 p-0.5 border border-slate-200/40 dark:border-zinc-800"
        />
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-bold text-[#2C2927] dark:text-white">{fixDisplayText(team.name)}</h4>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5 font-semibold">
            {t("leagueTable.points")}: <span className="font-extrabold text-slate-700 dark:text-zinc-300">{team.points}</span> | {t("leagueTable.goalDifference")}:{" "}
            <span className="font-extrabold text-slate-700 dark:text-zinc-300">{team.goalDifference}</span>
          </p>
        </div>
      </div>

      <dl className="mt-3.5 grid grid-cols-6 gap-1.5 text-center text-[10px] font-bold text-slate-500 dark:text-zinc-400">
        <Stat label={t("leagueTable.games")} value={team.games} />
        <Stat label={t("leagueTable.wins")} value={team.wins} />
        <Stat label={t("leagueTable.draws")} value={team.draws} />
        <Stat label={t("leagueTable.losses")} value={team.losses} />
        <Stat label={t("leagueTable.goals")} value={`${team.goalsFor}:${team.goalsAgainst}`} />
        <Stat label={t("leagueTable.goalDifference")} value={team.goalDifference} />
      </dl>
    </article>
  );
}

function DesktopTeamRow({
  team,
  index,
  zone,
}: {
  team: LeagueTeam;
  index: number;
  zone: TableZone;
}) {
  const tone = getZoneStyles(zone.tone);

  return (
    <tr className={`text-center transition-colors duration-200 ${tone.row}`}>
      <td className={`px-3 py-3.5 font-bold ${tone.badgeText}`}>{index + 1}</td>
      <td className="px-3 py-3.5 text-left">
        <div className="flex items-center gap-3">
          <img
            src={team.logo}
            alt={fixDisplayText(team.name)}
            className="h-7 w-7 rounded-full bg-slate-50 dark:bg-zinc-900 p-0.5 border border-slate-200/50 dark:border-zinc-800"
          />
          <span className="font-bold text-[#2C2927] dark:text-zinc-200">{fixDisplayText(team.name)}</span>
        </div>
      </td>
      <td className="px-3 py-3.5 font-black text-slate-950 dark:text-white">{team.points}</td>
      <td className="px-3 py-3.5">{team.games}</td>
      <td className="px-3 py-3.5">{team.wins}</td>
      <td className="px-3 py-3.5">{team.draws}</td>
      <td className="px-3 py-3.5">{team.losses}</td>
      <td className="px-3 py-3.5 text-slate-400 dark:text-zinc-550 font-semibold">
        {team.goalsFor}:{team.goalsAgainst}
      </td>
      <td className="px-3 py-3.5 font-bold">{team.goalDifference}</td>
    </tr>
  );
}

function LegendPill({ label, tone }: { label: string; tone: ZoneTone }) {
  const styles = {
    green: "border-emerald-500/20 bg-emerald-100 text-emerald-800 dark:text-emerald-400 dark:bg-emerald-500/15 dark:border-emerald-500/10",
    yellow: "border-amber-500/20 bg-amber-100 text-amber-800 dark:text-amber-400 dark:bg-amber-500/15 dark:border-amber-500/10",
    red: "border-red-500/20 bg-red-100 text-red-800 dark:text-red-400 dark:bg-red-500/15 dark:border-red-500/10",
    neutral: "border-slate-200/60 bg-[#F5F2EC]/80 text-slate-600 dark:border-zinc-900/60 dark:bg-zinc-900/60 dark:text-zinc-400",
  };

  return <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles[tone]}`}>{label}</span>;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-[#F5F2EC]/80 py-1.5 dark:bg-zinc-900/50">
      <dt className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-zinc-550">{label}</dt>
      <dd className="mt-0.5 font-bold text-slate-800 dark:text-zinc-200">{value}</dd>
    </div>
  );
}

function getZoneStyles(tone: ZoneTone) {
  const styles = {
    green: {
      rowMobile: "",
      badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
      row: "bg-emerald-50/40 hover:bg-emerald-100/50 dark:bg-emerald-500/[0.01] dark:hover:bg-emerald-500/[0.03]",
      badgeText: "text-emerald-700 dark:text-emerald-400",
    },
    yellow: {
      rowMobile: "",
      badge: "bg-amber-100 text-amber-800 dark:bg-amber-50/40 dark:text-amber-400",
      row: "bg-amber-50/40 hover:bg-amber-100/50 dark:bg-amber-500/[0.01] dark:hover:bg-amber-500/[0.03]",
      badgeText: "text-amber-700 dark:text-amber-400",
    },
    red: {
      rowMobile: "",
      badge: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400",
      row: "bg-red-50/40 hover:bg-red-100/50 dark:bg-red-500/[0.01] dark:hover:bg-red-500/[0.03]",
      badgeText: "text-red-700 dark:text-red-400",
    },
    neutral: {
      rowMobile: "",
      badge: "bg-[#F5F2EC] text-slate-500 dark:bg-zinc-900 dark:text-zinc-400",
      row: "hover:bg-[#F5F2EC]/30 dark:hover:bg-zinc-900/20",
      badgeText: "text-slate-500 dark:text-zinc-500",
    },
  };

  return styles[tone];
}

function getZoneForIndex(index: number, zones: TableZone[]) {
  return zones.find((zone) => zone.indices.includes(index)) ?? zones[zones.length - 1];
}

/* Rest of code unchanged */
function getTableZones({
  league,
  year,
  total,
  top,
  bottom,
  t,
}: {
  league: SeriesKey;
  year: string;
  total: number;
  top: number;
  bottom: number;
  t: (key: string) => string;
}) {
  if (league === "serieA" && year === "2026") {
    return [
      {
        key: "top",
        label: t("leagueTable.legendTop"),
        tone: "green" as const,
        indices: Array.from({ length: top }, (_, index) => index),
      },
      {
        key: "playoff",
        label: t("leagueTable.legendPlayoff"),
        tone: "yellow" as const,
        indices: [total - 3, total - 2],
      },
      {
        key: "relegated",
        label: t("leagueTable.legendRelegated"),
        tone: "red" as const,
        indices: [total - 1],
      },
      {
        key: "middle",
        label: t("leagueTable.legendMiddle"),
        tone: "neutral" as const,
        indices: Array.from({ length: total }, (_, index) => index).filter(
          (index) => index >= top && index < total - 3
        ),
      },
    ];
  }

  const effectiveBottom = league === "serieB" ? 0 : bottom;

  return [
    {
      key: "top",
      label: t("leagueTable.legendTop"),
      tone: "green" as const,
      indices: Array.from({ length: top }, (_, index) => index),
    },
    {
      key: "bottom",
      label: t("leagueTable.legendBottom"),
      tone: "red" as const,
      indices:
        effectiveBottom > 0
          ? Array.from({ length: effectiveBottom }, (_, index) => total - effectiveBottom + index)
          : [],
    },
    {
      key: "middle",
      label: t("leagueTable.legendMiddle"),
      tone: "neutral" as const,
      indices: Array.from({ length: total }, (_, index) => index).filter(
        (index) => index >= top && index < total - effectiveBottom
      ),
    },
  ];
}

function getQualifiedSpots({
  league,
  year,
  stageName,
  groupName,
  totalTeams,
}: {
  league: SeriesKey;
  year: string;
  stageName: string;
  groupName: string;
  totalTeams: number;
}) {
  if (league === "serieB" && year === "2025" && stageName === "firstStage") {
    if (groupName === "groupA") {
      return 4;
    }

    if (groupName === "groupB" || groupName === "groupC") {
      return 2;
    }
  }

  return Math.min(2, totalTeams);
}
