"use client";

import { cn } from "@/lib/utils";
import ChatActionButton from "./ChatActionButton";

interface WelcomeMessageProps {
  onSuggestionClick?: (message: string) => void;
}

const suggestions = [
  { label: "Explore Our Pumps", message: "What pumps does Pumpsquare manufacture?" },
  { label: "Industries We Serve", message: "Which industries does Pumpsquare serve?" },
  { label: "Contact Pumpsquare", message: "How can I contact Pumpsquare?" },
  { label: "Request a Quote", message: "I'd like to request a quote for a pump." },
];

export default function WelcomeMessage({ onSuggestionClick }: WelcomeMessageProps) {
  const handleSuggestionClick = (message: string) => {
    if (onSuggestionClick) {
      onSuggestionClick(message);
    }
  };

  return (
    <div className="flex gap-3 mb-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white" aria-hidden="true">
        AI
      </div>
      <div className="bg-white rounded-2xl rounded-tl-none px-4 py-4 shadow-sm border border-line max-w-[75%]">
        <p className="text-sm leading-relaxed text-ink">
          Hello! Welcome to Pumpsquare Systems LLP. I can help you explore our pumps, products, industrial applications and company information. What would you like to know?
        </p>
        <div className="mt-4 flex flex-wrap gap-2" role="list" aria-label="Quick suggestions">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion.message)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                "bg-primary-soft text-primary hover:bg-primary hover:text-white border border-line"
              )}
              role="listitem"
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}