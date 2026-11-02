import Link from "next/link";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  tone?: "light" | "dark";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "dark",
  className,
}: SectionHeadingProps) {
  const isLight = tone === "light";

  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <>
          <span
            aria-hidden="true"
            className={cn(
              "mb-5 block h-1 w-10 rounded-full bg-accent",
              align === "center" && "mx-auto",
            )}
          />
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-[0.2em]",
              isLight ? "text-silver" : "text-steel",
            )}
          >
            {eyebrow}
          </p>
        </>
      ) : null}
      <h2
        className={cn(
          "mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl",
          isLight ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed",
            isLight ? "text-silver" : "text-muted",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function ReadMoreLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm font-semibold text-steel transition-colors hover:text-accent-dark"
    >
      Read More
      <span aria-hidden="true">→</span>
    </Link>
  );
}
