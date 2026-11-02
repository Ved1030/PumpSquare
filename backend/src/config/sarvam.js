import { env } from "./env.js";

export const sarvamConfig = {
  apiUrl: "https://api.sarvam.ai/v1/chat/completions",
  model: env.SARVAM_MODEL,
  apiKey: env.SARVAM_API_KEY,
  defaultParams: {
    temperature: 0.2,
    max_tokens: 2000,
  },
  timeout: 30000,
};