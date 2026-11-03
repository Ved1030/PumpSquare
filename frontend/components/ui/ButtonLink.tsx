import Link from "next/link";
import { cn } from "@/lib/utils";

const styles = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-primary-deep shadow-sm transition-colors hover:bg-accent-dark",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark",
  outline:
    "inline-flex items-center justify-center gap-2 rounded-md border border-primary bg-white px-6 py-3 text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent-soft hover:text-primary-deep",
  outlineLight:
    "inline-flex items-center justify-center gap-2 rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-accent hover:bg-accent/10",
  light:
    "inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-primary shadow-sm transition-colors hover:bg-accent hover:text-white",
} as const;

type ButtonLinkProps = {
  href: string;
  variant?: keyof typeof styles;
  className?: string;
  children: React.ReactNode;
  external?: boolean;
};

export default function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
  external,
}: ButtonLinkProps) {
  const classes = cn(styles[variant], className);

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
