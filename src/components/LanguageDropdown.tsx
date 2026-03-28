import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supportedLanguages } from "../i18n";

interface Language {
  code: string;
  flagSrc: string;
  label: string;
}

const languages: Language[] = [
  { code: "PT", flagSrc: "/flags/br.png", label: "Portugues" },
  { code: "EN", flagSrc: "/flags/us.png", label: "English" },
];

export const LanguageDropdown = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (lang: Language) => {
    window.localStorage.setItem("language", lang.code);
    void i18n.changeLanguage(lang.code);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentCode = supportedLanguages.includes(i18n.language as "PT" | "EN")
    ? i18n.language
    : "PT";
  const currentLang = languages.find((lang) => lang.code === currentCode) || languages[0];

  return (
    <div className="relative ml-4" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center rounded-md p-2 transition hover:bg-gray-700"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <img src={currentLang.flagSrc} alt={currentLang.label} className="h-5 w-5 rounded-sm" />
      </button>
      {isOpen && (
        <ul className="absolute right-0 z-50 mt-2 w-14 overflow-hidden rounded-md border border-gray-700 bg-black shadow-xl">
          {languages.map((lang) => (
            <li key={lang.code}>
              <button
                onClick={() => handleLanguageChange(lang)}
                className="flex w-full items-center justify-center px-2 py-2 transition hover:bg-gray-700"
                aria-label={lang.label}
              >
                <img src={lang.flagSrc} alt={lang.label} className="h-5 w-5 rounded-sm" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
