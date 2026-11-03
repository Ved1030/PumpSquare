import Link from "next/link";
import { ArrowRight, ClipboardCheck, Factory, Gauge, Ship } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { productCategories } from "@/lib/content";

const icons = [Factory, Ship, Gauge, ClipboardCheck] as const;

export default function ProductCategories() {
  return (
    <section
      id="products"
      aria-label="Our Products"
      className="bg-surface py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Our Products"
            title="Pumping Solutions for Every Requirement"
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {productCategories.map((category, index) => {
            const Icon = icons[index];
            return (
              <Reveal key={category.title} delay={index * 90} as="article" className="h-full">
                <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-primary/10">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 bg-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div className="flex items-start justify-between">
                    <span className="grid size-12 place-items-center rounded-lg bg-primary-soft text-steel transition-colors group-hover:bg-accent group-hover:text-white">
                      <Icon aria-hidden="true" className="size-6" />
                    </span>
                    <span
                      aria-hidden="true"
                      className="font-display text-sm font-bold tabular-nums text-silver transition-colors group-hover:text-accent"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-lg font-bold uppercase tracking-wide text-ink">
                    {category.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                    {category.description}
                  </p>
                  <Link
                    href="/contact"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent"
                  >
                    Request details
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
