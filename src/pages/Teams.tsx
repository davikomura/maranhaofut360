import TeamList from "../components/TeamList";
import { useTranslation } from "react-i18next";
import { useSEO } from "../hooks/useSEO";

const Teams = () => {
  const { t } = useTranslation();

  // Dynamic Page SEO
  useSEO({
    title: t("teamList.h2"),
    description: t("teamList.p"),
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,_rgba(59,130,246,0.04),_transparent_28%)] transition-theme">
      <div className="mx-auto max-w-4xl px-6 py-12 md:py-20">
        
        {/* Floating Header */}
        <div className="mb-12 text-left space-y-4 max-w-2xl">
          <h1 id="teams" className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-5xl font-heading leading-tight">
            {t("teamList.h2")}
          </h1>
          <p className="text-base text-slate-500 dark:text-zinc-400">
            {t("teamList.p")}
          </p>
        </div>
        
        {/* Floating directly on canvas */}
        <div className="pt-2">
          <TeamList />
        </div>

      </div>
    </div>
  );
};

export default Teams;
