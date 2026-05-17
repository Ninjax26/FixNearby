// client/src/i18n/index.js

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "./locales/en/translation.json";
import bnTranslation from "./locales/bn/translation.json";

const resources = {
  en: {
    translation: enTranslation,
  },

  bn: {
    translation: bnTranslation,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,

    lng: localStorage.getItem("language") || "en",

    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en/translation.json';
import hi from './locales/hi/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
