import { useTranslation } from "react-i18next";
import { useSEO } from "../hooks/useSEO";

export const About = () => {
  const { t } = useTranslation();

  // Active Dynamic Page SEO
  useSEO({
    title: t("about.title"),
    description: t("about.description"),
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(220,38,38,0.03),_transparent_28%)] transition-theme animate-fade-in-up">
      <main className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
          {t("about.title")}
        </h1>
        <p className="text-base md:text-xl leading-relaxed text-slate-600 dark:text-zinc-300 md:leading-loose">
          {t("about.description")}
        </p>
      </main>
    </div>
  );
};
export default About;
