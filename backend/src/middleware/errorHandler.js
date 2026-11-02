import { env } from "../config/env.js";

export function errorHandler(err, req, res, next) {
  console.error(`[${new Date().toISOString()}] Error:`, err.message);
  
  if (env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      error: "Validation error",
      details: err.errors
    });
  }

  if (err.name === "SarvamServiceError") {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: "AI service temporarily unavailable",
      message: "I'm temporarily unable to respond. Please try again in a moment or contact our team directly."
    });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      error: "Request body too large"
    });
  }

  return res.status(500).json({
    success: false,
    error: "Internal server error",
    message: "An unexpected error occurred. Please try again later."
  });
}

export function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    error: "Endpoint not found"
  });
}