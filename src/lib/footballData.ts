import championsJson from "../data/champions.json";
import teamsContentJson from "../data/teamsContent.json";
import detailsTeamJson from "../data/detailsTeam.json";
import socialMediaJson from "../data/socialMedia.json";
import groupStageJson from "../components/data/groupStage.json";
import knockoutStageJson from "../components/data/knockoutStage.json";
import type {
  Champion,
  KnockoutStageData,
  LeagueSeasons,
  SocialLinks,
  TeamDetails,
  TeamHistory,
} from "../types/football";

export const teamDetails = detailsTeamJson.detailsTeam as TeamDetails[];
export const socialMediaLinks = socialMediaJson.socialMedia as SocialLinks[];
export const champions = championsJson.champions as Champion[];
export const leagueSeasons = groupStageJson as LeagueSeasons;
export const knockoutSeasons = knockoutStageJson as KnockoutStageData;

export function getTeamDetailsById(teamId: number) {
  return teamDetails.find((team) => team.id === teamId);
}

export function getTeamHistoryById(teamId: number, language: string): TeamHistory | undefined {
  const langKey = language.toUpperCase().startsWith("EN") ? "en" : "pt";
  const teamEntry = teamsContentJson.teams.find((t) => t.id === teamId);
  
  if (!teamEntry) {
    return undefined;
  }

  const translatedContent = teamEntry[langKey] || teamEntry.pt;
  return {
    id: teamEntry.id,
    history: translatedContent.history,
    curiosities: translatedContent.curiosities,
  };
}

export function getSocialLinksByTeamId(teamId: number) {
  return socialMediaLinks.find((social) => social.id === teamId);
}

export function getChampionsByTeamId(teamId: number) {
  return champions.filter((champion) => champion.idTeamChampion === teamId);
}
