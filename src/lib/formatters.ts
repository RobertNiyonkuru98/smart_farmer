import type { Language } from "@/types";

export function formatDate(date: Date, language: Language): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const locales = {
    en: "en-US",
    fr: "fr-FR",
    rw: "rw-RW",
  };

  return new Intl.DateTimeFormat(locales[language], options).format(date);
}

export function formatNumber(num: number, language: Language): string {
  const locales = {
    en: "en-US",
    fr: "fr-FR",
    rw: "rw-RW",
  };

  return new Intl.NumberFormat(locales[language]).format(num);
}

export function formatCurrency(amount: number, language: Language): string {
  const locales = {
    en: "en-RW",
    fr: "fr-RW",
    rw: "rw-RW",
  };

  return new Intl.NumberFormat(locales[language], {
    style: "currency",
    currency: "RWF",
  }).format(amount);
}

export function formatTemperature(temp: number, unit: "C" | "F" = "C"): string {
  if (unit === "F") {
    return `${Math.round((temp * 9) / 5 + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}
