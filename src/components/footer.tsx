"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { loadTranslations } from "@/lib/i18n";
import type { Language } from "@/types";

export default function Footer() {
  const [translations, setTranslations] = useState<any>(null);
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = (localStorage.getItem("language") as Language) || "en";
    setLanguage(savedLang);
    loadTranslations(savedLang).then(setTranslations);
  }, []);

  useEffect(() => {
    const handler = ((e: CustomEvent) => {
      setLanguage(e.detail);
      loadTranslations(e.detail).then(setTranslations);
    }) as EventListener;

    window.addEventListener("languageChange", handler);
    return () => window.removeEventListener("languageChange", handler);
  }, []);

  if (!translations) return null;

  return (
    <footer className="bg-light-surface dark:bg-dark-surface border-t border-light-border dark:border-dark-border mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3 text-rwanda-blue dark:text-rwanda-yellow">
              {translations.footer.about.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {translations.footer.about.description}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3 text-rwanda-green">
              {translations.footer.features.title}
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>{translations.footer.features.list[0]}</li>
              <li>{translations.footer.features.list[1]}</li>
              <li>{translations.footer.features.list[2]}</li>
              <li>{translations.footer.features.list[3]}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3 text-rwanda-yellow">
              {translations.footer.contact.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {translations.footer.contact.email}
              <br />
              {translations.footer.contact.phone}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-light-border dark:border-dark-border text-center text-sm text-gray-600 dark:text-gray-400">
          <p className="flex items-center justify-center gap-2">
            {translations.footer.madeWith}{" "}
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />{" "}
            {translations.footer.forFarmers}
          </p>
          <p className="mt-2">© 2025 RIATS - {translations.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
