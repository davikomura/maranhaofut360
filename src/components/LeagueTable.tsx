interface LeagueProps {
    league?: string; // 'Status' é opcional e do tipo string
  }

export const LeagueTable = ({ league }: LeagueProps) => {
  // Dados fictícios para exibição inicial
  const teams = [
    { position: 1, name: "Time A", points: 30, games: 15, wins: 9, draws: 3, losses: 3 },
    { position: 2, name: "Time B", points: 28, games: 15, wins: 8, draws: 4, losses: 3 },
    { position: 3, name: "Time C", points: 25, games: 15, wins: 7, draws: 4, losses: 4 },
  ];

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-center text-gray-300 mb-4">
        Classificação - Série {league}
      </h3>
      <table className="w-full text-gray-300">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-2">Pos</th>
            <th className="p-2">Time</th>
            <th className="p-2">Pts</th>
            <th className="p-2">J</th>
            <th className="p-2">V</th>
            <th className="p-2">E</th>
            <th className="p-2">D</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.position} className="text-center border-b border-gray-700">
              <td className="p-2">{team.position}</td>
              <td className="p-2">{team.name}</td>
              <td className="p-2">{team.points}</td>
              <td className="p-2">{team.games}</td>
              <td className="p-2">{team.wins}</td>
              <td className="p-2">{team.draws}</td>
              <td className="p-2">{team.losses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
