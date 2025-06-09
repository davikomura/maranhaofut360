import TeamList from "../components/TeamList";
import { useTranslation } from "react-i18next";

const Teams = () => {

  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-black via-gray-900 to-black text-white">
      <div className="flex-grow px-4 md:px-8 pt-10 pb-16">
        <h2 id="teams" className="text-3xl md:text-4xl font-extrabold text-center mb-4 text-blue-500 drop-shadow-md">
          {t("teamList.h2")}
        </h2>
        <p className="text-center text-gray-300 mb-10 text-lg">
          {t("teamList.p")}
        </p>
        <TeamList />
      </div>
    </div>
  );
};

export default Teams;