// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/translationEN.json';
import translationPT from './locales/translationPT.json';
import translationES from './locales/translationES.json';
import translationFR from './locales/translationFR.json';
import translationDE from './locales/translationDE.json';

const resources = {
  PT: {
    translation: translationPT
  },
  EN: {
    translation: translationEN
  },
  ES: {
    translation: translationES
  },
  FR: {
    translation: translationFR
  },
  DE: {
    translation: translationDE
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'PT',
    fallbackLng: 'PT',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;