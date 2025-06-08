import { Link } from "react-router-dom";
import { Trophy, Shield, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-black via-gray-900 to-black text-white">
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-6 text-center py-16">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow mb-4">
          {t("homePage.h1")}
        </h1>
        <p className="text-md md:text-xl text-gray-300 max-w-2xl">
          {t("homePage.p1")}
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {/* Série A */}
          <Link
            to="/Serie-A"
            className="group bg-black border-2 border-red-600 hover:bg-red-600 p-6 rounded-2xl shadow-lg transition-transform transform hover:scale-105"
          >
            <div className="flex flex-col items-center">
              <Shield className="w-10 h-10 mb-3 text-red-500 group-hover:text-white" />
              <span className="text-2xl font-bold text-red-400 group-hover:text-white">{t("homePage.span1")}</span>
              <p className="text-sm text-gray-300 group-hover:text-white mt-2 text-center">
                {t("homePage.p2")}
              </p>
            </div>
          </Link>

          {/* Série B */}
          <Link
            to="/Serie-B"
            className="group bg-black border-2 border-blue-600 hover:bg-blue-600 p-6 rounded-2xl shadow-lg transition-transform transform hover:scale-105"
          >
            <div className="flex flex-col items-center">
              <Star className="w-10 h-10 mb-3 text-blue-400 group-hover:text-white" />
              <span className="text-2xl font-bold text-blue-400 group-hover:text-white">{t("homePage.span2")}</span>
              <p className="text-sm text-gray-300 group-hover:text-white mt-2 text-center">
                {t("homePage.p3")}
              </p>
            </div>
          </Link>

          {/* Campeões */}
          <Link
            to="/Lista-de-campeoes"
            className="group bg-black border-2 border-yellow-500 hover:bg-yellow-500 p-6 rounded-2xl shadow-lg transition-transform transform hover:scale-105"
          >
            <div className="flex flex-col items-center">
              <Trophy className="w-10 h-10 mb-3 text-yellow-400 group-hover:text-black" />
              <span className="text-2xl font-bold text-yellow-400 group-hover:text-black">{t("homePage.span3")}</span>
              <p className="text-sm text-gray-300 group-hover:text-black mt-2 text-center">
                {t("homePage.p4")}
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}