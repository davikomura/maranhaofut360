import championsJson from "../data/champions.json";
import detailsTeamJson from "../data/detailsTeam.json";
import socialMediaJson from "../data/socialMedia.json";
import teamsHistoryJson from "../data/teamsHistory.json";
import groupStageJson from "../components/data/groupStage.json";
import knockoutStageJson from "../components/data/knockoutStage.json";
import type {
  Champion,
  KnockoutStageData,
  LeagueSeasons,
  SocialLinks,
  TeamDetails,
  TeamHistory,
  UnifiedTeamHistory,
} from "../types/football";

export const teamDetails = detailsTeamJson.detailsTeam as TeamDetails[];
export const socialMediaLinks = socialMediaJson.socialMedia as SocialLinks[];
export const champions = championsJson.champions as Champion[];
export const leagueSeasons = groupStageJson as LeagueSeasons;
export const knockoutSeasons = knockoutStageJson as KnockoutStageData;
const teamsHistory = teamsHistoryJson as UnifiedTeamHistory[];

export function getTeamDetailsById(teamId: number) {
  return teamDetails.find((team) => team.id === teamId);
}

export function getTeamHistoryById(teamId: number, language: string): TeamHistory | undefined {
  const langKey = language.toUpperCase().startsWith("EN") ? "EN" : "PT";
  const found = teamsHistory.find((team) => team.id === teamId);
  if (!found) return undefined;

  return {
    id: found.id,
    history: found.history[langKey] || found.history["PT"] || "",
    curiosities: found.curiosities[langKey] || found.curiosities["PT"] || [],
  };
}

export function getSocialLinksByTeamId(teamId: number) {
  return socialMediaLinks.find((social) => social.id === teamId);
}

export function getChampionsByTeamId(teamId: number) {
  return champions.filter((champion) => champion.idTeamChampion === teamId);
}

