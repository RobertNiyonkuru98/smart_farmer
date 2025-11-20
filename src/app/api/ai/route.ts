import { NextRequest, NextResponse } from "next/server";
import type { AIRequest, AIResponse, Message } from "@/types";
import { getPromptForFeature } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  try {
    const body: AIRequest = await request.json();
    const { prompt, language, feature, image, context, previousMessages } =
      body;

    // Check if this is a follow-up after confirmation
    const isConfirmed = Boolean(
      previousMessages &&
        previousMessages.length > 0 &&
        prompt.toLowerCase().includes("confirmed")
    );

    // Mock AI response - Replace with real AI provider
    // To use real AI, uncomment the appropriate section below

    /*
    // OPENAI IMPLEMENTATION
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: getPromptForFeature(feature, language) },
          ...previousMessages || [],
          {
            role: 'user',
            content: image
              ? [{ type: 'text', text: prompt }, { type: 'image_url', image_url: { url: image } }]
              : prompt
          }
        ],
        max_tokens: 1000,
      }),
    });
    const data = await openaiResponse.json();
    const aiContent = data.choices[0].message.content;
    */

    /*
    // ANTHROPIC IMPLEMENTATION
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          ...previousMessages || [],
          {
            role: 'user',
            content: image
              ? [
                  { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: image.split(',')[1] } },
                  { type: 'text', text: prompt }
                ]
              : prompt
          }
        ],
        system: getPromptForFeature(feature, language),
      }),
    });
    const data = await anthropicResponse.json();
    const aiContent = data.content[0].text;
    */

    // MOCK IMPLEMENTATION (Remove when using real AI)
    const mockResponses = getMockResponse(
      feature,
      language,
      isConfirmed,
      prompt,
      image
    );

    const response: AIResponse = {
      status: mockResponses.status,
      messages: mockResponses.messages,
      result: mockResponses.result,
      needsConfirmation: mockResponses.needsConfirmation,
      confirmationQuestion: mockResponses.confirmationQuestion,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("AI API Error:", error);
    return NextResponse.json(
      {
        status: "error",
        messages: [
          {
            role: "assistant",
            content: "Error processing request",
            timestamp: new Date(),
          },
        ],
      },
      { status: 500 }
    );
  }
}

function getMockResponse(
  feature: string,
  language: string,
  isConfirmed: boolean,
  prompt: string,
  image?: string
): AIResponse {
  const timestamp = new Date();

  if (!isConfirmed && image) {
    // First interaction - ask for confirmation
    const confirmations = {
      en: {
        "pre-planting":
          "I can see what appears to be soil with clay content. Is this the field you want to analyze for planting?",
        scan: "I can see a crop leaf with some discoloration. Is this the plant you want me to diagnose?",
        "post-harvest":
          "I understand you need help with post-harvest handling. Can you confirm the details?",
        weather: "Let me check the weather for your area.",
      },
      fr: {
        "pre-planting":
          "Je peux voir ce qui semble être un sol avec une teneur en argile. Est-ce le champ que vous souhaitez analyser pour la plantation?",
        scan: "Je peux voir une feuille de culture avec une décoloration. Est-ce la plante que vous voulez que je diagnostique?",
        "post-harvest":
          "Je comprends que vous avez besoin d'aide pour la manipulation post-récolte. Pouvez-vous confirmer les détails?",
        weather: "Laissez-moi vérifier la météo pour votre région.",
      },
      rw: {
        "pre-planting":
          "Ndabona nkaho ari ubutaka bufite ibumba. Ni urwo rwuri rurimwe ushaka gusesengura kugirango utereke?",
        scan: "Ndabona ikibabi cy'igihingwa gifite amabara atandukanye. Ni kiriya gihingwa ushaka ko nkagereranya?",
        "post-harvest":
          "Ndabyumva ko ukeneye ubufasha ku bijyanye no kubika umusaruro. Urashobora kwemeza ibisobanuro?",
        weather: "Reka nsuzume ibihe by'ikirere mu karere kawe.",
      },
    };

    return {
      status: "confirmation",
      messages: [
        {
          id: Math.random().toString(),
          role: "assistant",
          content:
            confirmations[language as keyof typeof confirmations][
              feature as keyof typeof confirmations.en
            ] || confirmations.en[feature as keyof typeof confirmations.en],
          timestamp,
        },
      ],
      needsConfirmation: true,
      confirmationQuestion:
        confirmations[language as keyof typeof confirmations][
          feature as keyof typeof confirmations.en
        ] || confirmations.en[feature as keyof typeof confirmations.en],
    };
  }

  // Confirmed - provide detailed response
  const responses = {
    "pre-planting": {
      en: {
        diagnosis: "Clay-rich soil with moderate drainage",
        recommendations: [
          "Add organic matter (compost) to improve soil structure",
          "Consider planting beans, potatoes, or cassava",
          "pH level appears suitable for most crops (6.0-7.0)",
          "Apply NPK fertilizer at 50kg per hectare before planting",
        ],
        timeline: "2-3 weeks preparation recommended before planting",
        inputs: [
          "Organic compost (2 tons/hectare)",
          "NPK 17-17-17 (50kg/hectare)",
          "Seeds for selected crop",
        ],
      },
      fr: {
        diagnosis: "Sol riche en argile avec drainage modéré",
        recommendations: [
          "Ajouter de la matière organique (compost) pour améliorer la structure du sol",
          "Envisager de planter des haricots, des pommes de terre ou du manioc",
          "Le niveau de pH semble approprié pour la plupart des cultures (6,0-7,0)",
          "Appliquer de l'engrais NPK à 50 kg par hectare avant la plantation",
        ],
        timeline:
          "2-3 semaines de préparation recommandées avant la plantation",
        inputs: [
          "Compost organique (2 tonnes/hectare)",
          "NPK 17-17-17 (50kg/hectare)",
          "Semences pour la culture sélectionnée",
        ],
      },
      rw: {
        diagnosis: "Ubutaka bwuzuye ibumba bufite imyuzure y'amazi",
        recommendations: [
          "Ongeramo ibyifu byimbitse (compost) kugirango utezimbere imiterere y'ubutaka",
          "Tekereza gutera ibishyimbo, ibirayi, cyangwa imyumbati",
          "Urugero rwa pH rugaragara rukwiriye ibihingwa byinshi (6.0-7.0)",
          "Gukoresha ifumbire NPK ku kigero cya 50kg kuri hegitari mbere yo gutera",
        ],
        timeline: "Ibyumweru 2-3 byo gutegura bisabwa mbere yo gutera",
        inputs: [
          "Compost kamere (toni 2 kuri hegitari)",
          "NPK 17-17-17 (50kg/hegitari)",
          "Imbuto z'igihingwa wahisemo",
        ],
      },
    },
    scan: {
      en: {
        diagnosis: "Bacterial leaf blight detected with moderate severity",
        recommendations: [
          "Remove and destroy infected leaves immediately",
          "Apply copper-based bactericide",
          "Improve air circulation between plants",
          "Avoid overhead watering",
        ],
        timeline: "Treatment should begin within 24 hours",
        actions: [
          "Prune infected areas",
          "Apply treatment every 5-7 days",
          "Monitor for 2-3 weeks",
        ],
        preventions: [
          "Use disease-resistant varieties",
          "Maintain proper plant spacing",
          "Practice crop rotation",
          "Ensure good drainage",
        ],
      },
      fr: {
        diagnosis:
          "Brûlure bactérienne des feuilles détectée avec une gravité modérée",
        recommendations: [
          "Retirer et détruire immédiatement les feuilles infectées",
          "Appliquer un bactéricide à base de cuivre",
          "Améliorer la circulation d'air entre les plantes",
          "Éviter l'arrosage par aspersion",
        ],
        timeline: "Le traitement devrait commencer dans les 24 heures",
        actions: [
          "Tailler les zones infectées",
          "Appliquer le traitement tous les 5-7 jours",
          "Surveiller pendant 2-3 semaines",
        ],
        preventions: [
          "Utiliser des variétés résistantes aux maladies",
          "Maintenir un espacement approprié des plantes",
          "Pratiquer la rotation des cultures",
          "Assurer un bon drainage",
        ],
      },
      rw: {
        diagnosis: "Indwara y'ibiti ibirenze urugero rwo hagati yabonetse",
        recommendations: [
          "Kuraho no gusenya amababi yanduye ako kanya",
          "Gukoresha umuti urwanya bagiteri uzingiye ku munyu",
          "Guteza imbere uburyo umwuka unyuramo hagati y'ibihingwa",
          "Kwirinda gusukura hejuru y'ibimera",
        ],
        timeline: "Umuti ugomba gutangira mu masaha 24",
        actions: [
          "Guca ibice byanduye",
          "Gukoresha umuti buri minsi 5-7",
          "Gukurikirana mu byumweru 2-3",
        ],
        preventions: [
          "Gukoresha ubwoko burwanya indwara",
          "Kubika intera nziza hagati y'ibihingwa",
          "Gukurikiza uburyo bwo guhinduranya ibihingwa",
          "Kwita ku myuzure myiza y'amazi",
        ],
      },
    },
    "post-harvest": {
      en: {
        storage: [
          "Store in a cool, dry place (15-20°C)",
          "Use ventilated containers",
          "Keep humidity below 60%",
          "Check regularly for spoilage",
        ],
        packaging: [
          "Use clean, food-grade plastic crates",
          "Layer with dry straw or paper",
          "Maximum weight: 20kg per container",
          "Label with date and origin",
        ],
        transport: [
          "Use covered vehicles",
          "Transport during cooler hours (early morning)",
          "Estimated time: 2-3 hours",
          "Avoid direct sunlight",
          "Secure load to prevent damage",
        ],
        timeline: "Best consumed within 5-7 days after harvest",
      },
      fr: {
        storage: [
          "Stocker dans un endroit frais et sec (15-20°C)",
          "Utiliser des conteneurs ventilés",
          "Maintenir l'humidité en dessous de 60%",
          "Vérifier régulièrement la détérioration",
        ],
        packaging: [
          "Utiliser des caisses en plastique propres de qualité alimentaire",
          "Superposer avec de la paille sèche ou du papier",
          "Poids maximum: 20kg par conteneur",
          "Étiqueter avec la date et l'origine",
        ],
        transport: [
          "Utiliser des véhicules couverts",
          "Transporter pendant les heures plus fraîches (tôt le matin)",
          "Temps estimé: 2-3 heures",
          "Éviter la lumière directe du soleil",
          "Sécuriser la charge pour éviter les dommages",
        ],
        timeline: "Meilleure consommation dans les 5-7 jours après la récolte",
      },
      rw: {
        storage: [
          "Bika ahantu hakonje kandi h'umutse (15-20°C)",
          "Gukoresha ibikoresho bifite umwuka unyuramo",
          "Gufata ubushuhe munsi ya 60%",
          "Kureba buri gihe niba byangiritse",
        ],
        packaging: [
          "Gukoresha amasanduku yisukuye akwiriye ibiryo",
          "Gushyiraho urufyanyuma n'impapuro nziza",
          "Uburemere ntarengwa: 20kg kuri buri gikoresho",
          "Kwandika itariki n'aho bikomoka",
        ],
        transport: [
          "Gukoresha imodoka zifite igifuniko",
          "Gutwara mu masaha akonje (mu gitondo cya kare)",
          "Igihe cyateganijwe: amasaha 2-3",
          "Kwirinda izuba ryazuye",
          "Guhuza umutwaro neza kugirango utagira inenge",
        ],
        timeline: "Byiza kubikoreshwa mu minsi 5-7 nyuma yo gusarura",
      },
    },
  };

  const featureResponses = responses[feature as keyof typeof responses];
  if (!featureResponses) {
    return {
      status: "error",
      messages: [
        {
          id: Math.random().toString(),
          role: "assistant",
          content: "Feature not supported",
          timestamp,
        },
      ],
    };
  }

  const langResponse =
    featureResponses[language as keyof typeof featureResponses] ||
    featureResponses.en;

  const assistantMessage: Message = {
    id: Math.random().toString(),
    role: "assistant",
    content:
      language === "en"
        ? "Based on my analysis, here are my recommendations:"
        : language === "fr"
        ? "Basé sur mon analyse, voici mes recommandations:"
        : "Ukurikije isesengura ryanjye, dore icyo nkugira inama:",
    timestamp,
  };

  return {
    status: "success",
    messages: [assistantMessage],
    result: langResponse,
  };
}
