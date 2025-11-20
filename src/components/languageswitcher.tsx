"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import type { Language } from "@/types";

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState<Language>("en");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved) setLanguage(saved);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    setIsOpen(false);

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent("languageChange", { detail: lang }));
  };

  const languages = [
    { code: "en" as Language, name: "English", flag: "🇬🇧" },
    { code: "fr" as Language, name: "Français", flag: "🇫🇷" },
    { code: "rw" as Language, name: "Kinyarwanda", flag: "🇷🇼" },
  ];

  const currentLang = languages.find((l) => l.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
        aria-label="Change language"
      >
        <Globe className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:inline">
          {currentLang?.flag} {currentLang?.code.toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-bg rounded-lg shadow-xl border border-light-border dark:border-dark-border z-50 overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-light-surface dark:hover:bg-dark-surface transition-colors ${
                  language === lang.code
                    ? "bg-rwanda-blue bg-opacity-10 dark:bg-rwanda-yellow dark:bg-opacity-10"
                    : ""
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
