export interface TeamHistory  {
  id: number;
  history?: string;
  curiosities?: string[];
};

export interface SocialLinks {
  id: number;
  instagram?: string | null;
  twitter?: string | null;
  tiktok?: string | null;
  facebook?: string | null;
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
};