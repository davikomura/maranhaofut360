import { useState, useEffect } from "react";
import data from "../../data.json";
import TeamCard from "./TeamCard";

interface TeamListProps {
  status?: string;
}

export default function TeamList({ status }: TeamListProps) {
  const teams = data.Teams;
  const [filteredTeams, setFilteredTeams] = useState(teams);

  useEffect(() => {
    if (!status) {
      setFilteredTeams(teams);
    } else {
      const filtered = teams.filter((team) => team.status === status);
      setFilteredTeams(filtered);
    }
  }, [status, teams]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2 md:px-4">
      {filteredTeams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}