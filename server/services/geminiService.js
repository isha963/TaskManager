import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateWithGemini = async (prompt) => {
  const response = await ai.interactions.create({
    model: "gemini-3.8-flash",
    input: prompt,
    store: false,
  });

  return response.output_text;
};
