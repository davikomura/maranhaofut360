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
      <section className="mb-8 overflow-hidden rounded-[2rem] border border-gray-800 bg-gray-950/80 shadow-2xl">
        <div className="border-b border-gray-800 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 px-4 py-4 md:px-6">
          {title && <h4 className="text-lg font-bold tracking-wide text-white md:text-xl">{title}</h4>}
          {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
        </div>

        <div className="border-b border-gray-800 bg-black/20 px-4 py-3 md:px-6">
          <div className="flex flex-wrap gap-2 text-xs text-gray-300">
            {zones.map((zone) => (
              <LegendPill key={zone.key} tone={zone.tone} label={zone.label} />
            ))}
          </div>
        </div>

        <div className="p-4 md:hidden">
          <div className="space-y-3">
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

        <div className="hidden md:block">
          <div className="flex justify-end px-6 pt-3 text-xs text-gray-400">
            {t("leagueTable.desktopHint")}
          </div>
          <div className="overflow-x-auto px-4 pb-4 md:px-6">
            <table className="mt-3 w-full min-w-[760px] table-auto overflow-hidden rounded-2xl text-gray-200">
              <thead className="text-xs uppercase tracking-wide text-gray-300 md:text-sm">
                <tr className="bg-gray-900">
                  <th className="rounded-l-2xl px-3 py-4">{t("leagueTable.position")}</th>
                  <th className="px-3 py-4 text-left">{t("leagueTable.team")}</th>
                  <th className="px-3 py-4">{t("leagueTable.points")}</th>
                  <th className="px-3 py-4">{t("leagueTable.games")}</th>
                  <th className="px-3 py-4">{t("leagueTable.wins")}</th>
                  <th className="px-3 py-4">{t("leagueTable.draws")}</th>
                  <th className="px-3 py-4">{t("leagueTable.losses")}</th>
                  <th className="px-3 py-4">{t("leagueTable.goals")}</th>
                  <th className="rounded-r-2xl px-3 py-4">{t("leagueTable.goalDifference")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
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
    <section className="mb-14 rounded-[2rem] border border-gray-800 bg-black/25 p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-2 border-b border-gray-800 pb-4 md:mb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
          {t("leagueTable.stageLabel")}
        </span>
        <h3 className="text-2xl font-bold text-white md:text-3xl">
          {t(`leagueTable.${stageName}`)}
        </h3>
      </div>

      <div className="space-y-6">
        {Object.entries(groups).map(([groupName, teams]) =>
          renderTable(
            teams,
            `${t("leagueTable.group")} ${groupName.replace(/^group/i, "").toUpperCase()}`,
            t("leagueTable.groupDescription", { group: groupName.replace(/^group/i, "").toUpperCase() }),
            2,
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
        <div className="w-full space-y-8">
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
    <article className={`rounded-2xl border p-4 shadow-lg ${tone.card}`}>
      <div className="flex items-start gap-3">
        <div className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone.badge}`}>
          #{index + 1}
        </div>
        <img
          src={team.logo}
          alt={fixDisplayText(team.name)}
          className="h-11 w-11 rounded-full object-contain ring-1 ring-gray-600"
        />
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-semibold text-white">{fixDisplayText(team.name)}</h4>
          <p className="mt-1 text-xs text-gray-400">
            {t("leagueTable.points")}: {team.points} | {t("leagueTable.goalDifference")}:{" "}
            {team.goalDifference}
          </p>
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
    <tr className={`text-center text-sm transition duration-200 md:text-base ${tone.row}`}>
      <td className="px-3 py-4 font-semibold">{index + 1}</td>
      <td className="px-3 py-4 text-left">
        <div className="flex items-center gap-3">
          <img
            src={team.logo}
            alt={fixDisplayText(team.name)}
            className="h-8 w-8 rounded-full ring-1 ring-gray-500"
          />
          <span className="truncate font-medium">{fixDisplayText(team.name)}</span>
        </div>
      </td>
      <td className="px-3 py-4 font-bold">{team.points}</td>
      <td className="px-3 py-4">{team.games}</td>
      <td className="px-3 py-4">{team.wins}</td>
      <td className="px-3 py-4">{team.draws}</td>
      <td className="px-3 py-4">{team.losses}</td>
      <td className="px-3 py-4">
        {team.goalsFor}:{team.goalsAgainst}
      </td>
      <td className="px-3 py-4">{team.goalDifference}</td>
    </tr>
  );
}

function LegendPill({ label, tone }: { label: string; tone: ZoneTone }) {
  const styles = {
    green: "border-green-500/40 bg-green-500/10 text-green-300",
    yellow: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
    red: "border-red-500/40 bg-red-500/10 text-red-300",
    neutral: "border-gray-700 bg-gray-900 text-gray-300",
  };

  return <span className={`rounded-full border px-3 py-1 ${styles[tone]}`}>{label}</span>;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-black/40 px-2 py-2">
      <dt className="text-[11px] uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-white">{value}</dd>
    </div>
  );
}

function getZoneStyles(tone: ZoneTone) {
  const styles = {
    green: {
      card: "border-green-600/40 bg-green-600/10",
      badge: "bg-green-500/15 text-green-300",
      row: "bg-green-600/10 hover:bg-green-600/20",
    },
    yellow: {
      card: "border-yellow-500/40 bg-yellow-500/10",
      badge: "bg-yellow-500/15 text-yellow-300",
      row: "bg-yellow-500/10 hover:bg-yellow-500/20",
    },
    red: {
      card: "border-red-600/40 bg-red-600/10",
      badge: "bg-red-500/15 text-red-300",
      row: "bg-red-600/10 hover:bg-red-600/20",
    },
    neutral: {
      card: "border-gray-800 bg-gray-950/90",
      badge: "bg-black/50 text-gray-300",
      row: "hover:bg-gray-700/30",
    },
  };

  return styles[tone];
}

function getZoneForIndex(index: number, zones: TableZone[]) {
  return zones.find((zone) => zone.indices.includes(index)) ?? zones[zones.length - 1];
}

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
        bottom > 0
          ? Array.from({ length: bottom }, (_, index) => total - bottom + index)
          : [],
    },
    {
      key: "middle",
      label: t("leagueTable.legendMiddle"),
      tone: "neutral" as const,
      indices: Array.from({ length: total }, (_, index) => index).filter(
        (index) => index >= top && index < total - bottom
      ),
    },
  ];
}
