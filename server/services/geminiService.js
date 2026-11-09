import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured.");
}

const ai = new GoogleGenAI({ apiKey });

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

const MAX_ATTEMPTS = 3;
const BASE_DELAY = 1000;

const isRetryableError = (error) => {
  const status = error.status ?? error.statusCode;

  // Retry temporary HTTP errors
  if ([408, 429, 500, 502, 503, 504].includes(status)) {
    return true;
  }

  // Retry temporary network failures
  if (!status && error.name !== "SyntaxError") {
    return (
      error.code === "ECONNRESET" ||
      error.code === "ETIMEDOUT" ||
      error.code === "ECONNREFUSED" ||
      error.code === "EAI_AGAIN"
    );
  }

  return false;
};

const isQuotaError = (error) => {
  const message = error.message?.toLowerCase() ?? "";

  return (
    (error.status ?? error.statusCode) === 429 &&
    (message.includes("quota") ||
      message.includes("daily") ||
      message.includes("resource_exhausted"))
  );
};

export const generateWithGemini = async (prompt) => {
  if (!prompt || typeof prompt !== "string") {
    throw new Error("A valid prompt is required.");
  }

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
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

      if (!response.output_text) {
        throw new Error("Gemini returned an empty response.");
      }

      const result = JSON.parse(response.output_text);

      if (!Array.isArray(result.tasks)) {
        throw new Error("Gemini returned an invalid task plan.");
      }

      return result;
    } catch (error) {
      const status = error.status ?? error.statusCode;

      console.error("Gemini service error:", {
        status,
        message: error.message,
        attempt,
      });

      if (isQuotaError(error)) {
        throw new Error(
          "AI daily request limit reached. Please try again later.",
        );
      }

      if (!isRetryableError(error) || attempt === MAX_ATTEMPTS) {
        throw error;
      }

      const waitTime = BASE_DELAY * 2 ** (attempt - 1);
      await delay(waitTime);
    }
  }

  throw new Error("Unable to generate a task plan.");
};
