import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import type { TeamCardData } from "../types/football";
import { fixDisplayText } from "../utils/text";
import { teamDetails } from "../lib/footballData";

export default function TeamCard({ team }: { team: TeamCardData }) {
  const { t } = useTranslation();
  const fullTeam = teamDetails.find((t) => t.id === team.id);
  const city = fullTeam?.city;
  const founded = fullTeam?.foundationDate
    ? new Date(fullTeam.foundationDate).getFullYear()
    : null;

  return (
    <Link
      to={`/team/${team.id}`}
      className="group flex items-center justify-between py-4 transition-colors hover:bg-[#F5F2EC]/40 dark:hover:bg-zinc-900/10 border-b border-slate-200/50 dark:border-zinc-900/60"
    >
      <div className="flex items-center gap-4 min-w-0">
        {/* Minimal Circle Crest Wrapper */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F5F2EC]/70 p-1.5 dark:bg-zinc-900/60 transition-transform group-hover:scale-105">
          <img
            src={team.image}
            alt={fixDisplayText(team.name)}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>
        
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-[#2C2927] group-hover:text-red-650 dark:text-white dark:group-hover:text-red-400 transition-colors">
            {fixDisplayText(team.name)}
          </h3>
          <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold mt-0.5">
            {city ? fixDisplayText(city) : ""} {founded ? `• ${t("teamDetail.founded")} ${founded}` : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-slate-400 group-hover:text-red-650 dark:text-zinc-500 dark:group-hover:text-red-400 transition-colors">
          {t("teamList.teamCard.link")}
        </span>
        <ArrowRight size={14} className="text-slate-400 transition-transform group-hover:translate-x-1 dark:text-zinc-600" />
      </div>
    </Link>
  );
}
