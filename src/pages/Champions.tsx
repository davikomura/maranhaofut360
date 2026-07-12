import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Crown, MapPinned, Sparkles, Table2, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getValidChampions } from "../lib/champions";
import { teamDetails } from "../lib/footballData";
import { fixDisplayText } from "../utils/text";
import { useSEO } from "../hooks/useSEO";
import { useJSONLD } from "../hooks/useJSONLD";

type RankingMode = "titles" | "finals" | "cities";

const DECADES = [
  "all",
  "2020",
  "2010",
  "2000",
  "1990",
  "1980",
  "1970",
  "1960",
  "1950",
  "1940",
  "1930",
];

// Helper to look up team logo and id by name
const resolveTeamDetails = (name: string, explicitId: number | null) => {
  if (explicitId) {
    const found = teamDetails.find((t) => t.id === explicitId);
    if (found) return { id: found.id, logo: found.image, name: found.name };
  }
  if (!name) return { id: null, logo: null, name: "" };
  const normalized = fixDisplayText(name).toLowerCase().trim();

  // 1. Exact match
  const exact = teamDetails.find(
    (t) => fixDisplayText(t.name).toLowerCase().trim() === normalized
  );
  if (exact) return { id: exact.id, logo: exact.image, name: exact.name };

  // 2. Nicknames & abbreviations
  let resolvedId: number | null = null;
  if (normalized.includes("sampaio")) resolvedId = 1;
  else if (normalized.includes("moto")) resolvedId = 2;
  else if (
    normalized.includes("mac") ||
    normalized.includes("maranhao") ||
    normalized.includes("maranhão")
  )
    resolvedId = 3;
  else if (normalized.includes("imperatriz")) resolvedId = 4;
  else if (normalized.includes("cordino")) resolvedId = 5;
  else if (normalized.includes("pinheiro")) resolvedId = 6;
  else if (normalized.includes("tuntum")) resolvedId = 7;
  else if (normalized.includes("iape")) resolvedId = 8;
  else if (normalized.includes("viana")) resolvedId = 9;
  else if (normalized.includes("bacabal")) resolvedId = 10;
  else if (normalized.includes("expressinho")) resolvedId = 11;
  else if (normalized.includes("sao jose") || normalized.includes("são josé")) resolvedId = 12;
  else if (normalized.includes("tupan")) resolvedId = 13;
  else if (normalized.includes("americano")) resolvedId = 14;
  else if (normalized.includes("sao luis") || normalized.includes("são luís")) resolvedId = 15;
  else if (normalized.includes("santa quiteria") || normalized.includes("santa quitéria")) resolvedId = 16;
  else if (normalized.includes("timon")) resolvedId = 17;
  else if (normalized.includes("luso")) resolvedId = 18;
  else if (normalized.includes("juventude")) resolvedId = 19;
  else if (normalized.includes("chapadinha")) resolvedId = 20;
  else if (normalized.includes("araioses")) resolvedId = 21;
  else if (normalized.includes("balsas")) resolvedId = 22;
  else if (normalized.includes("sabia") || normalized.includes("sabiá")) resolvedId = 23;
  else if (normalized.includes("jv lideral")) resolvedId = 24;
  else if (normalized.includes("marilia") || normalized.includes("marília")) resolvedId = 25;
  else if (normalized.includes("sirio") || normalized.includes("sírio")) resolvedId = 26;
  else if (normalized.includes("itz")) resolvedId = 27;
  else if (normalized.includes("luminense")) resolvedId = 28;
  else if (normalized.includes("lago verde")) resolvedId = 29;

  if (resolvedId) {
    const found = teamDetails.find((t) => t.id === resolvedId);
    if (found) return { id: found.id, logo: found.image, name: found.name };
  }

  // 3. Fallback partial
  const partial = teamDetails.find((t) =>
    fixDisplayText(t.name).toLowerCase().includes(normalized)
  );
  if (partial) return { id: partial.id, logo: partial.image, name: partial.name };

  return { id: null, logo: null, name };
};

export const Champions = () => {
  const { t } = useTranslation();
  const [showTable, setShowTable] = useState(false);
  const [rankingMode, setRankingMode] = useState<RankingMode>("titles");
  const [selectedDecade, setSelectedDecade] = useState<string>("all");

  const allValidChampions = useMemo(
    () => getValidChampions().filter((c) => parseInt(c.year, 10) >= 1930),
    []
  );

  // Dynamic calculations based on selected decade
  const {
    filteredChampions,
    titleCounts,
    cityTitleCounts,
    finalAppearances,
    topChampion,
    topCity,
    mostFinals,
  } = useMemo(() => {
    const list =
      selectedDecade === "all"
        ? allValidChampions
        : allValidChampions.filter((c) => {
            const yr = parseInt(c.year, 10);
            const dec = parseInt(selectedDecade, 10);
            return yr >= dec && yr < dec + 10;
          });

    const tCounts: Record<string, number> = {};
    const viceCounts: Record<string, number> = {};
    const cCounts: Record<string, number> = {};

    list.forEach(({ champion, runner_up, cityChampion }) => {
      const championName = fixDisplayText(champion);
      const runnerUpName = fixDisplayText(runner_up);
      const championCity = fixDisplayText(cityChampion);

      tCounts[championName] = (tCounts[championName] || 0) + 1;
      if (runnerUpName) {
        viceCounts[runnerUpName] = (viceCounts[runnerUpName] || 0) + 1;
      }
      if (championCity) {
        cCounts[championCity] = (cCounts[championCity] || 0) + 1;
      }
    });

    const finals: Record<string, number> = {};
    Object.keys({ ...tCounts, ...viceCounts }).forEach((team) => {
      finals[team] = (tCounts[team] || 0) + (viceCounts[team] || 0);
    });

    const topChamp =
      Object.entries(tCounts).length > 0
        ? Object.entries(tCounts).reduce((a, b) => (b[1] > a[1] ? b : a))
        : ([t("champions.noDecadeTitle"), 0] as [string, number]);

    const topCit =
      Object.entries(cCounts).length > 0
        ? Object.entries(cCounts).reduce((a, b) => (b[1] > a[1] ? b : a))
        : ([t("champions.noDecadeTitle"), 0] as [string, number]);

    const topFin =
      Object.entries(finals).length > 0
        ? Object.entries(finals).reduce((a, b) => (b[1] > a[1] ? b : a))
        : ([t("champions.noDecadeTitle"), 0] as [string, number]);

    return {
      filteredChampions: list,
      titleCounts: tCounts,
      cityTitleCounts: cCounts,
      finalAppearances: finals,
      topChampion: topChamp,
      topCity: topCit,
      mostFinals: topFin,
    };
  }, [allValidChampions, selectedDecade, t]);

  // Dynamic Page-level SEO
  useSEO({
    title: t("champions.title"),
    description: t("champions.description"),
  });

  // Structured Data (JSON-LD) for Search Engines
  useJSONLD({
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": t("champions.title"),
    "description": t("champions.description"),
    "sport": "Association Football",
    "location": {
      "@type": "Place",
      "name": "Maranhão, Brasil",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "MA",
        "addressCountry": "BR"
      }
    }
  });

  const latestChampion =
    filteredChampions.length > 0
      ? filteredChampions[filteredChampions.length - 1]
      : null;

  const rankingConfig = {
    titles: {
      title: t("champions.titlesByTeam"),
      eyebrow: t("champions.rankingEyebrowTitles"),
      icon: Trophy,
      entries: Object.entries(titleCounts),
      accent: "from-amber-600 via-yellow-500 to-orange-500",
      totalValue: filteredChampions.length,
    },
    finals: {
      title: t("champions.finalsByTeam"),
      eyebrow: t("champions.rankingEyebrowFinals"),
      icon: BarChart3,
      entries: Object.entries(finalAppearances),
      accent: "from-blue-600 via-sky-400 to-blue-500",
      totalValue: filteredChampions.length,
    },
    cities: {
      title: t("champions.cityDistribution"),
      eyebrow: t("champions.rankingEyebrowCities"),
      icon: MapPinned,
      entries: Object.entries(cityTitleCounts),
      accent: "from-emerald-600 via-teal-400 to-green-500",
      totalValue: filteredChampions.length,
    },
  } as const;

  const currentRanking = rankingConfig[rankingMode];
  const RankingIcon = currentRanking.icon;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,_rgba(251,191,36,0.05),_transparent_28%)] px-4 py-12 md:py-20 transition-theme bg-stadium-dots bg-mesh-gradient-rich">
      <div className="mx-auto w-full max-w-6xl space-y-16">
        <section className="relative py-4">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_0.9fr]">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                <Sparkles size={12} />
                {t("champions.heroEyebrow")}
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl dark:text-white leading-[1.08] font-heading">
                {t("champions.title")}
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-slate-600 dark:text-zinc-400">
                {t("champions.description")}
              </p>

              {/* Stats column with fine divider borders */}
              <div className="grid gap-6 pt-4 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/60 dark:divide-zinc-900/60">
                <div className="first:pt-0 pt-4 sm:pt-0">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-550">
                    {t("champions.biggestChampion")}
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white font-heading">
                    {topChampion[0]}
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                    {topChampion[1]} {t("champions.titles")}
                  </p>
                </div>
                <div className="pt-4 sm:pt-0 sm:pl-6">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-550">
                    {t("champions.topCity")}
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white font-heading">
                    {topCity[0]}
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                    {topCity[1]} {t("champions.titles")}
                  </p>
                </div>
                <div className="pt-4 sm:pt-0 sm:pl-6">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-550">
                    {t("champions.mostFinals")}
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white font-heading">
                    {mostFinals[0]}
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                    {mostFinals[1]} {t("champions.finalsLabel")}
                  </p>
                </div>
              </div>
            </div>

            {/* Spotlight directly floating on the canvas */}
            {latestChampion && (
              <div className="relative border-t lg:border-t-0 lg:border-l border-slate-200/60 dark:border-zinc-900/60 pt-8 lg:pt-0 lg:pl-12 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 animate-pulse">
                      <Crown size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-550">
                        {selectedDecade === "all"
                          ? t("champions.latestChampion")
                          : `${t("champions.latestChampion")} (${t("champions.decadePill", {
                              decade: selectedDecade,
                            })})`}
                      </p>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading leading-tight">
                        {fixDisplayText(latestChampion.champion)}
                      </h2>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-200/60 dark:divide-zinc-900/60 text-sm font-semibold">
                    <SpotlightLine
                      label={t("champions.year")}
                      value={latestChampion.year}
                    />
                    <SpotlightLine
                      label={t("champions.runnerUp")}
                      value={fixDisplayText(latestChampion.runner_up)}
                    />
                    <SpotlightLine
                      label={t("champions.city")}
                      value={fixDisplayText(latestChampion.cityChampion)}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setShowTable((current) => !current)}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 cursor-pointer"
                >
                  <Table2 size={16} />
                  {showTable ? t("champions.timelineHide") : t("champions.timelineShow")}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Decade Selector Tabs */}
        <section className="space-y-4 border-t border-b border-slate-200/60 dark:border-zinc-900/60 py-6">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
              {t("champions.decadeLabel")}
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {DECADES.map((dec) => {
                const isActive = selectedDecade === dec;
                return (
                  <button
                    key={dec}
                    onClick={() => setSelectedDecade(dec)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 dark:bg-white dark:text-slate-950 scale-105"
                        : "border border-slate-200 bg-[#FAF8F5]/40 text-slate-655 hover:bg-[#F5F2EC] dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400 dark:hover:bg-zinc-900"
                    }`}
                  >
                    {dec === "all"
                      ? t("champions.allDecades")
                      : t("champions.decadePill", { decade: dec })}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Cardless visual progress columns */}
        <section className="grid gap-12 lg:grid-cols-[0.95fr_1.25fr]">
          
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-550">
                  {t("champions.rankingEyebrow")}
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">{currentRanking.title}</h2>
              </div>
              <div className="rounded-xl bg-[#F5F2EC] p-2 text-slate-800 dark:bg-zinc-900 dark:text-zinc-200">
                <RankingIcon size={18} />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <ModeButton
                active={rankingMode === "titles"}
                label={t("champions.modeTitles")}
                onClick={() => setRankingMode("titles")}
              />
              <ModeButton
                active={rankingMode === "finals"}
                label={t("champions.modeFinals")}
                onClick={() => setRankingMode("finals")}
              />
              <ModeButton
                active={rankingMode === "cities"}
                label={t("champions.modeCities")}
                onClick={() => setRankingMode("cities")}
              />
            </div>

            {/* Interactive SVG Bar Chart */}
            <div className="mt-6">
              <InteractiveBarChart
                rankingMode={rankingMode}
                entries={currentRanking.entries}
                labelSuffix={
                  rankingMode === "titles"
                    ? t("champions.titles")
                    : rankingMode === "finals"
                    ? t("champions.finalsLabel")
                    : t("champions.titles")
                }
              />
            </div>
          </div>

          {/* Right listing: borderless list bars */}
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-555">
                  {t("champions.trendEyebrow")}
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">{currentRanking.title}</h2>
              </div>
              <div className="rounded-full bg-[#F5F2EC] px-3.5 py-1 text-xs font-semibold text-slate-600 dark:bg-zinc-900 dark:text-zinc-400">
                {currentRanking.entries.length} {t("champions.entriesLabel")}
              </div>
            </div>

            <div className="space-y-4">
              {[...currentRanking.entries]
                .sort((a, b) => b[1] - a[1])
                .map(([label, count]) => (
                  <div key={`${rankingMode}-${label}`} className="group space-y-1.5">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-semibold text-slate-700 dark:text-zinc-300">
                        {label}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {count}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#F5F2EC] dark:bg-zinc-900/60">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${currentRanking.accent} transition-[width] duration-700 ease-out`}
                        style={{ width: `${(count / currentRanking.totalValue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Dynamic archive list timeline floating borderless */}
        {showTable && (
          <section className="space-y-8 animate-fade-in-up">
            <div className="border-b border-slate-200/60 dark:border-zinc-900/60 pb-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                {t("champions.archiveEyebrow")}
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
                {t("champions.timelineTitle")}
              </h2>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1 font-semibold">
                {t("champions.timelineDescription")}
              </p>
            </div>

            {/* Vertical Timeline Container */}
            <div className="relative pl-8 md:pl-10 space-y-6">
              {/* Timeline Line */}
              <div className="absolute left-3 md:left-3.5 top-2 bottom-2 w-0.5 timeline-gradient-line" />

              {filteredChampions
                .slice()
                .reverse()
                .map((item, index) => {
                  const champDetail = resolveTeamDetails(item.champion, item.idTeamChampion);
                  const runnerUpName = fixDisplayText(item.runner_up);
                  const runnerUpDetail = resolveTeamDetails(runnerUpName, null);

                  return (
                    <div
                      key={`${item.year}-${item.champion}-${index}`}
                      className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#F5F2EC]/45 dark:bg-zinc-900/10 border border-slate-200/40 dark:border-zinc-800/20 hover:bg-[#F5F2EC]/80 dark:hover:bg-zinc-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up glow-card"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      {/* Bullet Dot */}
                      <div className="absolute left-[-26px] md:left-[-27px] top-[26px] md:top-1/2 md:-translate-y-1/2 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white dark:border-[#07070A] shadow-sm ring-4 ring-amber-500/10" />

                      {/* Year & Edition */}
                      <div className="flex items-baseline gap-2.5 min-w-[110px]">
                        <span className="text-2xl font-black text-slate-900 dark:text-white font-heading">
                          {item.year}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-555">
                          {item.edition}
                        </span>
                      </div>

                      {/* Teams details */}
                      <div className="flex-1 grid gap-4 md:grid-cols-2 md:items-center">
                        {/* Champion */}
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5]/80 p-1.5 dark:bg-zinc-950/60 border border-slate-200/40 dark:border-zinc-800/60 shadow-inner">
                            {champDetail.logo ? (
                              <img
                                src={champDetail.logo}
                                alt={champDetail.name}
                                className="h-full w-full object-contain"
                                loading="lazy"
                              />
                            ) : (
                              <Trophy size={16} className="text-amber-500" />
                            )}
                          </div>
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 block">
                              Campeão
                            </span>
                            {champDetail.id ? (
                              <Link
                                to={`/team/${champDetail.id}`}
                                className="text-sm font-extrabold text-slate-900 hover:text-red-650 dark:text-white dark:hover:text-red-400 transition-colors"
                              >
                                {champDetail.name}
                              </Link>
                            ) : (
                              <span className="text-sm font-bold text-slate-800 dark:text-zinc-300">
                                {champDetail.name}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-450 dark:text-zinc-500 block font-medium">
                              {fixDisplayText(item.cityChampion)}
                            </span>
                          </div>
                        </div>

                        {/* Runner up */}
                        <div className="flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200/30 dark:border-zinc-800/40">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5]/80 p-1.5 dark:bg-zinc-950/60 border border-slate-200/40 dark:border-zinc-800/60 shadow-inner">
                            {runnerUpDetail.logo ? (
                              <img
                                src={runnerUpDetail.logo}
                                alt={runnerUpDetail.name}
                                className="h-full w-full object-contain"
                                loading="lazy"
                              />
                            ) : (
                              <div className="h-4 w-4 rounded-full bg-slate-200 dark:bg-zinc-800" />
                            )}
                          </div>
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-450 dark:text-zinc-500 block">
                              Vice-Campeão
                            </span>
                            {runnerUpDetail.id ? (
                              <Link
                                to={`/team/${runnerUpDetail.id}`}
                                className="text-sm font-extrabold text-slate-700 hover:text-red-650 dark:text-zinc-350 dark:hover:text-red-400 transition-colors"
                              >
                                {runnerUpDetail.name || "-"}
                              </Link>
                            ) : (
                              <span className="text-sm font-bold text-slate-655 dark:text-zinc-400">
                                {runnerUpDetail.name || "-"}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-450 dark:text-zinc-500 block font-medium">
                              {fixDisplayText(item.cityRunnerUp) || "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

function SpotlightLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-slate-400 dark:text-zinc-500">{label}</span>
      <span className="font-bold text-[#2C2927] dark:text-zinc-200">{value}</span>
    </div>
  );
}

function ModeButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
        active
          ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
          : "border border-slate-300 bg-[#FAF8F5]/40 text-slate-655 hover:bg-[#F5F2EC] dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400 dark:hover:bg-zinc-900"
      }`}
    >
      {label}
    </button>
  );
}

function InteractiveBarChart({
  rankingMode,
  entries,
  labelSuffix,
}: {
  rankingMode: RankingMode;
  entries: [string, number][];
  labelSuffix: string;
}) {
  const topFive = useMemo(() => {
    return [...entries].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [entries]);

  const maxVal = topFive.length > 0 ? topFive[0][1] : 1;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const colors = useMemo(() => {
    if (rankingMode === "finals") {
      return { stop1: "#2563eb", stop2: "#38bdf8" }; // blue to sky
    }
    if (rankingMode === "cities") {
      return { stop1: "#059669", stop2: "#10b981" }; // emerald to green
    }
    return { stop1: "#d97706", stop2: "#f59e0b" }; // amber / gold
  }, [rankingMode]);

  return (
    <div className="w-full rounded-2xl border border-slate-200/50 bg-[#F5F2EC]/30 p-5 shadow-sm dark:border-zinc-800/30 dark:bg-zinc-900/10">
      <svg viewBox="0 0 400 240" className="w-full overflow-visible">
        <defs>
          <linearGradient id="barSvgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.stop1} />
            <stop offset="100%" stopColor={colors.stop2} />
          </linearGradient>
        </defs>
        {topFive.map(([label, val], idx) => {
          const barWidth = maxVal > 0 ? (val / maxVal) * 280 : 0; // scale to max 280px
          const y = 15 + idx * 45;
          const isHovered = hoveredIdx === idx;

          return (
            <g
              key={label}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="cursor-pointer focus:outline-none"
            >
              {/* Rank Badge Indicator */}
              <circle
                cx="20"
                cy={y + 16}
                r="10"
                className={`fill-[#F5F2EC] dark:fill-zinc-800 transition-colors ${
                  isHovered ? "stroke-amber-500 stroke-2" : "stroke-transparent"
                }`}
              />
              <text
                x="20"
                y={y + 19}
                textAnchor="middle"
                className="text-[9px] font-heading font-black fill-slate-500 dark:fill-zinc-400"
              >
                {idx + 1}
              </text>

              {/* Title / Name Label */}
              <text
                x="40"
                y={y + 8}
                className={`text-[10px] font-bold transition-colors ${
                  isHovered ? "fill-slate-900 dark:fill-white font-extrabold" : "fill-slate-700 dark:fill-zinc-300"
                }`}
              >
                {label}
              </text>

              {/* Background Track Bar */}
              <rect
                x="40"
                y={y + 12}
                width="280"
                height="8"
                rx="4"
                className="fill-[#F5F2EC] dark:fill-zinc-800/60"
              />

              {/* Progress Bar (SVG) */}
              <rect
                x="40"
                y={y + 12}
                width={barWidth}
                height="8"
                rx="4"
                fill="url(#barSvgGradient)"
                className="transition-all duration-500 ease-out"
                style={{
                  transformOrigin: "40px 0px",
                  scale: isHovered ? "1 1.2" : "1 1",
                }}
              />

              {/* Numeric Value Label */}
              <text
                x={45 + barWidth}
                y={y + 19}
                className={`text-[9px] font-black transition-all ${
                  isHovered ? "fill-slate-950 dark:fill-white font-extrabold scale-110" : "fill-slate-500 dark:fill-zinc-450"
                }`}
              >
                {val}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Interactive detail card matching current selection */}
      <div className="mt-4 border-t border-slate-200/50 pt-3 dark:border-zinc-850">
        {hoveredIdx !== null ? (
          <div className="flex items-center justify-between text-xs font-bold text-slate-750 dark:text-zinc-350 animate-fade-in-up">
            <span>{topFive[hoveredIdx][0]}</span>
            <span className="text-amber-600 dark:text-amber-400 font-black">
              {topFive[hoveredIdx][1]} {labelSuffix}
            </span>
          </div>
        ) : (
          <p className="text-[10px] text-center text-slate-400 dark:text-zinc-500 font-semibold italic">
            Passe o mouse ou toque nas barras para ver detalhes adicionais
          </p>
        )}
      </div>
    </div>
  );
}
