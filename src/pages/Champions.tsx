import { useMemo, useState } from "react";
import { BarChart3, Crown, MapPinned, Sparkles, Table2, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getChampionStats } from "../lib/champions";
import { fixDisplayText } from "../utils/text";
import { useSEO } from "../hooks/useSEO";

type RankingMode = "titles" | "finals" | "cities";

export const Champions = () => {
  const { t } = useTranslation();
  const [showTable, setShowTable] = useState(false);
  const [rankingMode, setRankingMode] = useState<RankingMode>("titles");

  const { validChampions, titleCounts, cityTitleCounts, finalAppearances } = useMemo(
    () => getChampionStats(),
    []
  );

  // Dynamic Page-level SEO
  useSEO({
    title: t("champions.title"),
    description: t("champions.description"),
  });

  const latestChampion = validChampions[validChampions.length - 1];
  const topChampion = Object.entries(titleCounts).reduce((a, b) => (b[1] > a[1] ? b : a));
  const topCity = Object.entries(cityTitleCounts).reduce((a, b) => (b[1] > a[1] ? b : a));
  const mostFinals = Object.entries(finalAppearances).reduce((a, b) => (b[1] > a[1] ? b : a));

  const rankingConfig = {
    titles: {
      title: t("champions.titlesByTeam"),
      eyebrow: t("champions.rankingEyebrowTitles"),
      icon: Trophy,
      entries: Object.entries(titleCounts),
      accent: "from-amber-600 via-yellow-500 to-orange-500",
      maxValue: Math.max(...Object.values(titleCounts)),
    },
    finals: {
      title: t("champions.finalsByTeam"),
      eyebrow: t("champions.rankingEyebrowFinals"),
      icon: BarChart3,
      entries: Object.entries(finalAppearances),
      accent: "from-blue-600 via-sky-400 to-blue-500",
      maxValue: Math.max(...Object.values(finalAppearances)),
    },
    cities: {
      title: t("champions.cityDistribution"),
      eyebrow: t("champions.rankingEyebrowCities"),
      icon: MapPinned,
      entries: Object.entries(cityTitleCounts),
      accent: "from-emerald-600 via-teal-400 to-green-500",
      maxValue: Math.max(...Object.values(cityTitleCounts)),
    },
  } as const;

  const currentRanking = rankingConfig[rankingMode];
  const RankingIcon = currentRanking.icon;
  const topThree = [...currentRanking.entries].sort((a, b) => b[1] - a[1]).slice(0, 3);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,_rgba(251,191,36,0.05),_transparent_28%)] px-4 py-12 md:py-20 transition-theme">
      <div className="mx-auto w-full max-w-6xl space-y-16">
        
        {/* Floating Editorial Header Banner */}
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
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-550">{t("champions.biggestChampion")}</p>
                  <p className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white font-heading">{topChampion[0]}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">{topChampion[1]} {t("champions.titles")}</p>
                </div>
                <div className="pt-4 sm:pt-0 sm:pl-6">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-550">{t("champions.topCity")}</p>
                  <p className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white font-heading">{topCity[0]}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">{topCity[1]} {t("champions.titles")}</p>
                </div>
                <div className="pt-4 sm:pt-0 sm:pl-6">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-550">{t("champions.mostFinals")}</p>
                  <p className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white font-heading">{mostFinals[0]}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">{mostFinals[1]} {t("champions.finalsLabel")}</p>
                </div>
              </div>
            </div>

            {/* Spotlight directly floating on the canvas */}
            <div className="relative border-t lg:border-t-0 lg:border-l border-slate-200/60 dark:border-zinc-900/60 pt-8 lg:pt-0 lg:pl-12 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
                    <Crown size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-550">
                      {t("champions.latestChampion")}
                    </p>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading leading-tight">
                      {fixDisplayText(latestChampion.champion)}
                    </h2>
                  </div>
                </div>

                <div className="divide-y divide-slate-200/60 dark:divide-zinc-900/60 text-sm font-semibold">
                  <SpotlightLine label={t("champions.year")} value={latestChampion.year} />
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
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                <Table2 size={16} />
                {showTable ? t("champions.hideTable") : t("champions.showTable")}
              </button>
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

            {/* Podium elements directly floating */}
            <div className="mt-8 space-y-6">
              {topThree.map(([label, value], index) => (
                <PodiumCard
                  key={`${rankingMode}-${label}`}
                  place={index + 1}
                  label={label}
                  value={value}
                  maxValue={currentRanking.maxValue}
                  accent={currentRanking.accent}
                />
              ))}
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
                        style={{ width: `${(count / currentRanking.maxValue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Dynamic archive list table floating borderless */}
        {showTable && (
          <section className="space-y-6">
            <div className="border-b border-slate-200/60 dark:border-zinc-900/60 pb-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-550">
                {t("champions.archiveEyebrow")}
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">{t("champions.archiveTitle")}</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-200/60 dark:border-zinc-900/60 text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="px-4 py-3">{t("champions.year")}</th>
                    <th className="px-4 py-3">{t("champions.champion")}</th>
                    <th className="px-4 py-3">{t("champions.runnerUp")}</th>
                    <th className="px-4 py-3">{t("champions.city")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/50 dark:divide-zinc-900/60">
                  {[...validChampions]
                    .slice()
                    .reverse()
                    .map((item, index) => (
                      <tr
                        key={`${item.year}-${item.champion}`}
                        className={`transition-colors hover:bg-[#F5F2EC]/30 dark:hover:bg-zinc-900/20 ${
                          index === 0 ? "bg-amber-500/[0.03]" : ""
                        }`}
                      >
                        <td className="px-4 py-4.5 font-extrabold text-slate-950 dark:text-white">{item.year}</td>
                        <td className="px-4 py-4.5 font-semibold text-amber-600 dark:text-amber-400">
                          {fixDisplayText(item.champion)}
                        </td>
                        <td className="px-4 py-4.5 text-slate-500 dark:text-zinc-400 font-semibold">
                          {fixDisplayText(item.runner_up) || "-"}
                        </td>
                        <td className="px-4 py-4.5 text-slate-500 dark:text-zinc-400 font-semibold">
                          {fixDisplayText(item.cityChampion)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
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

function PodiumCard({
  place,
  label,
  value,
  maxValue,
  accent,
}: {
  place: number;
  label: string;
  value: number;
  maxValue: number;
  accent: string;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`rounded-xl bg-gradient-to-br ${accent} p-[1px]`}>
            <div className="rounded-xl bg-white px-2.5 py-1 text-xs font-black text-slate-900 dark:bg-[#0c0c10] dark:text-white font-heading">
              #{place}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 leading-none">{label}</p>
            <p className="text-xs text-slate-400 dark:text-zinc-550 mt-1 font-semibold">{value}</p>
          </div>
        </div>
        <div className="text-right text-xs font-extrabold text-slate-400 dark:text-zinc-500">
          {Math.round((value / maxValue) * 100)}%
        </div>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#F5F2EC] dark:bg-zinc-900/60">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${accent}`}
          style={{ width: `${(value / maxValue) * 100}%` }}
        />
      </div>
    </div>
  );
}
