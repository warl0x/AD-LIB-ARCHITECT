
import { GoogleGenAI, Type } from "@google/genai";
import { ArtistStyle, AdLibResponse } from "../types";

export const generateAdLibs = async (lyrics: string, style: ArtistStyle): Promise<AdLibResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const systemInstruction = `You are a world-class record producer and ad-lib specialist for a major music label. 
  Your task is to take raw lyrics and provide professional-grade ad-libs that enhance the rhythm, energy, and storytelling of the song.
  
  Rules:
  1. Insert ad-libs at the end of lines or in pauses where they make musical sense.
  2. Use format: Lyric text (Ad-lib!).
  3. Ad-libs should match the specific music style provided: ${style}.
  4. Provide a "signatureCall" (a catchphrase for the intro).
  5. Provide a list of "generalAdLibs" that can be used throughout.
  6. Provide a brief "vibeAnalysis" of why these ad-libs work for this style.
  7. Return ONLY JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Lyrics to process:\n\n${lyrics}`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          annotatedLyrics: {
            type: Type.STRING,
            description: "The full lyrics with ad-libs in parentheses."
          },
          generalAdLibs: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 5-8 short punchy ad-libs like 'Skrrt', 'Pah', etc."
          },
          vibeAnalysis: {
            type: Type.STRING,
            description: "A brief explanation of the artistic direction."
          },
          signatureCall: {
            type: Type.STRING,
            description: "An intro catchphrase or signature tag."
          }
        },
        required: ["annotatedLyrics", "generalAdLibs", "vibeAnalysis", "signatureCall"]
      }
    }
  });

  try {
    const text = response.text;
    return JSON.parse(text) as AdLibResponse;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Failed to generate ad-libs. Please try again.");
  }
};
