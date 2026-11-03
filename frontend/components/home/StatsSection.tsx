"use client";

import { useEffect, useRef, useState } from "react";
import { ClipboardList, Gauge, History, Layers } from "lucide-react";
import { stats } from "@/lib/content";
import { cn } from "@/lib/utils";

const statConfig = [
  { icon: History, iconColor: "text-primary" },
  { icon: Layers, iconColor: "text-primary" },
  { icon: ClipboardList, iconColor: "text-primary" },
  { icon: Gauge, iconColor: "text-primary" },
] as const;

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      const timeout = setTimeout(() => setValue(target), 0);
      return () => clearTimeout(timeout);
    }

    const duration = 1600;
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target]);

  return value;
}

function StatItem({
  value,
  label,
  active,
  index,
  isLast,
}: {
  value: number;
  label: string;
  active: boolean;
  index: number;
  isLast: boolean;
}) {
  const current = useCountUp(value, active);
  const { icon: Icon, iconColor } = statConfig[index];

  return (
    <div className={cn(
      "relative flex flex-col px-5 py-8",
      "w-full sm:w-1/2 lg:flex-1 lg:w-auto min-w-0"
    )}>
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex-shrink-0 inline-grid size-[64px] place-items-center rounded-xl bg-primary-soft transition-all duration-300",
            "hover:bg-primary hover:text-white",
            iconColor
          )}
        >
          <Icon aria-hidden="true" className="size-[28px] transition-colors duration-300 hover:text-white" strokeWidth={1.8} />
        </span>
        <div className="text-left min-w-0">
          <p
            className={cn(
              "font-display font-extrabold tabular-nums text-primary",
              "text-4xl sm:text-5xl lg:text-[56px] leading-[1.1]"
            )}
          >
            {current.toLocaleString("en-US")}
          </p>
          <p className="mt-1 max-w-[15rem] text-sm leading-relaxed text-muted font-medium">
            {label}
          </p>
        </div>
      </div>
      {!isLast && (
        <div
          aria-hidden="true"
          className="hidden lg:block absolute right-0 top-1/2 h-[70%] w-px -translate-y-1/2 bg-line"
        />
      )}
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      const timeout = setTimeout(() => setActive(true), 0);
      return () => clearTimeout(timeout);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

return (
    <section
      id="company-statistics"
      aria-label="Company statistics"
      className="bg-surface pb-4 sm:pb-6"
    >
      <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={cn(
            "relative -mt-16 overflow-hidden rounded-[22px] bg-white shadow-[0_16px_40px_rgba(0,59,92,0.1)]",
            "transition-opacity duration-700 ease-out",
            active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <div
            aria-hidden="true"
            className="absolute -top-3 -left-3 size-[56px] bg-accent"
            style={{
              clipPath: "polygon(0 0, 100% 0, 0 100%)",
            }}
          />
          <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap">
            {stats.map((stat, index) => (
              <StatItem
                key={stat.label}
                value={stat.value}
                label={stat.label}
                active={active}
                index={index}
                isLast={index === stats.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}