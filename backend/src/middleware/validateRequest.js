import { z } from "zod";

export const chatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(2000)
    })
  ).min(1).max(20),
});

export function validateRequest(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.validatedBody = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: error.errors.map(e => ({
            field: e.path.join("."),
            message: e.message
          }))
        });
      }
      return res.status(400).json({
        success: false,
        error: "Invalid request body"
      });
    }
  };
}

export function sanitizeMessageContent(content) {
  return content.trim().slice(0, 2000);
}

export function validateMessageRole(role) {
  return ["user", "assistant"].includes(role);
}