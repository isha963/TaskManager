import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

console.log("1. Test file started");

const apiKey = process.env.GEMINI_API_KEY;

console.log("2. API key loaded:", Boolean(apiKey));

const ai = new GoogleGenAI({ apiKey });

async function testGemini() {
  try {
    console.log("3. Sending request to Gemini...");

    const response = await ai.interactions.create(
      {
        model: "gemini-3.8-flash",
        input: "Reply with exactly: Gemini connection successful.",
        store: false,
      },
      {
        timeout_ms: 30000,
      },
    );

    console.log("4. Gemini response:", response.output_text);
  } catch (error) {
    console.error("Gemini error:", error);
  }
}

testGemini();
