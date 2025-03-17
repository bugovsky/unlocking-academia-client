import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ruTranslations from "./assets/locales/ru/translations.json";

i18n.use(initReactI18next).init({
  lng: "ru",
  fallbackLng: "ru",
  resources: {
    ru: { translation: ruTranslations },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;