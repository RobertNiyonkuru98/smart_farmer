"use client";

import { useState, useEffect } from "react";
import { CloudRain, Sun, Cloud, Wind, Droplets, MapPin } from "lucide-react";
import Loader from "@/components/loader";
import { loadTranslations } from "@/lib/i18n";
import type { Language, WeatherData } from "@/types";

export default function WeatherAdvisorPage() {
  const [translations, setTranslations] = useState<any>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("Kigali");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const savedLang = (localStorage.getItem("language") as Language) || "en";
    setLanguage(savedLang);
    loadTranslations(savedLang).then(setTranslations);

    localStorage.setItem("chatbotContext", "weather");

    // Load weather on mount
    fetchWeather("Kigali");
  }, []);

  useEffect(() => {
    const handler = ((e: CustomEvent) => {
      setLanguage(e.detail);
      loadTranslations(e.detail).then(setTranslations);
    }) as EventListener;

    window.addEventListener("languageChange", handler);
    return () => window.removeEventListener("languageChange", handler);
  }, []);

  const fetchWeather = async (loc: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/weather?location=${encodeURIComponent(loc)}&language=${language}`
      );
      const data: WeatherData = await res.json();
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      fetchWeather(location);
    }
  };

  const getWeatherIcon = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes("rain")) return <CloudRain className="w-12 h-12" />;
    if (lower.includes("cloud")) return <Cloud className="w-12 h-12" />;
    if (lower.includes("sun") || lower.includes("clear"))
      return <Sun className="w-12 h-12" />;
    return <Cloud className="w-12 h-12" />;
  };

  if (!translations) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <CloudRain className="w-10 h-10 text-rwanda-blue" />
          <h1 className="text-3xl md:text-4xl font-bold text-rwanda-blue">
            {translations.weather.title}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {translations.weather.description}
        </p>
      </div>

      <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-6 shadow-lg mb-6">
        <form onSubmit={handleLocationSubmit} className="flex gap-4">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-rwanda-blue"
              placeholder={translations.weather.locationPlaceholder}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-rwanda-blue hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? <Loader size="sm" /> : translations.weather.searchButton}
          </button>
        </form>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      )}

      {weatherData && !loading && (
        <div className="space-y-6 animate-fadeIn">
          {/* Current Weather */}
          <div className="bg-linear-to-br from-rwanda-blue to-blue-600 text-white rounded-xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-6">
              {translations.weather.currentTitle}
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-6xl font-bold mb-2">
                  {weatherData.current.temp}°C
                </div>
                <div className="text-xl opacity-90">
                  {weatherData.current.condition}
                </div>
              </div>
              <div className="text-white opacity-90">
                {getWeatherIcon(weatherData.current.condition)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white border-opacity-20">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5" />
                <span>
                  {translations.weather.humidity}:{" "}
                  {weatherData.current.humidity}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5" />
                <span>
                  {translations.weather.wind}: {weatherData.current.windSpeed}{" "}
                  km/h
                </span>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">
              {translations.weather.forecastTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {weatherData.forecast.map((day, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg p-4"
                >
                  <div className="font-semibold mb-2">{day.date}</div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-rwanda-blue dark:text-rwanda-yellow">
                      {getWeatherIcon(day.condition)}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{day.temp.max}°</div>
                      <div className="text-sm text-gray-500">
                        {day.temp.min}°
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {day.condition}
                  </div>
                  {day.rain > 0 && (
                    <div className="text-sm text-rwanda-blue dark:text-rwanda-yellow flex items-center gap-1">
                      <Droplets className="w-4 h-4" />
                      {day.rain}mm
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-rwanda-green bg-opacity-10 border border-rwanda-green rounded-xl p-6">
            <h2 className="text-2xl font-bold text-rwanda-green mb-4">
              {translations.weather.recommendationsTitle}
            </h2>
            <ul className="space-y-3">
              {weatherData.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-rwanda-green text-xl">•</span>
                  <span className="flex-1">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
