
import { GoogleGenAI, Type } from "@google/genai";
import { Loadout, CoDGame, RuleMode } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }
  return cleaned;
}

export const generateClassWithAI = async (game: CoDGame, lang: 'en' | 'pt', mode: RuleMode): Promise<Loadout> => {
  const isClassic = mode === 'classic';
  
  // Specific constraints based on Mode
  const modeInstruction = isClassic 
    ? `STRICT CLASSIC RULES: 
       - Slots: 1 Primary, 1 Secondary, Lethal, Tactical, and exactly 3 Perks (Slot 1, 2, 3).
       - NO Vests, NO Gloves, NO Boots, NO Gear, NO Field Upgrades.
       - Focus on iconic era-appropriate attachments (1-2 max per weapon for old games).`
    : `MODERN RULES: 
       - Full Access: Vest, Primary, Secondary, Lethal, Tactical, Field Upgrade, Gloves, Boots, Gear, Specialty/Wildcards.
       - Use Gunsmith-style attachments (up to 5-8 per weapon).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a valid, fun, and random multiplayer class for ${game.name}.
    ${modeInstruction}
    IMPORTANT: Respond in ${lang === 'en' ? 'English' : 'Portuguese'}.
    Return ONLY JSON.`,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 4000 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          primary: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              category: { type: Type.STRING },
              attachments: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["name", "category", "attachments"]
          },
          secondary: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              category: { type: Type.STRING },
              attachments: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["name", "category", "attachments"]
          },
          lethal: { type: Type.ARRAY, items: { type: Type.STRING } },
          tactical: { type: Type.ARRAY, items: { type: Type.STRING } },
          perks: {
            type: Type.OBJECT,
            properties: {
              slot1: { type: Type.ARRAY, items: { type: Type.STRING } },
              slot2: { type: Type.ARRAY, items: { type: Type.STRING } },
              slot3: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["slot1", "slot2", "slot3"]
          },
          // Modern slots (optional in schema, prompt controls generation)
          vest: { type: Type.STRING },
          gloves: { type: Type.STRING },
          boots: { type: Type.STRING },
          gear: { type: Type.ARRAY, items: { type: Type.STRING } },
          fieldUpgrade: { type: Type.STRING },
          specialty: { type: Type.STRING },
          wildcards: { type: Type.ARRAY, items: { type: Type.STRING } },
          scorestreaks: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: { name: { type: Type.STRING } }
            } 
          },
          observations: { type: Type.STRING }
        },
        required: ["primary", "secondary", "perks"]
      }
    }
  });

  try {
    const cleanedJson = cleanJsonResponse(response.text);
    const parsed = JSON.parse(cleanedJson) as Loadout;
    
    // Server-side cleanup to enforce rules just in case
    if (isClassic) {
      delete parsed.vest;
      delete parsed.gloves;
      delete parsed.boots;
      delete parsed.gear;
      delete parsed.fieldUpgrade;
      delete parsed.specialty;
    }

    return { ...parsed, ruleMode: mode };
  } catch (e) {
    console.error("JSON Parse Error", e);
    throw e;
  }
};

export const chatWithGemini = async (messages: {role: string, content: string}[], gameName: string, lang: 'en' | 'pt') => {
  const instruction = `You are a CoD strategist. Respond to questions about ${gameName} in ${lang === 'en' ? 'English' : 'Portuguese'}. Be tactical and helpful.`;
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: { systemInstruction: instruction },
  });
  const lastMessage = messages[messages.length - 1];
  const response = await chat.sendMessage({ message: lastMessage.content });
  return response.text;
};
