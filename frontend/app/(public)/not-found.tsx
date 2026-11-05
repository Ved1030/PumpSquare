import Link from "next/link";
import ButtonLink from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <section className="bg-surface">
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">
          404
        </p>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Page Not Found
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/">Back to Home</ButtonLink>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md border border-primary bg-white px-6 py-3 text-sm font-semibold text-primary transition-colors hover:border-accent hover:bg-accent-soft hover:text-primary-dark"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
