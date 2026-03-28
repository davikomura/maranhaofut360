import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { TeamCardData } from "../types/football";
import { fixDisplayText } from "../utils/text";

export default function TeamCard({ team }: { team: TeamCardData }) {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex min-w-[140px] w-full flex-col items-center rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 via-gray-800 to-black p-3 shadow-md transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-lg">
      <div className="mb-3 aspect-square w-full overflow-hidden rounded-lg border border-gray-700 bg-black/20">
        <img
          src={team.image}
          alt={fixDisplayText(team.name)}
          className="h-full w-full object-contain p-2 transition-transform duration-300 hover:scale-105"
        />
      </div>
      <h2 className="text-center text-base font-semibold text-gray-200">
        {fixDisplayText(team.name)}
      </h2>
      <Link
        to={`/team/${team.id}`}
        className="mt-1.5 rounded text-xs font-medium text-blue-400 transition-colors hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {t("teamList.teamCard.link")}
      </Link>
    </div>
  );
}
