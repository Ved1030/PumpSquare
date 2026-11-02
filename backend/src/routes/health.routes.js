import express from "express";

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "Pumpsquare Chatbot API",
    status: "running",
    timestamp: new Date().toISOString()
  });
});

export default router;