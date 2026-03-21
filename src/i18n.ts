import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/translationEN.json';
import translationPT from './locales/translationPT.json';

export const supportedLanguages = ['PT', 'EN'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

const getInitialLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') {
    return 'PT';
  }

  const savedLanguage = window.localStorage.getItem('language');
  if (savedLanguage && supportedLanguages.includes(savedLanguage as SupportedLanguage)) {
    return savedLanguage as SupportedLanguage;
  }

  const browserLanguage = window.navigator.language.slice(0, 2).toUpperCase();
  return supportedLanguages.includes(browserLanguage as SupportedLanguage)
    ? (browserLanguage as SupportedLanguage)
    : 'PT';
};

const resources = {
  PT: {
    translation: translationPT
  },
  EN: {
    translation: translationEN
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'PT',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
