"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";
import Loader from "./loader";
import { loadTranslations } from "@/lib/i18n";
import type { Language, Message } from "@/types";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [translations, setTranslations] = useState<any>(null);
  const [language, setLanguage] = useState<Language>("en");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0 && translations) {
      // Initial greeting
      const greetings = {
        en: "Hello! I'm your Smart Farmer assistant. How can I help you today?",
        fr: "Bonjour! Je suis votre assistant Smart Farmer. Comment puis-je vous aider aujourd'hui?",
        rw: "Muraho! Ndi umufasha wawe Smart Farmer. Ni iki nashobora kugufasha uyu munsi?",
      };

      setMessages([
        {
          id: "1",
          role: "assistant",
          content: greetings[language],
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, language, translations, messages.length]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const context = localStorage.getItem("chatbotContext") || "general";
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input,
          language,
          feature: context,
          context: messages.map((m) => `${m.role}: ${m.content}`).join("\n"),
          previousMessages: messages,
        }),
      });

      const data = await res.json();
      if (data.messages && data.messages.length > 0) {
        setMessages((prev) => [...prev, ...data.messages]);
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessages = {
        en: "Sorry, I encountered an error. Please try again.",
        fr: "Désolé, j'ai rencontré une erreur. Veuillez réessayer.",
        rw: "Ihangane, nahuye n'ikosa. Nyamuneka gerageza ukundi.",
      };

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: errorMessages[language],
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!translations) return null;

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-rwanda-blue hover:bg-blue-600 text-white rounded-full p-4 shadow-2xl transition-transform hover:scale-110"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-white dark:bg-dark-bg rounded-xl shadow-2xl border border-light-border dark:border-dark-border transition-all ${
            isMinimized ? "w-80 h-16" : "w-96 h-128"
          } max-w-[calc(100vw-3rem)]`}
        >
          {/* Header */}
          <div className="bg-rwanda-blue text-white p-4 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">
                {translations.chatbot.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-blue-600 p-1 rounded transition-colors"
                aria-label="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-blue-600 p-1 rounded transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="h-[calc(100%-8rem)] overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-rwanda-blue text-white"
                          : "bg-light-surface dark:bg-dark-surface"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-light-surface dark:bg-dark-surface rounded-lg p-3">
                      <Loader size="sm" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-light-border dark:border-dark-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={translations.chatbot.inputPlaceholder}
                    className="flex-1 p-2 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-rwanda-blue text-sm"
                    disabled={loading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="bg-rwanda-blue hover:bg-blue-600 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
                    aria-label="Send"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
