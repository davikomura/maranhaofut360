import { useParams } from "react-router-dom";
// import teamsData from "../../data.json";
import dataPT from "../../data.json";
import dataEN from "../../dataEN.json";
import { MapPin, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TeamDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const teamsData = i18n.language.startsWith("EN") ? dataEN : dataPT;
  const teamId = Number(id);

  const team = teamsData.Teams.find((t) => t.id === teamId);

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
        <h1 className="text-xl font-bold">{t("teamDetail.h1")}</h1>
      </div>
    );
  }

  const foundedYear = team.foundationDate
    ? new Date(team.foundationDate).getFullYear()
    : t("teamDetail.unknown");

  const maranhenseTitles = teamsData.champions.filter(
    (c) => c.idTeamChampion === teamId
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

    const divisionClass = division ? colors[division] ?? "bg-gray-600 text-gray-200" : "bg-gray-700 text-gray-300";

    return (
      <span className={`${baseClass} ${divisionClass}`}>
        {label}:{" "}
        {division ? `${t("teamDetail.series")} ${division}` : t("teamDetail.noDivision")}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black text-white px-4 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 flex flex-col items-center md:self-start">
          <h1 className="text-3xl font-extrabold text-blue-400 mb-4 text-center md:hidden">
            {team.name}
          </h1>

          <div className="w-full border border-gray-700 rounded-2xl bg-gray-950 p-6 shadow-lg flex justify-center items-center h-[300px]">
            <img
              src={team.image}
              alt={`Escudo do ${team.name}`}
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

        {/* Main content */}
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl font-extrabold text-blue-400 hidden md:block">
            {team.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 text-gray-300">
              <Calendar size={16} /> {t("teamDetail.founded")} {foundedYear}
            </span>

            {team.city && (
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 text-gray-300">
                <MapPin size={16} /> {team.city}
              </span>
            )}

            {getDivisionBadge(t("teamDetail.divisionState"), team.stateDivision)}
            {getDivisionBadge(t("teamDetail.divisionNational"), team.stateNational)}
          </div>

          <p className="text-gray-300 text-base md:text-lg leading-relaxed border-l-4 border-blue-500 pl-4">
            {team.history}
          </p>

          {maranhenseTitles.length > 0 && (
            <div className="text-lg text-yellow-300 font-semibold">
              {maranhenseTitles.length}{" "}
              {maranhenseTitles.length > 1
                ? t("teamDetail.titlesCount_plural")
                : t("teamDetail.titlesCount")}
            </div>
          )}

          {team.curiosities?.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                {t("teamDetail.curiosities")}
              </h2>
              <ul className="grid gap-3">
                {team.curiosities.map((fact, index) => (
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
        </div>
      </div>
    </div>
  );
}