import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enUi from "../locales/en.json";
import viUi from "../locales/vi.json";
import content from "../content/project-content.json";
import type { Locale } from "../content/types";

const STORAGE_KEY = "phuc-locale";

function localeFromStorage(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "vi") return stored;
  } catch {
    /* ignore */
  }
  return "en";
}

function projectBundle(locale: Locale) {
  const projects: Record<string, unknown> = {};
  for (const project of content.projects) {
    projects[project.id] = {
      title: project.title[locale],
      summary: project.summary[locale],
      type: project.type[locale],
      chapters: project.chapters.map((chapter) => ({
        title: chapter.title[locale],
        body: chapter.body[locale],
      })),
      caveats: project.requiredCaveats[locale],
      role: "role" in project ? project.role?.[locale] : undefined,
    };
  }
  return {
    site: {
      name: content.site.name,
      role: content.site.role[locale],
      location: content.site.location[locale],
      availability: content.site.availability[locale],
      intro: content.site.intro[locale],
      about: content.site.about[locale],
    },
    projects,
  };
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { ...enUi, ...projectBundle("en") } },
    vi: { translation: { ...viUi, ...projectBundle("vi") } },
  },
  lng: typeof window === "undefined" ? "en" : localeFromStorage(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  returnNull: false,
});

export function persistLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
}

export default i18n;
