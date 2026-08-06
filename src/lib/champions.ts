import { champions } from "./footballData";
import { fixDisplayText } from "../utils/text";

/**
 * Normaliza textos para comparação insensível a acentos, caixa alta/baixa e espaços extras.
 */
function normalizeString(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Verifica se o nome informado representa um campeonato sem vencedor válido.
 */
function isInvalidChampionName(championName: string): boolean {
  const normalized = normalizeString(championName);
  return (
    normalized.includes("nao houve campeonato") ||
    normalized.includes("campeonato nao concluido") ||
    normalized.includes("nao concluido")
  );
}

export function getValidChampions() {
  return champions.filter(({ champion }) => {
    const championName = fixDisplayText(champion);
    return championName && !isInvalidChampionName(championName);
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
