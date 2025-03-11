import { useState, useEffect } from "react";
import data from "../../data.json";
import TeamCard from "./TeamCard";

// Define uma interface para a prop 'status'
interface TeamListProps {
  status?: string; // 'status' é opcional e do tipo string
}

export default function TeamList({ status }: TeamListProps) {
  // Extrai os times da propriedade "Teams" do JSON
  const teams = data.Teams;
  const [filteredTeams, setFilteredTeams] = useState(teams);

  useEffect(() => {
    if (!status) {
      // Se não houver status, exibe todos os times
      setFilteredTeams(teams);
    } else {
      // Filtra os times com base no status
      const filtered = teams.filter((team) => team.status === status);
      setFilteredTeams(filtered);
    }
  }, [status, teams]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredTeams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}
