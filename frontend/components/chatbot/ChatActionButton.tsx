"use client";

import Link from "next/link";
import { ArrowUpRight, ExternalLink, MessageSquare, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatActionButtonProps {
  type: "product" | "contact" | "quote";
  label: string;
  href: string;
  onClick?: () => void;
}

export default function ChatActionButton({ type, label, href, onClick }: ChatActionButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const icons = {
    product: ArrowUpRight,
    contact: MessageSquare,
    quote: ArrowUpRight,
  };

  const Icon = icons[type];

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
        type === "product" && "bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md",
        type === "contact" && "bg-primary text-white hover:bg-primary-dark border border-primary",
        type === "quote" && "bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md"
      )}
    >
      {label}
      <Icon className="size-4" aria-hidden="true" />
    </Link>
  );
}