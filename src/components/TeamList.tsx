import { useState, useEffect } from "react";
import teams from "../../data.json";
import TeamCard from "./TeamCard";

// Define a interface para a prop 'Status'
interface TeamListProps {
  status?: string; // 'Status' é opcional e do tipo string
}

export default function TeamList({ status }: TeamListProps) {
  const [filteredTeams, setFilteredTeams] = useState(teams);

  useEffect(() => {
    if (!status) {
      // Se não houver Status, exibe todos os times
      setFilteredTeams(teams);
    } else {
      // Filtra os times com base no Status
      const filtered = teams.filter((team) => team.status === status);
      setFilteredTeams(filtered);
    }
  }, [status]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredTeams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}
