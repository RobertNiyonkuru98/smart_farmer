"use client";

import { CheckCircle, AlertCircle } from "lucide-react";
import type { Language } from "@/types";

interface ResultCardProps {
  title: string;
  result: {
    diagnosis?: string;
    recommendations?: string[];
    timeline?: string;
    actions?: string[];
    preventions?: string[];
    inputs?: string[];
    storage?: string[];
    packaging?: string[];
    transport?: string[];
    weatherActions?: string[];
  };
  language: Language;
}

export default function ResultCard({
  title,
  result,
  language,
}: ResultCardProps) {
  const sectionTitles = {
    en: {
      diagnosis: "Diagnosis",
      recommendations: "Recommendations",
      timeline: "Timeline",
      actions: "Actions Required",
      preventions: "Prevention Measures",
      inputs: "Required Inputs",
      storage: "Storage Guidelines",
      packaging: "Packaging Instructions",
      transport: "Transport Guidelines",
      weatherActions: "Weather-Based Actions",
    },
    fr: {
      diagnosis: "Diagnostic",
      recommendations: "Recommandations",
      timeline: "Calendrier",
      actions: "Actions Requises",
      preventions: "Mesures de Prévention",
      inputs: "Intrants Requis",
      storage: "Directives de Stockage",
      packaging: "Instructions d'Emballage",
      transport: "Directives de Transport",
      weatherActions: "Actions Basées sur la Météo",
    },
    rw: {
      diagnosis: "Isesengura",
      recommendations: "Inama",
      timeline: "Igihe",
      actions: "Ibikorwa Bikenewe",
      preventions: "Ingamba zo Kwirinda",
      inputs: "Ibikoresho Bikenewe",
      storage: "Amabwiriza yo Kubika",
      packaging: "Amabwiriza yo Gupakira",
      transport: "Amabwiriza yo Gutwara",
      weatherActions: "Ibikorwa Bishingiye ku Bihe",
    },
  };

  const titles = sectionTitles[language] || sectionTitles.en;

  return (
    <div className="bg-white dark:bg-dark-bg rounded-xl shadow-lg overflow-hidden animate-fadeIn">
      <div className="bg-linear-to-r from-rwanda-blue to-rwanda-green text-white p-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CheckCircle className="w-6 h-6" />
          {title}
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {result.diagnosis && (
          <div>
            <h3 className="text-lg font-semibold mb-3 text-rwanda-blue dark:text-rwanda-yellow flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {titles.diagnosis}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 bg-light-surface dark:bg-dark-surface p-4 rounded-lg">
              {result.diagnosis}
            </p>
          </div>
        )}

        {result.recommendations && result.recommendations.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 text-rwanda-green">
              {titles.recommendations}
            </h3>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                >
                  <span className="text-rwanda-green text-xl mt-1">•</span>
                  <span className="flex-1">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.actions && result.actions.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 text-rwanda-yellow">
              {titles.actions}
            </h3>
            <ul className="space-y-2">
              {result.actions.map((action, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                >
                  <span className="text-rwanda-yellow text-xl mt-1">✓</span>
                  <span className="flex-1">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.preventions && result.preventions.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 text-rwanda-blue dark:text-rwanda-yellow">
              {titles.preventions}
            </h3>
            <ul className="space-y-2">
              {result.preventions.map((prev, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                >
                  <span className="text-rwanda-blue dark:text-rwanda-yellow text-xl mt-1">
                    ◆
                  </span>
                  <span className="flex-1">{prev}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.inputs && result.inputs.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 text-rwanda-green">
              {titles.inputs}
            </h3>
            <ul className="space-y-2">
              {result.inputs.map((input, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                >
                  <span className="text-rwanda-green text-xl mt-1">►</span>
                  <span className="flex-1">{input}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.storage && result.storage.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 text-rwanda-blue dark:text-rwanda-yellow">
              {titles.storage}
            </h3>
            <ul className="space-y-2">
              {result.storage.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                >
                  <span className="text-rwanda-blue dark:text-rwanda-yellow text-xl mt-1">
                    ▪
                  </span>
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.packaging && result.packaging.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 text-rwanda-yellow">
              {titles.packaging}
            </h3>
            <ul className="space-y-2">
              {result.packaging.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                >
                  <span className="text-rwanda-yellow text-xl mt-1">□</span>
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.transport && result.transport.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 text-rwanda-green">
              {titles.transport}
            </h3>
            <ul className="space-y-2">
              {result.transport.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                >
                  <span className="text-rwanda-green text-xl mt-1">→</span>
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.timeline && (
          <div className="bg-rwanda-blue bg-opacity-10 dark:bg-rwanda-yellow dark:bg-opacity-10 border border-rwanda-blue dark:border-rwanda-yellow rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2 text-rwanda-blue dark:text-rwanda-yellow">
              {titles.timeline}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {result.timeline}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
