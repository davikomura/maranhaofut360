import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  MapPinned,
  Shield,
  Star,
  TimerReset,
  Trophy,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { getChampionStats } from "../lib/champions";
import { leagueSeasons, teamDetails } from "../lib/footballData";
import { fixDisplayText } from "../utils/text";
import { useSEO } from "../hooks/useSEO";
import { useJSONLD } from "../hooks/useJSONLD";

const quickLinks = [
  {
    to: "/serie-a",
    icon: Shield,
    textColor: "text-red-600 dark:text-red-400",
    hoverBg: "hover:bg-red-500/10 dark:hover:bg-red-950/15 border-red-500/20",
    indicatorLine: "bg-red-600 dark:bg-red-500",
    titleKey: "homePage.span1",
    descriptionKey: "homePage.p2",
  },
  {
    to: "/serie-b",
    icon: Star,
    textColor: "text-blue-600 dark:text-blue-400",
    hoverBg: "hover:bg-blue-500/10 dark:hover:bg-blue-950/15 border-blue-500/20",
    indicatorLine: "bg-blue-600 dark:bg-blue-500",
    titleKey: "homePage.span2",
    descriptionKey: "homePage.p3",
  },
  {
    to: "/campeoes",
    icon: Trophy,
    textColor: "text-amber-600 dark:text-amber-400",
    hoverBg: "hover:bg-amber-500/10 dark:hover:bg-amber-950/15 border-amber-500/20",
    indicatorLine: "bg-amber-600 dark:bg-amber-500",
    titleKey: "homePage.span3",
    descriptionKey: "homePage.p4",
  },
];

const updateCards = [
  {
    to: "/serie-a",
    titleKey: "homePage.updateSerieA",
    descriptionKey: "homePage.updateSerieADescription",
    accentColor: "group-hover:text-red-650 dark:group-hover:text-red-400",
    dotColor: "bg-red-500",
  },
  {
    to: "/serie-b",
    titleKey: "homePage.updateSerieB",
    descriptionKey: "homePage.updateSerieBDescription",
    accentColor: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
    dotColor: "bg-blue-500",
  },
  {
    to: "/campeoes",
    titleKey: "homePage.updateChampions",
    descriptionKey: "homePage.updateChampionsDescription",
    accentColor: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
    dotColor: "bg-amber-500",
  },
];

export default function HomePage() {
  const { t } = useTranslation();
  const { validChampions, titleCounts } = getChampionStats();
  const latestChampion = validChampions[validChampions.length - 1];

  // Dynamic Page SEO
  useSEO({
    title: t("homePage.h1"),
    description: t("homePage.p1"),
  });

  // Structured Data (JSON-LD) for Search Engines
  useJSONLD({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FutMA 360",
    "url": typeof window !== "undefined" ? window.location.origin : "https://maranhaofut360.vercel.app",
    "description": t("homePage.p1"),
  });

  const featuredTeams = [...teamDetails]
    .map((team) => ({
      ...team,
      titleCount: titleCounts[fixDisplayText(team.name)] ?? 0,
    }))
    .sort(
      (a, b) =>
        b.titleCount - a.titleCount ||
        fixDisplayText(a.name).localeCompare(fixDisplayText(b.name))
    )
    .slice(0, 4);

  const trackedSeasons = Object.keys(leagueSeasons).length;
  const topCities = Object.entries(
    teamDetails.reduce<Record<string, number>>((accumulator, team) => {
      const city = fixDisplayText(team.city);
      if (!city) {
        return accumulator;
      }

      accumulator[city] = (accumulator[city] ?? 0) + 1;
      return accumulator;
    }, {})
  )
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-stadium-dots bg-mesh-gradient-rich transition-theme animate-fade-in-up">
      <main className="mx-auto w-full max-w-6xl space-y-16 px-4 py-12 md:px-8 md:py-20">
        
        {/* Aggressive Cardless Hero: Floats directly on the cozy linen background */}
        <section className="relative py-4 md:py-8">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_0.9fr] lg:items-start">
            <div className="space-y-6">
              {/* Premium Metallic Gradient Line Decorator */}
              <div className="h-[4px] w-20 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded-full" />
              
              <span className="inline-flex rounded-full bg-red-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-red-655 dark:bg-red-500/15 dark:text-red-400">
                FutMA 360
              </span>
              
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl dark:text-white leading-[1.08] font-heading">
                {t("homePage.h1")}
              </h1>
              
              <p className="max-w-xl text-base leading-relaxed text-slate-600 dark:text-zinc-400 md:text-lg">
                {t("homePage.p1")}
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/teams"
                  viewTransition
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-650 via-rose-550 to-amber-550 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:shadow-red-500/15 transition-transform hover:-translate-y-0.5"
                >
                  {t("homePage.primaryCta")}
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/campeoes"
                  viewTransition
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-[#FAF8F5]/60 px-6 py-3.5 text-sm font-semibold text-[#2C2927] transition hover:bg-[#F5F2EC] dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-200 dark:hover:bg-zinc-900"
                >
                  {t("homePage.secondaryCta")}
                </Link>
              </div>
            </div>

            {/* Typography Stats Stack (Ditched cards, clean vertical row list) */}
            <div className="divide-y divide-slate-200/60 dark:divide-zinc-900/60 lg:border-l lg:border-slate-200/50 dark:lg:border-zinc-900/60 lg:pl-12">
              <HeroStat
                label={t("homePage.statLatestChampion")}
                value={fixDisplayText(latestChampion.champion)}
                detail={latestChampion.year}
                accent="text-amber-600 dark:text-amber-400"
              />
              <HeroStat
                label={t("homePage.statClubCount")}
                value={String(teamDetails.length)}
                detail={t("nav.teams")}
                accent="text-red-650 dark:text-red-400"
              />
              <HeroStat
                label={t("homePage.statTrackedSeasons")}
                value={String(trackedSeasons)}
                detail="Serie A e Serie B"
                accent="text-blue-600 dark:text-blue-400"
              />
            </div>
          </div>
        </section>

        {/* Aggressive Cardless Quick Links: Classic Newspaper Columns Divider with Colorful Hover effects */}
        <section className="border-t border-b border-slate-200/60 dark:border-zinc-900/60 py-10">
          <div className="grid gap-8 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200/60 dark:divide-zinc-900/60">
            {quickLinks.map((item, index) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  viewTransition
                  className={`group relative flex flex-col justify-between transition-all duration-300 rounded-2xl p-6 border border-transparent ${item.hoverBg} first:pt-0 pt-8 md:pt-6 ${index > 0 ? "md:ml-2" : ""}`}
                >
                  {/* Decorative Active Indicator Line at the top of hovered link */}
                  <div className={`absolute top-0 left-6 h-[3px] w-12 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ${item.indicatorLine}`} />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${item.textColor}`}>
                        {t(item.titleKey)}
                      </span>
                      <Icon size={20} className={`${item.textColor} transition-transform group-hover:scale-110`} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-red-600 dark:text-white dark:group-hover:text-red-400 font-heading">
                        {t(item.titleKey)}
                      </h3>
                      <p className="text-xs leading-relaxed text-slate-500 dark:text-zinc-400 font-semibold">
                        {t(item.descriptionKey)}
                      </p>
                    </div>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-zinc-200 group-hover:text-red-650 dark:group-hover:text-red-400">
                    {t("footer.explore")}
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Cardless Editorial Listings Dashboard */}
        <section className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          
          {/* Featured Clubs floating rows */}
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">{t("homePage.featuredTitle")}</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">{t("homePage.featuredDescription")}</p>
            </div>

            <div className="divide-y divide-slate-200/60 dark:divide-zinc-900/60">
              {featuredTeams.map((team) => (
                <Link
                  key={team.id}
                  to={`/team/${team.id}`}
                  className="group flex items-center justify-between py-4.5 transition-colors hover:bg-[#F5F2EC]/60 dark:hover:bg-zinc-900/10"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Minimal Borderless Crest container with colored hover ring */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F5F2EC]/80 p-1.5 dark:bg-zinc-900/60 transition-all group-hover:scale-105 border border-slate-200/30 group-hover:border-red-500/20">
                      <img
                        src={team.image}
                        alt={fixDisplayText(team.name)}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-base font-bold text-slate-900 group-hover:text-red-650 dark:text-white dark:group-hover:text-red-400">
                          {fixDisplayText(team.name)}
                        </h3>
                        {team.stateDivision && (
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                            team.stateDivision === "A" 
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400" 
                              : "bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400"
                          }`}>
                            Série {team.stateDivision}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 dark:text-zinc-550 font-semibold mt-0.5">{fixDisplayText(team.city)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      {team.titleCount > 0
                        ? t("homePage.featuredTitles", { count: team.titleCount })
                        : t("homePage.featuredNoTitles")}
                    </span>
                    <ArrowRight size={14} className="text-slate-400 transition-transform group-hover:translate-x-1 dark:text-zinc-650" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-12">
            
            {/* Top Cities section (Floating, divide separators) */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 animate-pulse">
                  <MapPinned size={18} />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">{t("homePage.citiesTitle")}</h2>
                  <p className="text-xs text-slate-400 dark:text-zinc-550 font-semibold">{t("homePage.citiesDescription")}</p>
                </div>
              </div>

              <div className="divide-y divide-slate-200/60 dark:divide-zinc-900/60 pt-2">
                {topCities.map(([city, count]) => (
                  <Link
                    key={city}
                    to="/teams"
                    className="flex items-center justify-between py-3 transition-colors hover:text-red-650 dark:hover:text-red-400 text-slate-700 dark:text-zinc-400 font-bold text-sm"
                  >
                    <span>{city}</span>
                    <span className="rounded-full bg-[#F5F2EC] border border-slate-200/40 px-3 py-1 text-xs font-bold text-slate-650 dark:bg-zinc-900 dark:text-zinc-400">
                      {t("homePage.cityTeams", { count })}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Updates list (Floating, divide separators) */}
            <div className="space-y-4 pt-4 border-t border-slate-200/60 dark:border-zinc-900/60">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-sky-500/10 p-2.5 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400">
                  <Building2 size={18} />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">{t("homePage.updatesTitle")}</h2>
                  <p className="text-xs text-slate-400 dark:text-zinc-550 font-semibold">{t("homePage.updatesDescription")}</p>
                </div>
              </div>

              <div className="divide-y divide-slate-200/60 dark:divide-zinc-900/60 pt-2">
                {updateCards.map((card) => (
                  <Link
                    key={card.to}
                    to={card.to}
                    className="group flex items-start justify-between py-3.5 transition-colors hover:bg-[#F5F2EC]/40 dark:hover:bg-zinc-900/10"
                  >
                    <div className="space-y-1.5 min-w-0 pr-4">
                      <div className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${card.dotColor}`} />
                        <h3 className={`text-sm font-bold text-slate-800 dark:text-zinc-200 transition-colors ${card.accentColor}`}>{t(card.titleKey)}</h3>
                      </div>
                      <p className="truncate text-xs text-slate-400 dark:text-zinc-500 font-semibold pl-3.5">
                        {t(card.descriptionKey)}
                      </p>
                    </div>
                    <TimerReset size={14} className="mt-1 shrink-0 text-slate-400 dark:text-zinc-600 transition-transform group-hover:rotate-12" />
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}

function HeroStat({
  label,
  value,
  detail,
  accent,
}: {
  label: string;
  value: string;
  detail: string;
  accent: string;
}) {
  return (
    <div className="py-5 first:pt-0 last:pb-0">
      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-550">{label}</p>
      <p className={`mt-1.5 text-2xl font-black tracking-tight leading-none font-heading ${accent}`}>{value}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 font-bold">{detail}</p>
    </div>
  );
}
