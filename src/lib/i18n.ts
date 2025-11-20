import type { Language } from "@/types";

const translations: Record<Language, any> = {
  en: null,
  fr: null,
  rw: null,
};

export async function loadTranslations(language: Language): Promise<any> {
  if (translations[language]) {
    return translations[language];
  }

  try {
    const data = await import(`@/i18n/${language}.json`);
    translations[language] = data.default;
    return data.default;
  } catch (error) {
    console.error(`Failed to load translations for ${language}:`, error);
    // Fallback to English
    if (language !== "en") {
      return loadTranslations("en");
    }
    return {};
  }
}

export function getCurrentLanguage(): Language {
  if (typeof window === "undefined") return "en";
  return (localStorage.getItem("language") as Language) || "en";
}

export function setLanguage(language: Language): void {
  localStorage.setItem("language", language);
  window.dispatchEvent(new CustomEvent("languageChange", { detail: language }));
}
