import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** 320px pixel copy of app/icon1.png (60 × 61); the flat artwork is unchanged. */
export const BRAND_LOGO = "/images/brand/pumpsquare-logo.png";
export const BRAND_LOGO_SIZE = { width: 320, height: 320 };

type LogoProps = {
  tone?: "light" | "dark";
  className?: string;
};

/** Pumpsquare brand: the official PUMP mark beside the Pumpsquare / SYSTEMS LLP wordmark. */
export default function Logo({ tone = "dark", className }: LogoProps) {
  const isDark = tone === "dark";

  return (
    <Link
      href="/"
      aria-label="Pumpsquare Systems LLP — Home"
      className={cn("group flex min-w-0 items-center gap-3", className)}
    >
      <Image
        src={BRAND_LOGO}
        alt=""
        width={BRAND_LOGO_SIZE.width}
        height={BRAND_LOGO_SIZE.height}
        priority
        className="size-12 shrink-0 rounded-md border border-white/70 object-contain transition-transform group-hover:-translate-y-0.5 sm:size-14"
      />
      <span className="flex min-w-0 flex-col leading-none">
        <span
          className={cn(
            "font-display text-[23px] font-extrabold leading-none tracking-tight",
            isDark ? "text-ink" : "text-white",
          )}
        >
          Pumpsquare
        </span>
        <span
          className={cn(
            "mt-1.5 text-[10px] font-semibold uppercase leading-none tracking-[0.22em]",
            isDark ? "text-muted" : "text-white/80",
          )}
        >
          Systems LLP
        </span>
      </span>
    </Link>
  );
}
