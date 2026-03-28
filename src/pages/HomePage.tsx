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

const quickLinks = [
  {
    to: "/serie-a",
    icon: Shield,
    accent: "border-red-600/60 bg-red-500/10 text-red-300",
    titleKey: "homePage.span1",
    descriptionKey: "homePage.p2",
  },
  {
    to: "/serie-b",
    icon: Star,
    accent: "border-sky-600/60 bg-sky-500/10 text-sky-300",
    titleKey: "homePage.span2",
    descriptionKey: "homePage.p3",
  },
  {
    to: "/campeoes",
    icon: Trophy,
    accent: "border-yellow-500/60 bg-yellow-500/10 text-yellow-200",
    titleKey: "homePage.span3",
    descriptionKey: "homePage.p4",
  },
];

const updateCards = [
  {
    to: "/serie-a",
    titleKey: "homePage.updateSerieA",
    descriptionKey: "homePage.updateSerieADescription",
  },
  {
    to: "/serie-b",
    titleKey: "homePage.updateSerieB",
    descriptionKey: "homePage.updateSerieBDescription",
  },
  {
    to: "/campeoes",
    titleKey: "homePage.updateChampions",
    descriptionKey: "homePage.updateChampionsDescription",
  },
];

export default function HomePage() {
  const { t } = useTranslation();
  const { validChampions, titleCounts } = getChampionStats();
  const latestChampion = validChampions[validChampions.length - 1];

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(220,38,38,0.16),_transparent_22%),linear-gradient(180deg,_#050505_0%,_#0f1117_50%,_#050505_100%)] text-white">
      <main className="mx-auto w-full max-w-6xl space-y-12 px-4 py-10 md:px-6 md:py-14">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(122,13,13,0.88),rgba(15,23,42,0.95)_46%,rgba(5,5,5,1)_100%)] px-6 py-8 shadow-[0_25px_80px_rgba(0,0,0,0.45)] md:px-10 md:py-12">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-gray-200">
                FutMA 360
              </p>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white md:text-6xl">
                {t("homePage.h1")}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-gray-200 md:text-lg">
                {t("homePage.p1")}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/teams"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
                >
                  {t("homePage.primaryCta")}
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/campeoes"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/12"
                >
                  {t("homePage.secondaryCta")}
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <HeroStat
                label={t("homePage.statLatestChampion")}
                value={fixDisplayText(latestChampion.champion)}
                detail={latestChampion.year}
              />
              <HeroStat
                label={t("homePage.statClubCount")}
                value={String(teamDetails.length)}
                detail={t("nav.teams")}
              />
              <HeroStat
                label={t("homePage.statTrackedSeasons")}
                value={String(trackedSeasons)}
                detail="Serie A e Serie B"
              />
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {quickLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group rounded-[1.75rem] border p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${item.accent}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{t(item.titleKey)}</h2>
                    <p className="mt-3 text-sm leading-6 text-gray-200">{t(item.descriptionKey)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                    <Icon size={22} />
                  </div>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/90">
                  {t("footer.explore")}
                  <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.75rem] border border-white/8 bg-gray-950/85 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">{t("homePage.featuredTitle")}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-400">{t("homePage.featuredDescription")}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {featuredTeams.map((team) => (
                <Link
                  key={team.id}
                  to={`/team/${team.id}`}
                  className="group rounded-[1.5rem] border border-white/8 bg-black/25 p-4 transition hover:border-white/15 hover:bg-black/35"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-800 bg-white/5 p-2">
                      <img
                        src={team.image}
                        alt={fixDisplayText(team.name)}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold text-white">
                        {fixDisplayText(team.name)}
                      </h3>
                      <p className="mt-1 text-sm text-gray-400">{fixDisplayText(team.city)}</p>
                      <p className="mt-2 text-sm text-yellow-300">
                        {team.titleCount > 0
                          ? t("homePage.featuredTitles", { count: team.titleCount })
                          : t("homePage.featuredNoTitles")}
                      </p>
                    </div>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-200">
                    {t("homePage.featuredAction")}
                    <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-white/8 bg-gray-950/85 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-emerald-500/12 p-3 text-emerald-300">
                  <MapPinned size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{t("homePage.citiesTitle")}</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-400">{t("homePage.citiesDescription")}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {topCities.map(([city, count]) => (
                  <Link
                    key={city}
                    to="/teams"
                    className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/25 px-4 py-3 transition hover:border-white/15 hover:bg-black/35"
                  >
                    <span className="font-medium text-white">{city}</span>
                    <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-gray-300">
                      {t("homePage.cityTeams", { count })}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/8 bg-gray-950/85 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-sky-500/12 p-3 text-sky-300">
                  <Building2 size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{t("homePage.updatesTitle")}</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-400">{t("homePage.updatesDescription")}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {updateCards.map((card) => (
                  <Link
                    key={card.to}
                    to={card.to}
                    className="block rounded-2xl border border-white/8 bg-black/25 p-4 transition hover:border-white/15 hover:bg-black/35"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-white">{t(card.titleKey)}</h3>
                        <p className="mt-2 text-sm leading-6 text-gray-400">
                          {t(card.descriptionKey)}
                        </p>
                      </div>
                      <TimerReset size={18} className="mt-1 text-gray-500" />
                    </div>
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
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5 backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">{label}</p>
      <p className="mt-3 text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-sm text-gray-300">{detail}</p>
    </div>
  );
}
