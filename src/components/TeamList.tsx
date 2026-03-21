import { useTranslation } from "react-i18next";
import TeamCard from "./TeamCard";
import { teamDetails } from "../lib/footballData";
import { EmptyState } from "./ui/EmptyState";

interface TeamListProps {
  stateDivision?: string;
}

export default function TeamList({ stateDivision }: TeamListProps) {
  const { t } = useTranslation();
  const filteredTeams = stateDivision
    ? teamDetails.filter((team) => team.stateDivision === stateDivision)
    : teamDetails;

  if (filteredTeams.length === 0) {
    return (
      <EmptyState
        title={t("teamList.emptyTitle")}
        description={t("teamList.emptyDescription")}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 px-2 md:grid-cols-3 md:px-4 lg:grid-cols-4">
      {filteredTeams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}
