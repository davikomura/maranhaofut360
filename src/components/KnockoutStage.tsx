import { useTranslation } from "react-i18next";
import knockoutDataJson from "./data/knockoutStage.json";

interface KnockoutStageData {
  [year: string]: {
    serieA: LeagueStage;
    serieB?: LeagueStage;
  };
}

interface LeagueStage {
  semifinals: Match[];
  final: Match[];
  championId: number;
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
  secondLeg: { score1: number; score2: number };
  winnerId: number;
}

interface KnockoutProps {
  league?: string;
  year: string;
}

const knockoutData = knockoutDataJson as KnockoutStageData;

export const KnockoutStage = ({ league = "A", year }: KnockoutProps) => {
  const { t } = useTranslation();
  const leagueKey = `serie${league.toUpperCase()}` as keyof (typeof knockoutData)[string];
  const yearData = knockoutData[year]?.[leagueKey];

  if (!yearData) {
    return (
      <div className="text-center text-yellow-400 mt-10">
        {t("knockout.noData", { year })}
      </div>
    );
  }

  const { semifinals, final, championId } = yearData;

  const renderMatchRow = (team: Team, score1: number, score2: number, isWinner: boolean) => (
    <tr
      key={team.id}
      className={`rounded-xl ${isWinner ? "text-green-400 font-semibold" : "text-gray-300"}`}
    >
      <td className="flex items-center gap-2 pl-2">
        <img src={team.image} alt={team.name} className="w-6 h-6 object-contain" />
        <span>{team.name}</span>
      </td>
      <td className="text-center font-mono">{score1}</td>
      <td className="text-center font-mono">{score2}</td>
    </tr>
  );

  const MatchCard = ({ match, stage }: { match: Match; stage: string }) => (
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
              <th className="text-center">{t("knockout.secondLeg")}</th>
            </tr>
          </thead>
          <tbody>
            {[match.team1, match.team2].map((team, index) => {
              const score1 = index === 0 ? match.firstLeg.score1 : match.firstLeg.score2;
              const score2 = index === 0 ? match.secondLeg.score1 : match.secondLeg.score2;
              const isWinner = match.winnerId === team.id;
              return renderMatchRow(team, score1, score2, isWinner);
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const championMatch = final[0];
  const championTeam =
    championMatch.team1.id === championId ? championMatch.team1.name : championMatch.team2.name;

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black text-white py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-12">
        <h1 className="text-4xl font-bold text-center text-red-500">
          {t("knockout.title")}
        </h1>

        <div className="grid gap-10 md:grid-cols-2">
          {semifinals.map((match, index) => (
            <MatchCard key={index} match={match} stage="semifinal" />
          ))}
        </div>

        <div className="max-w-md mx-auto mt-14">
          <MatchCard match={championMatch} stage="final" />
        </div>

        <div className="text-center mt-12">
          <h2 className="text-xl font-semibold text-green-400">
            {t("knockout.champion")}:{" "}
            <span className="font-bold text-yellow-300">{championTeam}</span>
          </h2>
        </div>
      </div>
    </div>
  );
};