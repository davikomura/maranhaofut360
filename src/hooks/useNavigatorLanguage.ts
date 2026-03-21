import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supportedLanguages } from "../i18n";

export const useNavigatorLanguage = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("language");
    if (savedLanguage && supportedLanguages.includes(savedLanguage as "PT" | "EN")) {
      void i18n.changeLanguage(savedLanguage);
      return;
    }

    const browserLanguage = navigator.language.slice(0, 2).toUpperCase();
    const nextLanguage = supportedLanguages.includes(browserLanguage as "PT" | "EN")
      ? browserLanguage
      : "PT";

    window.localStorage.setItem("language", nextLanguage);
    void i18n.changeLanguage(nextLanguage);
  }, [i18n]);
};
