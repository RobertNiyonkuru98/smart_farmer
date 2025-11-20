"use client";

import { useState, useEffect } from "react";
import { Scan, Camera } from "lucide-react";
import UploadBox from "@/components/uploadbox";
import ResultCard from "@/components/resultcard";
import Loader from "@/components/loader";
import { loadTranslations } from "@/lib/i18n";
import type { Language, AIResponse, Message } from "@/types";

export default function ScanPage() {
  const [translations, setTranslations] = useState<any>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const savedLang = (localStorage.getItem("language") as Language) || "en";
    setLanguage(savedLang);
    loadTranslations(savedLang).then(setTranslations);

    localStorage.setItem("chatbotContext", "scan");
  }, []);

  useEffect(() => {
    const handler = ((e: CustomEvent) => {
      setLanguage(e.detail);
      loadTranslations(e.detail).then(setTranslations);
    }) as EventListener;

    window.addEventListener("languageChange", handler);
    return () => window.removeEventListener("languageChange", handler);
  }, []);

  const handleAnalyze = async () => {
    if (!image) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt:
            "Analyze this crop image for diseases, pests, nutrient deficiencies, or stress",
          language,
          feature: "scan",
          image,
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
            "User confirmed. Provide detailed diagnosis with treatment and prevention",
          language,
          feature: "scan",
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
          <Scan className="w-10 h-10 text-rwanda-blue" />
          <h1 className="text-3xl md:text-4xl font-bold text-rwanda-blue">
            {translations.scan.title}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {translations.scan.description}
        </p>
      </div>

      <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-6 shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {translations.scan.uploadTitle}
        </h2>

        <UploadBox
          onImageSelect={setImage}
          currentImage={image}
          accept="image/*"
          label={translations.scan.uploadLabel}
          icon={Camera}
        />

        <button
          onClick={handleAnalyze}
          disabled={loading || !image}
          className="mt-6 w-full bg-rwanda-blue hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          {loading ? <Loader size="sm" /> : <Scan className="w-5 h-5" />}
          {translations.scan.analyzeButton}
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      )}

      {response && response.status === "confirmation" && (
        <div className="bg-rwanda-yellow bg-opacity-10 border border-rwanda-yellow rounded-xl p-6 mb-6 animate-fadeIn">
          <h3 className="text-lg font-semibold mb-4">
            {translations.scan.confirmationTitle}
          </h3>
          <p className="mb-6">{response.confirmationQuestion}</p>
          <div className="flex gap-4">
            <button
              onClick={() => handleConfirm(true)}
              className="flex-1 bg-rwanda-blue hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
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
          title={translations.scan.resultsTitle}
          result={response.result}
          language={language}
        />
      )}
    </div>
  );
}
