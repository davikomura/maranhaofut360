import TeamList from "../components/TeamList";
import { useTranslation } from "react-i18next";

const Teams = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-black via-gray-900 to-black text-white">
      <div className="flex-grow px-4 md:px-8 pt-10 pb-16">
        <h2 id="teams" className="mb-4 text-center text-3xl font-extrabold text-blue-500 drop-shadow-md md:text-4xl">
          {t("teamList.h2")}
        </h2>
        <p className="mb-10 text-center text-lg text-gray-300">
          {t("teamList.p")}
        </p>
        <TeamList />
      </div>
    </div>
  );
};

export default Teams;
