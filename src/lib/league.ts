import type { LeagueTeam } from "../types/football";

export function withGoalDifference(teams: Omit<LeagueTeam, "goalDifference">[]): LeagueTeam[] {
  return teams.map((team) => ({
    ...team,
    goalDifference: team.goalsFor - team.goalsAgainst,
  }));
}

export function sortLeagueTeams(teams: LeagueTeam[]) {
  return [...teams].sort((a, b) =>
    b.points !== a.points
      ? b.points - a.points
      : b.goalDifference !== a.goalDifference
      ? b.goalDifference - a.goalDifference
      : b.goalsFor - a.goalsFor
  );
}
