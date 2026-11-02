import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  tone?: "light" | "dark";
  className?: string;
};

/**
 * Text-based Pumpsquare brand treatment.
 * The official LOGO.jpg supplied on the live site contains only the letters
 * "PUMP" on a padded square, so it cannot be used as a wordmark.
 * To swap in a proper official logo later, replace the inner markup with
 * next/image pointing at /images/your-logo.png — no other changes required.
 */
export default function Logo({ tone = "dark", className }: LogoProps) {
  const isDark = tone === "dark";

  return (
    <Link
      href="/"
      aria-label="Pumpsquare Systems LLP — Home"
      className={cn("group flex items-center gap-3", className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-md shadow-sm transition-transform group-hover:-translate-y-0.5",
          isDark ? "bg-primary" : "bg-white/10 ring-1 ring-white/20",
        )}
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-6" aria-hidden="true">
          <path
            d="M12 3.5c2.2 2.7 5.5 6 5.5 9.4a5.5 5.5 0 1 1-11 0C6.5 9.5 9.8 6.2 12 3.5Z"
            fill="#FFFFFF"
            opacity="0.92"
          />
          <path
            d="M12 9.2c1.1 1.4 2.6 3 2.6 4.8a2.6 2.6 0 1 1-5.2 0c0-1.8 1.5-3.4 2.6-4.8Z"
            fill="#F5A623"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-xl font-extrabold tracking-tight",
            isDark ? "text-ink" : "text-white",
          )}
        >
          Pumpsquare
        </span>
        <span
          className={cn(
            "mt-1 text-[10px] font-semibold uppercase tracking-[0.22em]",
            isDark ? "text-muted" : "text-silver",
          )}
        >
          Systems LLP
        </span>
      </span>
    </Link>
  );
}
