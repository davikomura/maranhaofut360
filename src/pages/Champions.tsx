import { useMemo, useState } from "react";
import { BarChart3, Crown, MapPinned, Sparkles, Table2, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getChampionStats } from "../lib/champions";
import { fixDisplayText } from "../utils/text";

type RankingMode = "titles" | "finals" | "cities";

export const Champions = () => {
  const { t } = useTranslation();
  const [showTable, setShowTable] = useState(false);
  const [rankingMode, setRankingMode] = useState<RankingMode>("titles");

  const { validChampions, titleCounts, cityTitleCounts, finalAppearances } = useMemo(
    () => getChampionStats(),
    []
  );

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
      accent: "from-yellow-400 via-amber-300 to-orange-400",
      glow: "shadow-yellow-500/20",
      maxValue: Math.max(...Object.values(titleCounts)),
    },
    finals: {
      title: t("champions.finalsByTeam"),
      eyebrow: t("champions.rankingEyebrowFinals"),
      icon: BarChart3,
      entries: Object.entries(finalAppearances),
      accent: "from-sky-400 via-cyan-300 to-blue-500",
      glow: "shadow-sky-500/20",
      maxValue: Math.max(...Object.values(finalAppearances)),
    },
    cities: {
      title: t("champions.cityDistribution"),
      eyebrow: t("champions.rankingEyebrowCities"),
      icon: MapPinned,
      entries: Object.entries(cityTitleCounts),
      accent: "from-emerald-400 via-lime-300 to-green-500",
      glow: "shadow-emerald-500/20",
      maxValue: Math.max(...Object.values(cityTitleCounts)),
    },
  } as const;

  const currentRanking = rankingConfig[rankingMode];
  const RankingIcon = currentRanking.icon;
  const topThree = [...currentRanking.entries].sort((a, b) => b[1] - a[1]).slice(0, 3);

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.14),_transparent_24%),linear-gradient(180deg,_#060606_0%,_#0f1117_52%,_#050505_100%)] px-4 py-10 text-white">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(120,18,18,0.92),rgba(9,9,11,0.95)_48%,rgba(21,101,192,0.75))] px-6 py-10 shadow-[0_30px_80px_rgba(0,0,0,0.45)] md:px-10 md:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(250,204,21,0.16),_transparent_25%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-yellow-200">
                <Sparkles size={14} />
                {t("champions.heroEyebrow")}
              </div>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white md:text-6xl">
                {t("champions.title")}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-200 md:text-base">
                {t("champions.description")}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <HeroStat
                  label={t("champions.biggestChampion")}
                  value={topChampion[0]}
                  detail={`${topChampion[1]} ${t("champions.titles")}`}
                />
                <HeroStat
                  label={t("champions.topCity")}
                  value={topCity[0]}
                  detail={`${topCity[1]} ${t("champions.titles")}`}
                />
                <HeroStat
                  label={t("champions.mostFinals")}
                  value={mostFinals[0]}
                  detail={`${mostFinals[1]} ${t("champions.finalsLabel")}`}
                />
              </div>
            </div>

            <div className="relative rounded-[1.75rem] border border-white/10 bg-black/30 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-yellow-400/15 p-3 text-yellow-300">
                  <Crown size={28} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                    {t("champions.latestChampion")}
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-white">
                    {fixDisplayText(latestChampion.champion)}
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
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

              <button
                onClick={() => setShowTable((current) => !current)}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <Table2 size={16} />
                {showTable ? t("champions.hideTable") : t("champions.showTable")}
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.25fr]">
          <div className="rounded-[1.75rem] border border-white/8 bg-gray-950/85 p-6 shadow-[0_25px_50px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
                  {t("champions.rankingEyebrow")}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">{currentRanking.title}</h2>
                <p className="mt-2 text-sm text-gray-400">{currentRanking.eyebrow}</p>
              </div>
              <div className={`rounded-2xl bg-gradient-to-br ${currentRanking.accent} p-[1px]`}>
                <div className="rounded-2xl bg-black/80 p-3 text-white">
                  <RankingIcon size={22} />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
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

            <div className="mt-6 space-y-4">
              {topThree.map(([label, value], index) => (
                <PodiumCard
                  key={`${rankingMode}-${label}`}
                  place={index + 1}
                  label={label}
                  value={value}
                  maxValue={currentRanking.maxValue}
                  accent={currentRanking.accent}
                  glow={currentRanking.glow}
                />
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/8 bg-gray-950/85 p-6 shadow-[0_25px_50px_rgba(0,0,0,0.35)]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
                  {t("champions.trendEyebrow")}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">{currentRanking.title}</h2>
              </div>
              <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-gray-400">
                {currentRanking.entries.length} {t("champions.entriesLabel")}
              </div>
            </div>

            <div className="space-y-4">
              {[...currentRanking.entries]
                .sort((a, b) => b[1] - a[1])
                .map(([label, count]) => (
                  <div key={`${rankingMode}-${label}`} className="group">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="truncate text-sm font-medium text-gray-100 transition group-hover:text-white">
                        {label}
                      </span>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-gray-200">
                        {count}
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white/6">
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

        {showTable && (
          <section className="overflow-hidden rounded-[1.75rem] border border-white/8 bg-gray-950/90 shadow-[0_25px_50px_rgba(0,0,0,0.35)]">
            <div className="border-b border-white/8 px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
                {t("champions.archiveEyebrow")}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">{t("champions.archiveTitle")}</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm sm:text-base">
                <thead>
                  <tr className="bg-white/[0.04] text-gray-300">
                    <th className="px-6 py-4 text-left">{t("champions.year")}</th>
                    <th className="px-6 py-4 text-left">{t("champions.champion")}</th>
                    <th className="px-6 py-4 text-left">{t("champions.runnerUp")}</th>
                    <th className="px-6 py-4 text-left">{t("champions.city")}</th>
                  </tr>
                </thead>
                <tbody>
                  {[...validChampions]
                    .slice()
                    .reverse()
                    .map((item, index) => (
                      <tr
                        key={`${item.year}-${item.champion}`}
                        className={`border-t border-white/6 transition hover:bg-white/[0.03] ${
                          index === 0 ? "bg-yellow-500/[0.06]" : ""
                        }`}
                      >
                        <td className="px-6 py-4 font-semibold text-gray-100">{item.year}</td>
                        <td className="px-6 py-4 font-semibold text-yellow-300">
                          {fixDisplayText(item.champion)}
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {fixDisplayText(item.runner_up) || "-"}
                        </td>
                        <td className="px-6 py-4 text-gray-300">
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

function HeroStat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">{label}</p>
      <p className="mt-3 text-xl font-black text-white">{value}</p>
      <p className="mt-1 text-sm text-gray-300">{detail}</p>
    </div>
  );
}

function SpotlightLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-right text-sm font-semibold text-white">{value}</span>
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
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-white text-black shadow-lg"
          : "border border-white/10 bg-white/5 text-gray-200 hover:bg-white/10"
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
  glow,
}: {
  place: number;
  label: string;
  value: number;
  maxValue: number;
  accent: string;
  glow: string;
}) {
  return (
    <div className={`rounded-[1.5rem] border border-white/8 bg-black/35 p-4 shadow-2xl ${glow}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`rounded-2xl bg-gradient-to-br ${accent} p-[1px]`}>
            <div className="rounded-2xl bg-black/80 px-3 py-2 text-sm font-black text-white">
              #{place}
            </div>
          </div>
          <div>
            <p className="text-lg font-bold text-white">{label}</p>
            <p className="text-sm text-gray-400">{value}</p>
          </div>
        </div>
        <div className="min-w-24 text-right text-xs text-gray-400">
          {Math.round((value / maxValue) * 100)}%
        </div>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/6">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${accent}`}
          style={{ width: `${(value / maxValue) * 100}%` }}
        />
      </div>
    </div>
  );
}
