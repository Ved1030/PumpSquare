import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { industries } from "@/lib/content";

export default function IndustriesSection() {
  return (
    <section
      aria-label="Industries We Serve"
      className="bg-surface py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Industries We Serve"
            title="Trusted Across Process Industries"
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {industries.map((industry, index) => (
            <Reveal
              key={industry.name}
              delay={(index % 4) * 80}
              className="h-full"
            >
              <article className="group relative aspect-[3/2] overflow-hidden rounded-xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-primary/10">
                <Image
                  src={industry.image}
                  alt={`${industry.name} industry`}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,59,92,0.92)_0%,rgba(0,85,135,0.3)_55%,transparent_100%)]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1 bg-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <h3 className="absolute inset-x-0 bottom-0 p-4 text-center text-xs font-bold uppercase tracking-[0.12em] text-white sm:text-sm">
                  {industry.name}
                </h3>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <Link
            href="/industries"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent"
          >
            View all industries
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
