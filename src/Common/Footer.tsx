import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-gradient-to-r from-black via-gray-900 to-black text-gray-300 border-t border-red-600">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between text-sm md:text-base">
        <p className="text-center md:text-left">
          © 2025 <span className="text-white font-semibold">FutMA 360</span>. {t("footer.p1")}
        </p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-500 transition"
          >
            Instagram
          </a>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition"
          >
            YouTube
          </a>
          <a
            href="/contato"
            className="hover:text-yellow-400 transition"
          >
            Contato
          </a>
        </div>
      </div>
    </footer>
  );
};
