import { useTranslation } from "react-i18next";

export const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-black via-gray-900 to-black text-gray-300">
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-400 mb-8">
          {t("about.title")}
        </h1>
        <p className="text-lg md:text-xl leading-relaxed">
          {t("about.description")}
        </p>
      </main>
    </div>
  );
};