import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

export const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: env.CHAT_RATE_LIMIT,
  message: {
    success: false,
    error: "Too many requests. Please wait a moment before sending another message."
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  skip: (req) => env.NODE_ENV === "test",
});

export const generalRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: "Too many requests from this IP. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
});