"use client";

import { useRef, useCallback } from "react";
import { Send, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSend, disabled = false, placeholder = "Type your message..." }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const message = textarea.value.trim();
    if (!message || disabled) return;
    
    onSend(message);
    textarea.value = "";
    textarea.style.height = "auto";
  }, [onSend, disabled]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  }, [handleSubmit]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            onKeyDown={handleKeyDown}
            onChange={handleInput}
            disabled={disabled}
            placeholder={placeholder}
            rows={1}
            className={cn(
              "w-full bg-surface border border-line rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted/70 resize-none transition-colors focus:border-primary focus:bg-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
              "pr-12"
            )}
            style={{ minHeight: "44px", maxHeight: "120px" }}
            aria-label="Chat message"
          />
        </div>
        <button
          type="submit"
          disabled={disabled}
          className={cn(
            "flex-shrink-0 p-2.5 rounded-xl transition-colors",
            disabled
              ? "bg-line text-muted/50 cursor-not-allowed"
              : "bg-accent text-white hover:bg-accent-dark"
          )}
          aria-label="Send message"
        >
          <Send className="size-5" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}