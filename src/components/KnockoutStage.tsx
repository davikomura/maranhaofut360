import { useTranslation } from "react-i18next";
import { knockoutSeasons } from "../lib/footballData";
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
      <tr
        key={team.id}
        className={isWinner ? "text-green-400 font-semibold" : "text-gray-300"}
      >
        <td className="pl-2">
          <div className="flex items-center gap-2">
            <img
              src={team.image}
              alt={fixDisplayText(team.name)}
              className="h-6 w-6 object-contain"
            />
            <span className="truncate">{fixDisplayText(team.name)}</span>
          </div>
        </td>
        <td className="text-center font-mono">{score1}</td>
        {showSecondLeg && <td className="text-center font-mono">{score2}</td>}
        {match.penaltys && (
          <td className="text-center font-mono text-yellow-400">
            {index === 0 ? match.penaltys.score1 : match.penaltys.score2}
          </td>
        )}
      </tr>
    );
  };

  const MatchCard = ({ match, stage }: { match: KnockoutMatch; stage: string }) => {
    const showSecondLeg = !!match.secondLeg;

    return (
      <div className="w-full space-y-4 rounded-2xl border border-gray-800 bg-gray-950 p-5 shadow-xl">
        <div className="text-sm font-bold uppercase tracking-wide text-blue-400">
          {t(`knockout.${stage}`)}
        </div>
        <div className="overflow-auto">
          <table className="w-full min-w-[280px] text-left text-sm">
            <thead>
              <tr className="text-gray-400">
                <th className="pb-2 pl-2">{t("knockout.club")}</th>
                <th className="pb-2 text-center">{t("knockout.firstLeg")}</th>
                {showSecondLeg && (
                  <th className="pb-2 text-center">{t("knockout.secondLeg")}</th>
                )}
                {match.penaltys && (
                  <th className="pb-2 text-center">{t("knockout.penaltys")}</th>
                )}
              </tr>
            </thead>
            <tbody className="space-y-2">
              {[match.team1, match.team2].map((team, index) =>
                renderMatchRow(team, match, index, showSecondLeg)
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderStage = (currentStageName: string, stageData: KnockoutLeagueStage) => {
    const championMatch = stageData.final[0];
    const championTeam =
      championMatch.team1.id === stageData.championId
        ? championMatch.team1.name
        : championMatch.team2.name;

    return (
      <div key={currentStageName} className="space-y-8">
        <h2 className="text-center text-xl font-bold uppercase text-red-500 md:text-2xl">
          {t(`knockout.${currentStageName}`)}
        </h2>

        {stageData.semifinals?.length ? (
          <div className="grid gap-6 md:grid-cols-2 md:gap-10">
            {stageData.semifinals.map((match, index) => (
              <MatchCard key={index} match={match} stage="semifinal" />
            ))}
          </div>
        ) : null}

        <div className="mx-auto max-w-md">
          <MatchCard match={championMatch} stage="final" />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold text-green-400 md:text-xl">
            {t("knockout.champion")}:{" "}
            <span className="font-bold text-yellow-300">{fixDisplayText(championTeam)}</span>
          </h3>
        </div>
      </div>
    );
  };

  const isMultiStage = (
    data: KnockoutLeagueStage | KnockoutMultiStage
  ): data is KnockoutMultiStage => "stages" in data;

  return (
    <section className="space-y-10 rounded-[2rem] border border-gray-800 bg-black/30 px-4 py-8 md:px-6 md:py-12">
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
    </section>
  );
};
