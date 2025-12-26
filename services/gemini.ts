
import { GoogleGenAI, Type } from "@google/genai";
import { ArtistStyle, AdLibResponse } from "../types";

export const generateAdLibs = async (lyrics: string, styles: ArtistStyle[]): Promise<AdLibResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const stylesString = styles.length > 0 ? styles.join(", ") : "General Urban/Hip-Hop";

  const systemInstruction = `You are a world-class record producer and lyric consultant for a major music label. 
  Your task is two-fold:
  1. Provide professional-grade ad-libs that enhance the rhythm, energy, and storytelling of the song.
  2. Analyze the lyrics and suggest stylistic improvements ("lyricSuggestions") that better align with the chosen vibes: ${stylesString}.
  
  Rules for Ad-libs:
  - Insert ad-libs where they feel most natural for the rhythm.
  - Format: Main Lyric (Ad-lib!). 
  - ALWAYS place ad-libs in parentheses.
  - Ensure the ad-libs match the specific energy of ${stylesString}.
  
  Rules for Lyric Analysis:
  - Identify 2-3 lines that could be punchier, more poetic, or better suited to the genre.
  - For Trap/Drill, suggest better slang or rhythmic cadence.
  - For Old School/Boom Bap, suggest better metaphors or rhyme schemes.
  - For Melodic/R&B, suggest smoother phrasing or vocal flourishes.
  
  Return ONLY JSON. Ensure 'annotatedLyrics' uses the 'Main text (Ad-lib!)' pattern.`;

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
            description: "A list of 5-8 short punchy ad-libs."
          },
          vibeAnalysis: {
            type: Type.STRING,
            description: "A brief explanation of the artistic direction."
          },
          signatureCall: {
            type: Type.STRING,
            description: "An intro catchphrase or signature tag."
          },
          lyricSuggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                originalLine: { type: Type.STRING },
                suggestedChange: { type: Type.STRING },
                reason: { type: Type.STRING }
              },
              required: ["originalLine", "suggestedChange", "reason"]
            },
            description: "Suggested changes to the actual lyrics to better match the styles."
          }
        },
        required: ["annotatedLyrics", "generalAdLibs", "vibeAnalysis", "signatureCall", "lyricSuggestions"]
      }
    }
  });

  try {
    const text = response.text;
    return JSON.parse(text) as AdLibResponse;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Failed to generate report. Please check your lyrics and try again.");
  }
};
