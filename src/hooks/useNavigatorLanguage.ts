import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const useNavigatorLanguage = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const browserLanguage = navigator.language.slice(0, 2).toLocaleUpperCase();
    const availableLanguages = ["EN", "PT", "ES", "FR", "DE"];

    if (availableLanguages.includes(browserLanguage)) {
      i18n.changeLanguage(browserLanguage);
    } else {
      i18n.changeLanguage("EN");
    }
  }, [i18n]);
};