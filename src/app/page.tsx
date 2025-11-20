"use client";

import { useEffect, useState } from "react";
import { Sprout, Scan, Package, CloudRain } from "lucide-react";
import FeatureCard from "@/components/featurecard";
import { loadTranslations } from "@/lib/i18n";
import type { Language } from "@/types";

export default function Home() {
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

  const features = [
    {
      title: translations.home.features.prePlanting.title,
      description: translations.home.features.prePlanting.description,
      icon: Sprout,
      href: "/pre-planting",
      color: "rwanda-green",
    },
    {
      title: translations.home.features.scan.title,
      description: translations.home.features.scan.description,
      icon: Scan,
      href: "/scan",
      color: "rwanda-blue",
    },
    {
      title: translations.home.features.postHarvest.title,
      description: translations.home.features.postHarvest.description,
      icon: Package,
      href: "/post-harvest",
      color: "rwanda-yellow",
    },
    {
      title: translations.home.features.weather.title,
      description: translations.home.features.weather.description,
      icon: CloudRain,
      href: "/weather-advisor",
      color: "rwanda-blue",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16 animate-fadeIn">
        <div className="bg-linear-to-r from-rwanda-blue to-rwanda-green text-white py-16 px-8 rounded-xl shadow-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {translations.home.hero.title}
          </h1>
          <p className="text-xl md:text-2xl mb-2 opacity-95">
            {translations.home.hero.subtitle}
          </p>
          <p className="text-lg opacity-90">{translations.home.hero.tagline}</p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-rwanda-blue dark:text-rwanda-yellow">
          {translations.home.featuresTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-light-surface dark:bg-dark-surface rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-8 text-rwanda-green">
          {translations.home.statsTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-4xl font-bold text-rwanda-blue mb-2">24/7</div>
            <div className="text-gray-600 dark:text-gray-400">
              {translations.home.stats.availability}
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold text-rwanda-green mb-2">3+</div>
            <div className="text-gray-600 dark:text-gray-400">
              {translations.home.stats.languages}
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold text-rwanda-yellow mb-2">AI</div>
            <div className="text-gray-600 dark:text-gray-400">
              {translations.home.stats.powered}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
