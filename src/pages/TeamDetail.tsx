import { Calendar, Globe, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { BackButton } from "../components/ui/BackButton";
import { EmptyState } from "../components/ui/EmptyState";
import {
  getChampionsByTeamId,
  getSocialLinksByTeamId,
  getTeamDetailsById,
  getTeamHistoryById,
} from "../lib/footballData";
import type { SocialLinks } from "../types/football";
import { fixDisplayText } from "../utils/text";

export default function TeamDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const teamId = Number(id);

  const fixedData = getTeamDetailsById(teamId);
  const translatedInfo = getTeamHistoryById(teamId, i18n.language);
  const socialLinks = getSocialLinksByTeamId(teamId);

  if (!fixedData || !translatedInfo) {
    return (
      <div className="min-h-screen bg-black px-4 py-12 text-white">
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
      A: "bg-green-700 text-green-200",
      B: "bg-yellow-600 text-yellow-100",
      C: "bg-orange-600 text-orange-100",
      D: "bg-red-600 text-red-100",
    };

    return (
      <span
        className={`rounded-full px-3 py-1 text-sm font-medium ${
          division ? colors[division] ?? "bg-gray-600 text-gray-200" : "bg-gray-700 text-gray-300"
        }`}
      >
        {label}: {division ? `${t("teamDetail.series")} ${division}` : t("teamDetail.noDivision")}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black px-4 py-8 text-white md:py-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <BackButton />

        <div className="flex flex-col gap-10 md:flex-row">
          <div className="w-full md:w-1/3">
            <div className="rounded-[2rem] border border-gray-700 bg-gray-950 p-6 shadow-lg">
              <h1 className="mb-4 text-center text-3xl font-extrabold text-blue-400 md:hidden">
                {fixDisplayText(fixedData.name)}
              </h1>

              <div className="flex h-[260px] items-center justify-center rounded-2xl border border-gray-800 bg-black/30">
                <img
                  src={fixedData.image}
                  alt={`Escudo do ${fixDisplayText(fixedData.name)}`}
                  className="max-h-56 object-contain drop-shadow-xl"
                />
              </div>

              {maranhenseTitles.length > 0 && (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1">
                  <InfoCard label={t("teamDetail.firstTitle")} value={firstTitleYear} />
                  <InfoCard label={t("teamDetail.lastTitle")} value={lastTitleYear} />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <h1 className="hidden text-4xl font-extrabold text-blue-400 md:block">
              {fixDisplayText(fixedData.name)}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
              <span className="flex items-center gap-2 rounded-full bg-gray-800 px-3 py-1 text-gray-300">
                <Calendar size={16} /> {t("teamDetail.founded")} {foundedYear}
              </span>

              {fixedData.city && (
                <span className="flex items-center gap-2 rounded-full bg-gray-800 px-3 py-1 text-gray-300">
                  <MapPin size={16} /> {fixDisplayText(fixedData.city)}
                </span>
              )}

              {getDivisionBadge(t("teamDetail.divisionState"), fixedData.stateDivision)}
              {getDivisionBadge(t("teamDetail.divisionNational"), fixedData.stateNational)}
            </div>

            <p className="border-l-4 border-blue-500 pl-4 text-base leading-relaxed text-gray-300 md:text-lg">
              {fixDisplayText(translatedInfo.history)}
            </p>

            {maranhenseTitles.length > 0 ? (
              <div className="text-lg font-semibold text-yellow-300">
                {maranhenseTitles.length}{" "}
                {maranhenseTitles.length > 1
                  ? t("teamDetail.titlesCount_plural")
                  : t("teamDetail.titlesCount")}
              </div>
            ) : (
              <EmptyState
                title={t("teamDetail.noTitlesTitle")}
                description={t("teamDetail.noTitlesDescription")}
              />
            )}

            {(translatedInfo.curiosities ?? []).length > 0 ? (
              <div>
                <h2 className="mb-4 text-2xl font-bold text-white">{t("teamDetail.curiosities")}</h2>
                <ul className="grid gap-3">
                  {(translatedInfo.curiosities ?? []).map((fact, index) => (
                    <li
                      key={index}
                      className="rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-md transition-shadow hover:shadow-lg"
                    >
                      {fixDisplayText(fact)}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <EmptyState
                title={t("teamDetail.noCuriositiesTitle")}
                description={t("teamDetail.noCuriositiesDescription")}
              />
            )}

            <SocialSection socialLinks={socialLinks} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-black/20 px-5 py-4">
      <p className="mb-1 text-sm tracking-wide text-gray-400">{label}</p>
      <p className="text-2xl font-bold leading-tight text-yellow-400">{value ?? "-"}</p>
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
      <EmptyState
        title={t("teamDetail.noSocialTitle")}
        description={t("teamDetail.noSocialDescription")}
      />
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-white">{t("teamDetail.socialMedia")}</h2>
      <div className="flex flex-wrap gap-4">
        {socialLinks.instagram && (
          <SocialIcon href={socialLinks.instagram} className="from-pink-500 to-yellow-500">
            <FaInstagram size={24} />
          </SocialIcon>
        )}
        {socialLinks.twitter && (
          <SocialIcon href={socialLinks.twitter} className="bg-black">
            <FaXTwitter size={24} />
          </SocialIcon>
        )}
        {socialLinks.tiktok && (
          <SocialIcon href={socialLinks.tiktok} className="bg-black">
            <FaTiktok size={24} />
          </SocialIcon>
        )}
        {socialLinks.facebook && (
          <SocialIcon href={socialLinks.facebook} className="bg-blue-600">
            <FaFacebook size={24} />
          </SocialIcon>
        )}
        {socialLinks.youtube && (
          <SocialIcon href={socialLinks.youtube} className="bg-red-600">
            <FaYoutube size={24} />
          </SocialIcon>
        )}
        {socialLinks.website && (
          <SocialIcon href={socialLinks.website} className="bg-gray-700">
            <Globe size={24} />
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
      className={`rounded-full p-3 text-white shadow-lg transition-all duration-300 hover:scale-110 ${className}`}
    >
      {children}
    </a>
  );
}
