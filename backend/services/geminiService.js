import { GoogleGenerativeAI } from "@google/generative-ai";
import { safeJsonParse } from "../utils/jsonUtils.js";

function getCandidateModels() {
  return [...new Set([
    process.env.GEMINI_MODEL,
    "gemini-2.5-flash",
    "gemini-flash-latest",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite"
  ].filter(Boolean))];
}

function normalizeJsonString(text) {
  return String(text || "").trim();
}

export async function generateStructuredJson({ prompt, fallback, temperature = 0.25 }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return fallback();
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError = null;

  for (const modelName of getCandidateModels()) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature,
          responseMimeType: "application/json"
        }
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = normalizeJsonString(response.text());
      const parsed = safeJsonParse(text);

      if (parsed) {
        return parsed;
      }

      lastError = new Error(`Gemini returned invalid JSON for model ${modelName}`);
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    console.error("Gemini request failed:", lastError);
  }

  return fallback();
}