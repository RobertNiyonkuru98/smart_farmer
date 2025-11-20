export type Language = "en" | "fr" | "rw";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  imageUrl?: string;
}

export interface AIRequest {
  prompt: string;
  language: Language;
  feature: "pre-planting" | "scan" | "post-harvest" | "weather";
  image?: string;
  context?: string;
  previousMessages?: Message[];
}

export interface AIResponse {
  status: "success" | "error" | "confirmation";
  messages: Message[];
  result?: {
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
  needsConfirmation?: boolean;
  confirmationQuestion?: string;
}

export interface WeatherData {
  current: {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    icon: string;
  };
  forecast: Array<{
    date: string;
    temp: { min: number; max: number };
    condition: string;
    rain: number;
    icon: string;
  }>;
  recommendations: string[];
}

export interface Theme {
  mode: "light" | "dark";
}
