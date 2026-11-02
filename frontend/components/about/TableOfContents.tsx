"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type TocItem = { id: string; label: string };

const defaultItems: TocItem[] = [
  { id: "about-company", label: "About Company" },
  { id: "infrastructure", label: "Infrastucture" },
  { id: "measuring-instruments", label: "Measuring Instruments" },
  { id: "research-development", label: "Research & Devlopment" },
  { id: "production-quality", label: "Production and Quality Assurance" },
  { id: "certifications", label: "CERTIFICATIONS" },
];

export default function TableOfContents({
  items = defaultItems,
  label = "About page sections",
}: {
  items?: TocItem[];
  label?: string;
}) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const nodes = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (nodes.length === 0 || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label={label} className="sticky top-28">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">
        On this page
      </p>
      <span aria-hidden="true" className="mt-3 block h-0.5 w-8 bg-accent" />
      <ul className="mt-5 space-y-1 border-l border-line">
        {items.map((item, index) => {
          const active = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "-ml-px flex items-start gap-3 border-l-2 py-2.5 pl-4 text-sm leading-snug transition-colors",
                  active
                    ? "border-accent font-semibold text-primary"
                    : "border-transparent text-muted hover:border-steel-soft hover:text-primary-dark",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 font-display text-[11px] font-bold tabular-nums",
                    active ? "text-accent" : "text-silver",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
