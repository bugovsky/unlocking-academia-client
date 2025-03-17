import i18n, { type InitOptions } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend, { type HttpBackendOptions } from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import translationRU from "../assets/locales/ru/translations.json";
import { isProduction } from "./utils";

export const defaultNS = "translations";
export const resources = {
	ru: { translations: translationRU },
} as const;

const i18nOptions: InitOptions<HttpBackendOptions> = {
	defaultNS,
	ns: [defaultNS],
	debug: !isProduction,
	fallbackLng: "ru",
	interpolation: {
		escapeValue: false,
	},
	backend: {
		loadPath: isProduction
			? "locales/{{lng}}/translations.json"
			: "src/assets/locales/{{lng}}/translations.json",
	},
};

void i18n
	.use(initReactI18next)
	.use(LanguageDetector)
	.use(Backend)
	.init<HttpBackendOptions>(i18nOptions);
