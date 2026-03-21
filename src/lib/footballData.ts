import championsJson from "../data/champions.json";
import dataEN from "../data/dataEN.json";
import dataPT from "../data/data.json";
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
  TranslatedTeamsFile,
} from "../types/football";

const translatedTeamFiles: Record<string, TranslatedTeamsFile> = {
  EN: dataEN as TranslatedTeamsFile,
  PT: dataPT as TranslatedTeamsFile,
};

export const teamDetails = detailsTeamJson.detailsTeam as TeamDetails[];
export const socialMediaLinks = socialMediaJson.socialMedia as SocialLinks[];
export const champions = championsJson.champions as Champion[];
export const leagueSeasons = groupStageJson as LeagueSeasons;
export const knockoutSeasons = knockoutStageJson as KnockoutStageData;

export function getTranslatedTeams(language: string) {
  return translatedTeamFiles[language.startsWith("EN") ? "EN" : "PT"].Teams;
}

export function getTeamDetailsById(teamId: number) {
  return teamDetails.find((team) => team.id === teamId);
}

export function getTeamHistoryById(teamId: number, language: string) {
  return getTranslatedTeams(language).find((team: TeamHistory) => team.id === teamId);
}

export function getSocialLinksByTeamId(teamId: number) {
  return socialMediaLinks.find((social) => social.id === teamId);
}

export function getChampionsByTeamId(teamId: number) {
  return champions.filter((champion) => champion.idTeamChampion === teamId);
}
