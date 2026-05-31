import { useTranslation } from "react-i18next";
import TeamCard from "./TeamCard";
import { teamDetails } from "../lib/footballData";
import { EmptyState } from "./ui/EmptyState";
import type { TeamDetails } from "../types/football";

interface TeamListProps {
  stateDivision?: string;
}

export default function TeamList({ stateDivision }: TeamListProps) {
  const { t } = useTranslation();

  const getDivisionLabel = (divCode: string | null | undefined) => {
    if (divCode === "A") return "Série A";
    if (divCode === "B") return "Série B";
    return t("teamDetail.noDivision");
  };

  if (stateDivision) {
    const filteredTeams = teamDetails.filter((team) => team.stateDivision === stateDivision);
    
    if (filteredTeams.length === 0) {
      return (
        <EmptyState
          title={t("teamList.emptyTitle")}
          description={t("teamList.emptyDescription")}
        />
      );
    }

    return (
      <div className="flex flex-col divide-y divide-slate-200/50 dark:divide-zinc-900/60">
        {filteredTeams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    );
  }

  // If no division is specified, group teams in a premium editorial alphabetical/division index
  const groups: Record<string, TeamDetails[]> = teamDetails.reduce<Record<string, TeamDetails[]>>(
    (acc, team) => {
      const divLabel = getDivisionLabel(team.stateDivision);
      if (!acc[divLabel]) acc[divLabel] = [];
      acc[divLabel].push(team);
      return acc;
    },
    {}
  );

  // Order groups: Série A, Série B, then Sem Divisão
  const sortedGroupKeys = Object.keys(groups).sort((a, b) => {
    if (a.includes("A")) return -1;
    if (b.includes("A")) return 1;
    if (a.includes("B")) return -1;
    if (b.includes("B")) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="space-y-12">
      {sortedGroupKeys.map((groupName) => {
        const teams = groups[groupName];
        if (teams.length === 0) return null;

        return (
          <div key={groupName} className="space-y-4">
            <div className="border-b border-slate-900/10 pb-2 dark:border-zinc-800/80">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 font-heading">
                {groupName}
              </h3>
            </div>
            <div className="flex flex-col divide-y divide-slate-200/50 dark:divide-zinc-900/60">
              {teams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
