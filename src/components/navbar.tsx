"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sprout } from "lucide-react";
import LanguageSwitcher from "./languageswitcher";
import ThemeToggle from "./themetoggle";
import { loadTranslations } from "@/lib/i18n";
import type { Language } from "@/types";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
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

  const navLinks = [
    { href: "/", label: translations.nav.home },
    { href: "/pre-planting", label: translations.nav.prePlanting },
    { href: "/scan", label: translations.nav.scan },
    { href: "/post-harvest", label: translations.nav.postHarvest },
    { href: "/weather-advisor", label: translations.nav.weather },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-dark-bg shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-rwanda-blue dark:text-rwanda-yellow"
          >
            <Sprout className="w-8 h-8" />
            <span className="hidden sm:inline">{translations.nav.appName}</span>
            <span className="sm:hidden">Smart Farmer</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 dark:text-gray-300 hover:text-rwanda-blue dark:hover:text-rwanda-yellow transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-light-border dark:border-dark-border">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-light-surface dark:hover:bg-dark-surface rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
