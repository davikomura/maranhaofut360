import { useParams } from "react-router-dom";
import dataPT from "../data/data.json";
import dataEN from "../data/dataEN.json";
import socialMedia from "../data/socialMedia.json";
import champions from "../data/champions.json";
import detailsTeam from "../data/detailsTeam.json";
import { MapPin, Calendar, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FaTiktok, FaInstagram, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SocialLinks, Champion, TeamHistory } from "../types/teamTypes";

export default function TeamDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const translatedData = i18n.language.startsWith("EN") ? dataEN : dataPT;
  const teamId = Number(id);

  const fixedData = detailsTeam.detailsTeam.find((d) => d.id === teamId);
  const translatedInfo = translatedData.Teams.find((t: TeamHistory) => t.id === teamId);

  const socialLinks: SocialLinks | undefined = socialMedia.socialMedia.find(
    (s: SocialLinks) => s.id === teamId
  );

  if (!fixedData || !translatedInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
        <h1 className="text-xl font-bold">{t("teamDetail.h1")}</h1>
      </div>
    );
  }

  const foundedYear = fixedData.foundationDate
    ? new Date(fixedData.foundationDate).getFullYear()
    : t("teamDetail.unknown");

  const maranhenseTitles = champions.champions.filter(
    (c: Champion) => c.idTeamChampion === teamId
  );

  const firstTitleYear =
    maranhenseTitles.length > 0
      ? Math.min(...maranhenseTitles.map((c) => Number(c.year)))
      : null;

  const lastTitleYear =
    maranhenseTitles.length > 0
      ? Math.max(...maranhenseTitles.map((c) => Number(c.year)))
      : null;

  const getDivisionBadge = (label: string, division: string | null) => {
    const baseClass = "px-3 py-1 rounded-full text-sm font-medium";
    const colors: Record<string, string> = {
      A: "bg-green-700 text-green-200",
      B: "bg-yellow-600 text-yellow-100",
      C: "bg-orange-600 text-orange-100",
      D: "bg-red-600 text-red-100",
    };
    const divisionClass = division
      ? colors[division] ?? "bg-gray-600 text-gray-200"
      : "bg-gray-700 text-gray-300";

    return (
      <span className={`${baseClass} ${divisionClass}`}>
        {label}:{" "}
        {division
          ? `${t("teamDetail.series")} ${division}`
          : t("teamDetail.noDivision")}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black text-white px-4 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
        {/* Lado esquerdo */}
        <div className="w-full md:w-1/3 flex flex-col items-center md:self-start">
          <h1 className="text-3xl font-extrabold text-blue-400 mb-4 text-center md:hidden">
            {fixedData.name}
          </h1>

          <div className="w-full border border-gray-700 rounded-2xl bg-gray-950 p-6 shadow-lg flex justify-center items-center h-[300px]">
            <img
              src={fixedData.image}
              alt={`Escudo do ${fixedData.name}`}
              className="max-h-64 object-contain drop-shadow-xl"
            />
          </div>

          {maranhenseTitles.length > 0 && (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <div className="bg-gray-950 border border-gray-800 rounded-xl px-5 py-4">
                <p className="text-sm text-gray-400 mb-1 tracking-wide">
                  {t("teamDetail.firstTitle")}
                </p>
                <p className="text-2xl font-bold text-yellow-400 leading-tight">
                  {firstTitleYear}
                </p>
              </div>

              <div className="bg-gray-950 border border-gray-800 rounded-xl px-5 py-4">
                <p className="text-sm text-gray-400 mb-1 tracking-wide">
                  {t("teamDetail.lastTitle")}
                </p>
                <p className="text-2xl font-bold text-yellow-400 leading-tight">
                  {lastTitleYear}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Lado direito */}
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl font-extrabold text-blue-400 hidden md:block">
            {fixedData.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 text-gray-300">
              <Calendar size={16} /> {t("teamDetail.founded")} {foundedYear}
            </span>

            {fixedData.city && (
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 text-gray-300">
                <MapPin size={16} /> {fixedData.city}
              </span>
            )}

            {getDivisionBadge(
              t("teamDetail.divisionState"),
              fixedData.stateDivision ?? null
            )}
            {getDivisionBadge(
              t("teamDetail.divisionNational"),
              fixedData.stateNational ?? null
            )}
          </div>

          <p className="text-gray-300 text-base md:text-lg leading-relaxed border-l-4 border-blue-500 pl-4">
            {translatedInfo.history}
          </p>

          {maranhenseTitles.length > 0 && (
            <div className="text-lg text-yellow-300 font-semibold">
              {maranhenseTitles.length}{" "}
              {maranhenseTitles.length > 1
                ? t("teamDetail.titlesCount_plural")
                : t("teamDetail.titlesCount")}
            </div>
          )}

          {(translatedInfo.curiosities ?? []).length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                {t("teamDetail.curiosities")}
              </h2>
              <ul className="grid gap-3">
                {(translatedInfo.curiosities ?? []).map((fact, index) => (
                  <li
                    key={index}
                    className="bg-gray-800 border border-gray-700 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  >
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {socialLinks &&
            Object.entries(socialLinks).some(
              ([key, value]) => key !== "id" && !!value
            ) && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("teamDetail.socialMedia")}
                </h2>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg hover:scale-110 hover:shadow-pink-500/50 transition-all duration-300"
                    >
                      <FaInstagram size={24} />
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-black text-white shadow-lg hover:scale-110 hover:shadow-gray-500/50 transition-all duration-300"
                    >
                      <FaXTwitter size={24} />
                    </a>
                  )}
                  {socialLinks.tiktok && (
                    <a
                      href={socialLinks.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-black text-white shadow-lg hover:scale-110 hover:shadow-red-500/50 transition-all duration-300"
                    >
                      <FaTiktok size={24} />
                    </a>
                  )}
                  {socialLinks.facebook && (
                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-blue-600 text-white shadow-lg hover:scale-110 hover:shadow-blue-500/50 transition-all duration-300"
                    >
                      <FaFacebook size={24} />
                    </a>
                  )}
                  {socialLinks.website && (
                    <a
                      href={socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-gray-700 text-white shadow-lg hover:scale-110 hover:shadow-blue-300/50 transition-all duration-300"
                    >
                      <Globe size={24} />
                    </a>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}