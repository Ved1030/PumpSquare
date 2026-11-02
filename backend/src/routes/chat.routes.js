import express from "express";
import { processChat, createWelcomeMessage } from "../services/chatbot.service.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { chatRequestSchema } from "../middleware/validateRequest.js";
import { chatRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/chat", chatRateLimiter, validateRequest(chatRequestSchema), async (req, res) => {
  try {
    const { messages } = req.validatedBody;
    
    const result = await processChat(messages);
    
    if (result.success) {
      return res.json({
        success: true,
        reply: result.reply,
        actions: result.actions
      });
    } else {
      return res.status(503).json({
        success: false,
        error: "AI service unavailable",
        message: result.reply
      });
    }
  } catch (error) {
    console.error("Chat endpoint error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      message: "An unexpected error occurred. Please try again later."
    });
  }
});

router.get("/welcome", (req, res) => {
  const welcome = createWelcomeMessage();
  res.json({
    success: true,
    reply: welcome.reply,
    actions: welcome.actions
  });
});

export default router;