import { sarvamConfig } from "../config/sarvam.js";
import { env } from "../config/env.js";

export class SarvamServiceError extends Error {
  constructor(message, code, statusCode = 500, details = {}) {
    super(message);
    this.name = "SarvamServiceError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

function logError(context, error, details = {}) {
  if (env.NODE_ENV === "development") {
    console.error(`[Sarvam Error] ${context}:`, {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      ...details,
    });
  }
}

export async function callSarvamApi(messages) {
  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), sarvamConfig.timeout);

  try {
    const response = await fetch(sarvamConfig.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": sarvamConfig.apiKey,
      },
      body: JSON.stringify({
        model: sarvamConfig.model,
        messages,
        ...sarvamConfig.defaultParams,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      const errorDetails = {
        status: response.status,
        statusText: response.statusText,
        duration,
        model: sarvamConfig.model,
        requestId: response.headers.get("x-request-id") || errorData.request_id,
        errorBody: errorData,
      };

      if (response.status === 401) {
        throw new SarvamServiceError(
          "Invalid API credentials",
          "INVALID_CREDENTIALS",
          401,
          errorDetails
        );
      }
      if (response.status === 402) {
        throw new SarvamServiceError(
          "Insufficient API credits",
          "INSUFFICIENT_CREDITS",
          402,
          errorDetails
        );
      }
      if (response.status === 429) {
        throw new SarvamServiceError(
          "Rate limit exceeded",
          "RATE_LIMITED",
          429,
          errorDetails
        );
      }
      if (response.status >= 500) {
        throw new SarvamServiceError(
          "Sarvam AI service temporarily unavailable",
          "SERVICE_UNAVAILABLE",
          503,
          errorDetails
        );
      }

      throw new SarvamServiceError(
        errorData.message || "Sarvam API error",
        "API_ERROR",
        response.status,
        errorDetails
      );
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new SarvamServiceError(
        "Invalid response format from Sarvam API",
        "INVALID_RESPONSE",
        500,
        { duration, model: sarvamConfig.model, response: data }
      );
    }

    const content = data.choices[0].message.content;
    const finishReason = data.choices[0].finish_reason;

    if (content === null || content === undefined) {
      throw new SarvamServiceError(
        "Sarvam returned empty content",
        "EMPTY_CONTENT",
        500,
        { 
          duration, 
          model: sarvamConfig.model, 
          finishReason,
          requestId: data.id,
          usage: data.usage
        }
      );
    }

    if (env.NODE_ENV === "development") {
      console.log(`[Sarvam] Request completed in ${duration}ms`, {
        model: sarvamConfig.model,
        finishReason,
        contentLength: content.length,
        requestId: data.id,
        usage: data.usage,
      });
    }

    return content;
  } catch (error) {
    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;
    
    if (error.name === "AbortError" || error.name === "TimeoutError") {
      throw new SarvamServiceError(
        "Request timeout",
        "TIMEOUT",
        504,
        { duration }
      );
    }
    
    if (error instanceof SarvamServiceError) {
      logError("Sarvam API error", error, { duration });
      throw error;
    }
    
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new SarvamServiceError(
        "Network error connecting to Sarvam API",
        "NETWORK_ERROR",
        503,
        { duration }
      );
    }

    logError("Unexpected error", error, { duration });
    throw new SarvamServiceError(
      "Failed to communicate with Sarvam AI",
      "UNKNOWN_ERROR",
      500,
      { duration, originalError: error.message }
    );
  }
}

export function parseSarvamResponse(content) {
  if (!content || typeof content !== "string") {
    return null;
  }

  try {
    const parsed = JSON.parse(content);
    
    if (
      typeof parsed.reply !== "string" ||
      !Array.isArray(parsed.productIds) ||
      typeof parsed.showContact !== "boolean" ||
      typeof parsed.showQuote !== "boolean"
    ) {
      throw new Error("Invalid response structure");
    }
    
    return {
      reply: parsed.reply,
      productIds: parsed.productIds,
      showContact: parsed.showContact,
      showQuote: parsed.showQuote
    };
  } catch (error) {
    return null;
  }
}

export function extractJsonFromText(text) {
  if (!text || typeof text !== "string") return null;
  
  try {
    return JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function callSarvamWithRetry(messages, maxRetries = 1) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const content = await callSarvamApi(messages);
      
      let parsed = parseSarvamResponse(content);
      
      if (!parsed) {
        parsed = parseSarvamResponse(extractJsonFromText(content));
      }
      
      if (parsed) {
        return parsed;
      }
      
      if (attempt < maxRetries) {
        if (env.NODE_ENV === "development") {
          console.log(`[Sarvam] Retry ${attempt + 1}/${maxRetries} - invalid JSON response`);
        }
        const correctiveMessage = {
          role: "user",
          content: "Your previous response was not valid JSON. Please respond ONLY with a valid JSON object in the exact format specified in the system prompt. No additional text, no markdown."
        };
        messages = [...messages, correctiveMessage];
        continue;
      }
      
      throw new SarvamServiceError(
        "Invalid JSON response from AI after retries",
        "INVALID_JSON",
        500,
        { attempts: attempt + 1 }
      );
    } catch (error) {
      lastError = error;
      if (error instanceof SarvamServiceError && error.code !== "INVALID_JSON") {
        throw error;
      }
    }
  }
  
  throw lastError;
}