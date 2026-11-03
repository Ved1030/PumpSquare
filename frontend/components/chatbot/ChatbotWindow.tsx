"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { X, Minimize2, Maximize2, Bot, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import WelcomeMessage from "./WelcomeMessage";

interface ChatbotWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  apiUrl: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  actions?: Array<{
    type: "product" | "contact" | "quote";
    label: string;
    href: string;
  }>;
}

export default function ChatbotWindow({ isOpen, onClose, onMinimize, apiUrl }: ChatbotWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const sendMessage = async (content: string) => {
    if (isLoading) return;

    const userMessage: Message = { role: "user", content };
    setMessages(prev => [...prev, userMessage]);
    setShowWelcome(false);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.reply,
          actions: data.actions,
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        setError(data.message || "Failed to get response. Please try again.");
        setMessages(prev => [...prev, { role: "assistant", content: data.message || "I'm temporarily unable to respond. Please try again in a moment or contact our team directly." }]);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setMessages(prev => [...prev, { role: "assistant", content: "I'm temporarily unable to respond. Please try again in a moment or contact our team directly." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (message: string) => {
    sendMessage(message);
  };

  const clearChat = () => {
    setMessages([]);
    setShowWelcome(true);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-[10000] w-full max-w-[420px] h-[500px] sm:h-[550px] lg:h-[600px] max-h-[calc(100dvh-100px)]",
        "bg-white rounded-2xl shadow-[0_25px_50px_rgba(0,59,92,0.4)] border border-line overflow-hidden flex flex-col animate-rise"
      )}
      role="dialog"
      aria-label="Pumpsquare AI Assistant"
      aria-modal="true"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Bot className="size-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-ink">Pumpsquare AI Assistant</h2>
            <p className="text-xs text-muted">How can we help you?</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onMinimize}
            className="p-2 rounded-lg text-muted hover:bg-surface hover:text-ink transition-colors"
            aria-label="Minimize chat"
          >
            <Minimize2 className="size-5" aria-hidden="true" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted hover:bg-surface hover:text-ink transition-colors"
            aria-label="Close chat"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {showWelcome && messages.length === 0 ? (
          <WelcomeMessage onSuggestionClick={handleSuggestionClick} />
        ) : (
          <>
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
            {error && (
              <div className="flex gap-3 mb-4" role="alert">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold text-red-600" aria-hidden="true">
                  !
                </div>
                <div className="bg-red-50 rounded-2xl rounded-tl-none px-4 py-3 border border-red-200">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="border-t border-line bg-white p-4">
        <ChatInput onSend={sendMessage} disabled={isLoading} />
        <div className="mt-2 flex items-center justify-between text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <Shield className="size-3.5 text-green-500" aria-hidden="true" />
            Secure & Private
          </span>
          <button
            onClick={clearChat}
            className="text-primary hover:underline"
            disabled={messages.length === 0 && showWelcome}
          >
            Clear chat
          </button>
        </div>
      </div>
    </div>
  );
}