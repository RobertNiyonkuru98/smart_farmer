import { NextRequest, NextResponse } from "next/server";
import type { WeatherData } from "@/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const location = searchParams.get("location") || "Kigali";
  const language = searchParams.get("language") || "en";

  // Mock weather data - Replace with real weather API
  // To use real weather API (e.g., OpenWeatherMap):
  /*
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`
  );
  const data = await response.json();
  */

  const mockWeatherData: WeatherData = {
    current: {
      temp: 22,
      condition:
        language === "en"
          ? "Partly Cloudy"
          : language === "fr"
          ? "Partiellement nuageux"
          : "Ibicu bike",
      humidity: 65,
      windSpeed: 12,
      icon: "cloud",
    },
    forecast: [
      {
        date:
          language === "en"
            ? "Today"
            : language === "fr"
            ? "Aujourd'hui"
            : "Uyu munsi",
        temp: { min: 18, max: 25 },
        condition:
          language === "en"
            ? "Partly Cloudy"
            : language === "fr"
            ? "Partiellement nuageux"
            : "Ibicu bike",
        rain: 0,
        icon: "cloud",
      },
      {
        date:
          language === "en" ? "Tomorrow" : language === "fr" ? "Demain" : "Ejo",
        temp: { min: 17, max: 24 },
        condition:
          language === "en"
            ? "Light Rain"
            : language === "fr"
            ? "Pluie légère"
            : "Imvura yoroheje",
        rain: 5,
        icon: "rain",
      },
      {
        date:
          language === "en"
            ? "Day 3"
            : language === "fr"
            ? "Jour 3"
            : "Umunsi wa 3",
        temp: { min: 16, max: 23 },
        condition:
          language === "en" ? "Rain" : language === "fr" ? "Pluie" : "Imvura",
        rain: 15,
        icon: "rain",
      },
      {
        date:
          language === "en"
            ? "Day 4"
            : language === "fr"
            ? "Jour 4"
            : "Umunsi wa 4",
        temp: { min: 18, max: 26 },
        condition:
          language === "en"
            ? "Sunny"
            : language === "fr"
            ? "Ensoleillé"
            : "Izuba",
        rain: 0,
        icon: "sun",
      },
      {
        date:
          language === "en"
            ? "Day 5"
            : language === "fr"
            ? "Jour 5"
            : "Umunsi wa 5",
        temp: { min: 19, max: 27 },
        condition:
          language === "en"
            ? "Sunny"
            : language === "fr"
            ? "Ensoleillé"
            : "Izuba",
        rain: 0,
        icon: "sun",
      },
      {
        date:
          language === "en"
            ? "Day 6"
            : language === "fr"
            ? "Jour 6"
            : "Umunsi wa 6",
        temp: { min: 18, max: 25 },
        condition:
          language === "en"
            ? "Cloudy"
            : language === "fr"
            ? "Nuageux"
            : "Ibicu",
        rain: 2,
        icon: "cloud",
      },
      {
        date:
          language === "en"
            ? "Day 7"
            : language === "fr"
            ? "Jour 7"
            : "Umunsi wa 7",
        temp: { min: 17, max: 24 },
        condition:
          language === "en"
            ? "Light Rain"
            : language === "fr"
            ? "Pluie légère"
            : "Imvura yoroheje",
        rain: 8,
        icon: "rain",
      },
    ],
    recommendations: getRecommendations(language),
  };

  return NextResponse.json(mockWeatherData);
}

function getRecommendations(language: string): string[] {
  const recommendations = {
    en: [
      "Light rain expected tomorrow - good time for planting seeds",
      "Prepare drainage systems before heavier rains on day 3",
      "Days 4-5 will be sunny - ideal for harvesting mature crops",
      "Apply fertilizer before the rain on day 2 for better absorption",
      "Cover sensitive crops during heavy rain periods",
    ],
    fr: [
      "Pluie légère prévue demain - bon moment pour planter des graines",
      "Préparez les systèmes de drainage avant les pluies plus fortes du jour 3",
      "Les jours 4-5 seront ensoleillés - idéal pour récolter les cultures matures",
      "Appliquez de l'engrais avant la pluie du jour 2 pour une meilleure absorption",
      "Couvrez les cultures sensibles pendant les périodes de fortes pluies",
    ],
    rw: [
      "Imvura yoroheje iteganijwe ejo - ni igihe cyiza cyo gutera imbuto",
      "Tegura sisitemu yo kuva amazi mbere y'imvura nyinshi ku munsi wa 3",
      "Iminsi ya 4-5 izaba iy'izuba - byiza gusarura ibihingwa byeze",
      "Shyira ifumbire mbere y'imvura ku munsi wa 2 kugirango ibone neza",
      "Huga ibihingwa byoroshye mu gihe cy'imvura nyinshi",
    ],
  };

  return (
    recommendations[language as keyof typeof recommendations] ||
    recommendations.en
  );
}
