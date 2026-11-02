"use client";

import { MessageSquare, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatbotButtonProps {
  onToggle: () => void;
  isOpen: boolean;
  isMinimized: boolean;
  isLoading?: boolean;
  unreadCount?: number;
}

export default function ChatbotButton({
  onToggle,
  isOpen,
  isMinimized,
  isLoading = false,
  unreadCount = 0,
}: ChatbotButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-[0_8px_30px_rgba(245,166,35,0.4)] transition-all duration-300 flex items-center justify-center",
        "bg-accent text-white hover:bg-accent-dark hover:shadow-[0_12px_40px_rgba(245,166,35,0.5)]",
        isOpen && "scale-95",
        isMinimized && "animate-pulse"
      )}
      aria-label={isOpen ? "Minimize chat" : "Open chat with Pumpsquare AI Assistant"}
      aria-expanded={isOpen}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="size-7 animate-spin" aria-hidden="true" />
      ) : isOpen ? (
        <X className="size-7" aria-hidden="true" />
      ) : (
        <MessageSquare className="size-7" aria-hidden="true" />
      )}
      {unreadCount > 0 && !isOpen && (
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-bounce">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
}