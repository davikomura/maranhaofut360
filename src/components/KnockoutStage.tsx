import { useTranslation } from "react-i18next";
import knockoutDataJson from "./data/knockoutStage.json";

interface KnockoutStageData {
  [year: string]: {
    serieA: LeagueStage | MultiStage;
    serieB: LeagueStage | MultiStage;
  };
}

interface Team {
  id: number;
  name: string;
  image: string;
}

interface Match {
  team1: Team;
  team2: Team;
  firstLeg: { score1: number; score2: number };
  secondLeg?: { score1: number; score2: number };
  penaltys?: { score1: number; score2: number };
  aggregate?: { team1: number; team2: number };
  winnerId: number;
}

interface LeagueStage {
  semifinals?: Match[];
  final: Match[];
  championId: number;
}

interface MultiStage {
  stages: {
    [stageName: string]: LeagueStage;
  };
}

interface KnockoutProps {
  league?: string;
  year: string;
  stageName?: string;
}

const knockoutData = knockoutDataJson as KnockoutStageData;

export const KnockoutStage = ({
  league = "A",
  year,
  stageName,
}: KnockoutProps) => {
  const { t } = useTranslation();
  const leagueKey =
    `serie${league.toUpperCase()}` as keyof (typeof knockoutData)[string];
  const yearData = knockoutData[year]?.[leagueKey];

  if (!yearData) {
    return (
      <div className="text-center text-yellow-400 mt-10">
        {t("knockout.noData", { year })}
      </div>
    );
  }

  const renderMatchRow = (
    team: Team,
    match: Match,
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
        className={`rounded-xl ${
          isWinner ? "text-green-400 font-semibold" : "text-gray-300"
        }`}
      >
        <td className="flex items-center gap-2 pl-2">
          <img
            src={team.image}
            alt={team.name}
            className="w-6 h-6 object-contain"
          />
          <span>{team.name}</span>
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

  const MatchCard = ({ match, stage }: { match: Match; stage: string }) => {
    const showSecondLeg = !!match.secondLeg;

    return (
      <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4 w-full">
        <div className="text-sm font-bold text-blue-400 uppercase tracking-wide">
          {t(`knockout.${stage}`)}
        </div>
        <div className="w-full overflow-auto">
          <table className="w-full text-sm text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-400">
                <th className="pl-2"></th>
                <th className="text-center">{t("knockout.firstLeg")}</th>
                {showSecondLeg && (
                  <th className="text-center">{t("knockout.secondLeg")}</th>
                )}
                {match.penaltys && (
                  <th className="text-center">{t("knockout.penaltys")}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {[match.team1, match.team2].map((team, index) =>
                renderMatchRow(team, match, index, showSecondLeg)
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderStage = (stageName: string, stageData: LeagueStage) => {
    const championMatch = stageData.final[0];
    const championTeam =
      championMatch.team1.id === stageData.championId
        ? championMatch.team1.name
        : championMatch.team2.name;

    return (
      <div key={stageName} className="space-y-10">
        <h2 className="text-2xl font-bold text-center text-red-500 uppercase">
          {t(`knockout.${stageName}`)}
        </h2>

        <div className="grid gap-10 md:grid-cols-2">
          {stageData.semifinals?.map((match, index) => (
            <MatchCard key={index} match={match} stage="semifinal" />
          ))}
        </div>

        <div className="max-w-md mx-auto mt-14">
          <MatchCard match={championMatch} stage="final" />
        </div>

        <div className="text-center mt-12">
          <h3 className="text-xl font-semibold text-green-400">
            {t("knockout.champion")}:{" "}
            <span className="font-bold text-yellow-300">{championTeam}</span>
          </h3>
        </div>
      </div>
    );
  };

  const isMultiStage = (data: any): data is MultiStage => "stages" in data;

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black text-white py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-16">
        {isMultiStage(yearData) ? (
          stageName ? (
            yearData.stages[stageName] ? (
              renderStage(stageName, yearData.stages[stageName])
            ) : (
              <div className="text-center text-yellow-400 mt-10">
                {t("knockout.noStageData", { stageName })}
              </div>
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
    </div>
  );
};
