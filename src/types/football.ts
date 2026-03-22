export interface TeamHistory {
  id: number;
  history?: string;
  curiosities?: string[];
}

export interface SocialLinks {
  id: number;
  instagram?: string | null;
  twitter?: string | null;
  tiktok?: string | null;
  facebook?: string | null;
  youtube?: string | null;
  website?: string | null;
}

export interface Champion {
  edition: string;
  year: string;
  champion: string;
  idTeamChampion: number | null;
  cityChampion: string;
  runner_up: string;
  cityRunnerUp: string;
}

export interface TeamDetails {
  id: number;
  name: string;
  foundationDate?: string | null;
  city?: string | null;
  stateDivision?: string | null;
  stateNational?: string | null;
  image: string;
}

export interface TeamCardData {
  id: number;
  name: string;
  image: string;
}

export interface LeagueTeam {
  name: string;
  logo: string;
  points: number;
  games: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface MatchTeam {
  id: number;
  name: string;
  image: string;
}

export interface KnockoutMatch {
  team1: MatchTeam;
  team2: MatchTeam;
  firstLeg: { score1: number; score2: number };
  secondLeg?: { score1: number; score2: number };
  penaltys?: { score1: number; score2: number };
  aggregate?: { team1: number; team2: number };
  winnerId: number;
}

export interface KnockoutLeagueStage {
  playoff?: KnockoutMatch[];
  quarterfinals?: KnockoutMatch[];
  semifinals?: KnockoutMatch[];
  final: KnockoutMatch[];
  championId: number;
}

export interface KnockoutMultiStage {
  stages: Record<string, KnockoutLeagueStage>;
}

export interface SerieUniqueStage {
  group: "unique";
  teams: Omit<LeagueTeam, "goalDifference">[];
}

export interface SerieGroupedStage {
  stages: Record<
    string,
    {
      groups: Record<string, Omit<LeagueTeam, "goalDifference">[]>;
    }
  >;
}

export type SerieAData = SerieUniqueStage | SerieGroupedStage;
export type SerieBData = SerieGroupedStage;

export interface LeagueSeasons {
  [year: string]: {
    serieA: SerieAData;
    serieB: SerieBData;
  };
}

export interface KnockoutStageData {
  [year: string]: {
    serieA: KnockoutLeagueStage | KnockoutMultiStage;
    serieB: KnockoutLeagueStage | KnockoutMultiStage;
  };
}

export interface TranslatedTeamsFile {
  Teams: TeamHistory[];
}
