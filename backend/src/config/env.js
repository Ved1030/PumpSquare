import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  SARVAM_API_KEY: z.string().min(10, "SARVAM_API_KEY appears invalid"),
  SARVAM_MODEL: z.string().default("sarvam-105b"),
  FRONTEND_ORIGIN: z.string().url().default("http://localhost:3000"),
  CHAT_MAX_HISTORY: z.coerce.number().int().positive().default(12),
  CHAT_RATE_LIMIT: z.coerce.number().int().positive().default(10),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export const env = parsed.data;