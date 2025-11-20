"use client";

import { useState, useEffect } from "react";
import { Package, Send } from "lucide-react";
import ResultCard from "@/components/resultcard";
import Loader from "@/components/loader";
import { loadTranslations } from "@/lib/i18n";
import type { Language, AIResponse, Message } from "@/types";

export default function PostHarvestPage() {
  const [translations, setTranslations] = useState<any>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    crop: "",
    quantity: "",
    origin: "",
    destination: "",
    additionalInfo: "",
  });
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const savedLang = (localStorage.getItem("language") as Language) || "en";
    setLanguage(savedLang);
    loadTranslations(savedLang).then(setTranslations);

    localStorage.setItem("chatbotContext", "post-harvest");
  }, []);

  useEffect(() => {
    const handler = ((e: CustomEvent) => {
      setLanguage(e.detail);
      loadTranslations(e.detail).then(setTranslations);
    }) as EventListener;

    window.addEventListener("languageChange", handler);
    return () => window.removeEventListener("languageChange", handler);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.crop || !formData.quantity) return;

    setLoading(true);
    setResponse(null);

    const prompt = `Crop: ${formData.crop}, Quantity: ${
      formData.quantity
    }, Origin: ${formData.origin || "Not specified"}, Destination: ${
      formData.destination || "Not specified"
    }. Additional info: ${formData.additionalInfo || "None"}`;

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          language,
          feature: "post-harvest",
          context: messages.map((m) => `${m.role}: ${m.content}`).join("\n"),
        }),
      });

      const data: AIResponse = await res.json();
      setResponse(data);
      setMessages((prev) => [...prev, ...data.messages]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (confirmed: boolean) => {
    if (!confirmed) {
      setResponse(null);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt:
            "User confirmed. Provide detailed storage, packaging, and transport recommendations",
          language,
          feature: "post-harvest",
          context: messages.map((m) => `${m.role}: ${m.content}`).join("\n"),
          previousMessages: messages,
        }),
      });

      const data: AIResponse = await res.json();
      setResponse(data);
      setMessages((prev) => [...prev, ...data.messages]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!translations) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-10 h-10 text-rwanda-yellow" />
          <h1 className="text-3xl md:text-4xl font-bold text-rwanda-yellow">
            {translations.postHarvest.title}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {translations.postHarvest.description}
        </p>
      </div>

      <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-6 shadow-lg mb-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {translations.postHarvest.cropLabel} *
              </label>
              <input
                type="text"
                value={formData.crop}
                onChange={(e) =>
                  setFormData({ ...formData, crop: e.target.value })
                }
                className="w-full p-3 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-rwanda-yellow"
                placeholder={translations.postHarvest.cropPlaceholder}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {translations.postHarvest.quantityLabel} *
              </label>
              <input
                type="text"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                className="w-full p-3 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-rwanda-yellow"
                placeholder={translations.postHarvest.quantityPlaceholder}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {translations.postHarvest.originLabel}
              </label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) =>
                  setFormData({ ...formData, origin: e.target.value })
                }
                className="w-full p-3 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-rwanda-yellow"
                placeholder={translations.postHarvest.originPlaceholder}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {translations.postHarvest.destinationLabel}
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
                className="w-full p-3 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-rwanda-yellow"
                placeholder={translations.postHarvest.destinationPlaceholder}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {translations.postHarvest.additionalInfoLabel}
              </label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) =>
                  setFormData({ ...formData, additionalInfo: e.target.value })
                }
                className="w-full p-3 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-rwanda-yellow"
                rows={3}
                placeholder={translations.postHarvest.additionalInfoPlaceholder}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.crop || !formData.quantity}
            className="mt-6 w-full bg-rwanda-yellow hover:bg-yellow-500 disabled:bg-gray-400 text-gray-900 font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? <Loader size="sm" /> : <Send className="w-5 h-5" />}
            {translations.postHarvest.submitButton}
          </button>
        </form>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      )}

      {response && response.status === "confirmation" && (
        <div className="bg-rwanda-yellow bg-opacity-10 border border-rwanda-yellow rounded-xl p-6 mb-6 animate-fadeIn">
          <h3 className="text-lg font-semibold mb-4">
            {translations.postHarvest.confirmationTitle}
          </h3>
          <p className="mb-6">{response.confirmationQuestion}</p>
          <div className="flex gap-4">
            <button
              onClick={() => handleConfirm(true)}
              className="flex-1 bg-rwanda-yellow hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-4 rounded-lg"
            >
              {translations.common.yes}
            </button>
            <button
              onClick={() => handleConfirm(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg"
            >
              {translations.common.no}
            </button>
          </div>
        </div>
      )}

      {response && response.status === "success" && response.result && (
        <ResultCard
          title={translations.postHarvest.resultsTitle}
          result={response.result}
          language={language}
        />
      )}
    </div>
  );
}
