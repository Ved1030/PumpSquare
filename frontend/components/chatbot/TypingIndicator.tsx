"use client";

import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  message?: string;
}

export default function TypingIndicator({ message = "Pumpsquare AI is typing..." }: TypingIndicatorProps) {
  return (
    <div className="flex gap-3 mb-4" aria-live="polite" aria-label="Typing indicator">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white" aria-hidden="true">
        AI
      </div>
      <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-line">
        <div className="flex items-center gap-1.5" role="status">
          <span className="text-xs text-muted">{message}</span>
          <div className="flex gap-1 ml-2" aria-hidden="true">
            <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    </div>
  );
}