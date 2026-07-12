import { Calendar, Globe, MapPin, Trophy } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { BackButton } from "../components/ui/BackButton";
import { EmptyState } from "../components/ui/EmptyState";
import { getChampionsByTeamId, getSocialLinksByTeamId, getTeamDetailsById, getTeamHistoryById } from "../lib/footballData";
import type { SocialLinks } from "../types/football";
import { fixDisplayText } from "../utils/text";
import { useSEO } from "../hooks/useSEO";
import { getTeamColors } from "../utils/teamColors";
import { useJSONLD } from "../hooks/useJSONLD";

export default function TeamDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const teamId = Number(id);

  const fixedData = getTeamDetailsById(teamId);
  const translatedInfo = getTeamHistoryById(teamId, i18n.language);
  const socialLinks = getSocialLinksByTeamId(teamId);
  const colors = getTeamColors(teamId);

  // Strong dynamic page SEO
  const teamName = fixedData ? fixDisplayText(fixedData.name) : "";
  const teamCity = fixedData ? fixDisplayText(fixedData.city) : "";
  const seoTitle = teamName
    ? `${teamName} - ${t("nav.teams")}, ${t("teamDetail.curiosities")} e Estatísticas`
    : t("teamDetail.h1");
  const seoDescription = teamName
    ? `${teamName} de ${teamCity}. ${translatedInfo?.history?.slice(0, 150)}...`
    : t("teamDetail.notFoundDescription");

  useSEO({
    title: seoTitle,
    description: seoDescription,
  });

  // Dynamic JSON-LD structured data for sports clubs
  useJSONLD(
    fixedData
      ? {
          "@context": "https://schema.org",
          "@type": "SportsTeam",
          "name": teamName,
          "sport": "Association Football",
          "logo": typeof window !== "undefined" ? `${window.location.origin}${fixedData.image}` : fixedData.image,
          "foundingDate": fixedData.foundationDate || undefined,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": teamCity,
            "addressRegion": "MA",
            "addressCountry": "BR",
          },
          "sameAs": socialLinks
            ? [
                socialLinks.instagram,
                socialLinks.twitter,
                socialLinks.tiktok,
                socialLinks.facebook,
                socialLinks.youtube,
                socialLinks.website,
              ].filter(Boolean)
            : [],
        }
      : null
  );

  if (!fixedData || !translatedInfo) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] px-4 py-12 dark:bg-[#060608] text-slate-800 dark:text-white transition-theme">
        <div className="mx-auto max-w-3xl space-y-6">
          <BackButton />
          <EmptyState
            title={t("teamDetail.h1")}
            description={t("teamDetail.notFoundDescription")}
          />
        </div>
      </div>
    );
  }

  const foundedYear = fixedData.foundationDate
    ? new Date(fixedData.foundationDate).getFullYear()
    : t("teamDetail.unknown");

  const maranhenseTitles = getChampionsByTeamId(teamId);
  const firstTitleYear =
    maranhenseTitles.length > 0
      ? Math.min(...maranhenseTitles.map((champion) => Number(champion.year)))
      : null;
  const lastTitleYear =
    maranhenseTitles.length > 0
      ? Math.max(...maranhenseTitles.map((champion) => Number(champion.year)))
      : null;

  const getDivisionBadge = (label: string, division: string | null | undefined) => {
    const colors: Record<string, string> = {
      A: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/10",
      B: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/10",
      C: "text-orange-655 dark:text-orange-400 bg-orange-500/10 border-orange-500/10",
      D: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/10",
    };

    const parsedDivision = division
      ? colors[division] ?? "text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-900"
      : "text-slate-400 dark:text-zinc-550 bg-slate-100/50 dark:bg-zinc-900/40";

    return (
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${parsedDivision}`}>
        {label}: {division ? `${t("teamDetail.series")} ${division}` : t("teamDetail.noDivision")}
      </span>
    );
  };

  return (
    <div 
      style={{
        backgroundImage: `radial-gradient(circle at 50% 0%, ${colors.glow}, transparent 35%)`
      }}
      className="min-h-screen px-4 py-12 md:py-20 transition-theme animate-fade-in-up"
    >
      <div className="mx-auto max-w-5xl space-y-10">
        
        <div className="flex items-center">
          <BackButton />
        </div>

        {/* Aggressive Cardless Profile Grid */}
        <div className="grid gap-12 md:grid-cols-[280px_1fr] md:items-start">
          
          {/* Sidebar */}
          <div className="flex flex-col items-center md:items-start space-y-8">
            
            {/* Crest floats directly on canvas */}
            <div 
              style={{
                boxShadow: `0 10px 25px -5px ${colors.glow}`,
                border: `2px solid ${colors.primary}33`
              }}
              className="flex h-48 w-48 shrink-0 items-center justify-center rounded-full bg-[#F5F2EC]/80 dark:bg-zinc-900/60 p-4 transition-transform duration-500 hover:scale-105"
            >
              <img
                src={fixedData.image}
                alt={`Escudo do ${fixDisplayText(fixedData.name)}`}
                className="max-h-40 object-contain drop-shadow-md"
              />
            </div>

            {/* Quick stats details list (Flat list separated by delicate dividers) */}
            <div className="w-full divide-y divide-slate-200/60 dark:divide-zinc-900/60 border-t border-b border-slate-200/60 dark:border-zinc-900/60 py-2">
              {maranhenseTitles.length > 0 && (
                <>
                  <div className="py-3 flex justify-between items-center text-sm">
                    <span className="text-slate-400 dark:text-zinc-550 font-semibold">{t("teamDetail.firstTitle")}</span>
                    <span className="font-extrabold text-amber-600 dark:text-amber-400">{firstTitleYear}</span>
                  </div>
                  <div className="py-3 flex justify-between items-center text-sm">
                    <span className="text-slate-400 dark:text-zinc-550 font-semibold">{t("teamDetail.lastTitle")}</span>
                    <span className="font-extrabold text-amber-600 dark:text-amber-400">{lastTitleYear}</span>
                  </div>
                </>
              )}
              <div className="py-3 flex justify-between items-center text-sm">
                <span className="text-slate-400 dark:text-zinc-550 font-semibold">{t("teamDetail.founded")}</span>
                <span className="font-extrabold text-[#2C2927] dark:text-zinc-200">{foundedYear}</span>
              </div>
            </div>

          </div>

          {/* Main narrative block */}
          <div className="space-y-8">
            
            <div className="space-y-4">
              {/* Dynamic Line Decorator */}
              <div 
                style={{
                  background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary || colors.primary})`
                }}
                className="h-[4px] w-24 rounded-full" 
              />
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-5xl font-heading leading-tight">
                {fixDisplayText(fixedData.name)}
              </h1>

              <div className="flex flex-wrap items-center gap-2">
                {fixedData.city && (
                  <span className="flex items-center gap-1.5 rounded-full bg-[#F5F2EC] px-3.5 py-1 text-xs font-semibold text-slate-600 dark:bg-zinc-900 dark:text-zinc-400">
                    <MapPin size={12} /> {fixDisplayText(fixedData.city)}
                  </span>
                )}
                <span className="flex items-center gap-1.5 rounded-full bg-[#F5F2EC] px-3.5 py-1 text-xs font-semibold text-slate-600 dark:bg-zinc-900 dark:text-zinc-400">
                  <Calendar size={12} /> {foundedYear}
                </span>
                {getDivisionBadge(t("teamDetail.divisionState"), fixedData.stateDivision)}
                {getDivisionBadge(t("teamDetail.divisionNational"), fixedData.stateNational)}
              </div>
            </div>

            {/* Typography narrative */}
            <div className="relative">
              <p 
                style={{ borderColor: colors.primary }}
                className="border-l-4 pl-5 text-base leading-relaxed text-slate-600 dark:text-zinc-300 md:text-lg md:leading-loose"
              >
                {fixDisplayText(translatedInfo.history)}
              </p>
            </div>

            {/* Accomplishments floating label */}
            <div className="pt-2 space-y-4">
              {maranhenseTitles.length > 0 ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                  <Trophy size={14} className="shrink-0" />
                  <span>
                    {maranhenseTitles.length}{" "}
                    {maranhenseTitles.length > 1
                      ? t("teamDetail.titlesCount_plural")
                      : t("teamDetail.titlesCount")}
                  </span>
                </div>
              ) : (
                <div className="text-slate-400 dark:text-zinc-500 text-xs font-semibold">
                  {t("teamDetail.noTitlesDescription")}
                </div>
              )}
            </div>

            {/* Curiosities: Elegant list floating directly */}
            <div className="pt-4 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
                {t("teamDetail.curiosities")}
              </h2>
              
              {(translatedInfo.curiosities ?? []).length > 0 ? (
                <ul className="space-y-4">
                  {(translatedInfo.curiosities ?? []).map((fact, index) => (
                    <li
                      key={index}
                      className="relative pl-5 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-slate-400 dark:before:bg-zinc-600 text-sm leading-relaxed text-slate-600 dark:text-zinc-400 font-medium"
                    >
                      {fixDisplayText(fact)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400 dark:text-zinc-500 italic">
                  {t("teamDetail.noCuriositiesDescription")}
                </p>
              )}
            </div>

            {/* Social section */}
            <div className="pt-6 border-t border-slate-200/60 dark:border-zinc-900/60">
              <SocialSection socialLinks={socialLinks} />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

function SocialSection({ socialLinks }: { socialLinks?: SocialLinks }) {
  const { t } = useTranslation();

  if (
    !socialLinks ||
    !Object.entries(socialLinks).some(([key, value]) => key !== "id" && Boolean(value))
  ) {
    return (
      <div className="text-slate-400 dark:text-zinc-550 text-xs font-semibold">
        {t("teamDetail.noSocialDescription")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-300 font-heading">
        {t("teamDetail.socialMedia")}
      </h2>
      <div className="flex flex-wrap gap-2.5">
        {socialLinks.instagram && (
          <SocialIcon href={socialLinks.instagram} className="hover:bg-[#E1306C] hover:text-white text-[#E1306C] bg-[#F5F2EC] dark:bg-zinc-900">
            <FaInstagram size={18} />
          </SocialIcon>
        )}
        {socialLinks.twitter && (
          <SocialIcon href={socialLinks.twitter} className="hover:bg-black hover:text-white text-slate-800 dark:text-zinc-400 bg-[#F5F2EC] dark:bg-zinc-900">
            <FaXTwitter size={18} />
          </SocialIcon>
        )}
        {socialLinks.tiktok && (
          <SocialIcon href={socialLinks.tiktok} className="hover:bg-black hover:text-white text-slate-800 dark:text-zinc-400 bg-[#F5F2EC] dark:bg-zinc-900">
            <FaTiktok size={18} />
          </SocialIcon>
        )}
        {socialLinks.facebook && (
          <SocialIcon href={socialLinks.facebook} className="hover:bg-[#1877F2] hover:text-white text-[#1877F2] bg-[#F5F2EC] dark:bg-zinc-900">
            <FaFacebook size={18} />
          </SocialIcon>
        )}
        {socialLinks.youtube && (
          <SocialIcon href={socialLinks.youtube} className="hover:bg-[#FF0000] hover:text-white text-[#FF0000] bg-[#F5F2EC] dark:bg-zinc-900">
            <FaYoutube size={18} />
          </SocialIcon>
        )}
        {socialLinks.website && (
          <SocialIcon href={socialLinks.website} className="hover:bg-blue-600 hover:text-white text-slate-700 dark:text-zinc-400 bg-[#F5F2EC] dark:bg-zinc-900">
            <Globe size={18} />
          </SocialIcon>
        )}
      </div>
    </div>
  );
}

function SocialIcon({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:scale-105 shadow-sm ${className}`}
    >
      {children}
    </a>
  );
}
