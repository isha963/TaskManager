import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const taskPlanSchema = {
  type: "object",
  properties: {
    tasks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          priority: {
            type: "string",
            enum: ["Low", "Medium", "High"],
          },
          dueDate: { type: "string" },
          subtasks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                completed: { type: "boolean" },
              },
              required: ["title", "completed"],
            },
          },
        },
        required: ["title", "description", "priority", "dueDate", "subtasks"],
      },
    },
  },
  required: ["tasks"],
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const generateWithGemini = async (prompt) => {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await ai.interactions.create({
        model: "gemini-3.8-flash",
        input: prompt,
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema: taskPlanSchema,
        },
        store: false,
      });

      return JSON.parse(response.output_text);
    } catch (error) {
      const isTemporary =
        error.status === 503 || error.status === 429 || error.status >= 500;

      if (!isTemporary || attempt === maxAttempts) {
        throw error;
      }

      await delay(1000 * 2 ** (attempt - 1));
    }
  }
};