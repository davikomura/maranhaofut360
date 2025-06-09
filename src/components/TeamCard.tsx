import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Team = {
  id: number;
  name: string;
  image: string;
};

export default function TeamCard({ team }: { team: Team }) {

  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center border border-gray-700 rounded-xl shadow-md bg-gradient-to-br from-gray-900 via-gray-800 to-black p-3 hover:shadow-lg hover:-translate-y-1.5 transition-transform duration-300 w-full min-w-[140px] mx-auto">
      <div className="w-full aspect-square overflow-hidden rounded-lg mb-3 border border-gray-700">
        <img
          src={team.image}
          alt={team.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <h2 className="text-base font-semibold text-gray-200 text-center">
        {team.name}
      </h2>
      <Link
        to={`/team/${team.id}`}
        className="mt-1.5 text-xs text-blue-400 font-medium hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-colors"
      >
        {t("teamList.teamCard.link")}
      </Link>
    </div>
  );
}
