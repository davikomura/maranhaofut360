import { champions } from "./footballData";
import { fixDisplayText } from "../utils/text";

export function getValidChampions() {
  return champions.filter(({ champion }) => {
    const championName = fixDisplayText(champion);
    return (
      championName !== "N\u00E3o houve campeonato" &&
      championName !== "Campeonato n\u00E3o conclu\u00EDdo"
    );
  });
}

export function getChampionStats() {
  const validChampions = getValidChampions();
  const titleCounts: Record<string, number> = {};
  const viceCounts: Record<string, number> = {};
  const cityTitleCounts: Record<string, number> = {};

  validChampions.forEach(({ champion, runner_up, cityChampion }) => {
    const championName = fixDisplayText(champion);
    const runnerUpName = fixDisplayText(runner_up);
    const championCity = fixDisplayText(cityChampion);

    titleCounts[championName] = (titleCounts[championName] || 0) + 1;
    if (runnerUpName) {
      viceCounts[runnerUpName] = (viceCounts[runnerUpName] || 0) + 1;
    }
    if (championCity) {
      cityTitleCounts[championCity] = (cityTitleCounts[championCity] || 0) + 1;
    }
  });

  const finalAppearances: Record<string, number> = {};
  Object.keys({ ...titleCounts, ...viceCounts }).forEach((team) => {
    finalAppearances[team] = (titleCounts[team] || 0) + (viceCounts[team] || 0);
  });

  return {
    validChampions,
    titleCounts,
    viceCounts,
    cityTitleCounts,
    finalAppearances,
  };
}
