"use client";

import { cn } from "@/lib/utils";
import ChatActionButton from "./ChatActionButton";

interface Message {
  role: "user" | "assistant";
  content: string;
  actions?: Array<{
    type: "product" | "contact" | "quote";
    label: string;
    href: string;
  }>;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 mb-4", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
          isUser
            ? "bg-accent text-white"
            : "bg-primary text-white"
        )}
        aria-hidden="true"
      >
        {isUser ? "U" : "AI"}
      </div>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-white rounded-tr-none"
            : "bg-white text-ink rounded-tl-none shadow-sm border border-line"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.actions && message.actions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2" role="list" aria-label="Suggested actions">
            {message.actions.map((action, index) => (
              <ChatActionButton
                key={`${action.type}-${index}`}
                type={action.type}
                label={action.label}
                href={action.href}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}