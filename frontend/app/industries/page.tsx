import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import ButtonLink from "@/components/ui/ButtonLink";
import IndustriesHero from "@/components/industries/IndustriesHero";
import { aboutApplications, industries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Industries We Serve",
  description:
    "Industries served by Pumpsquare pumps — Chemical, Building, Pharmaceutical, Beverage & Food, Varnish & Paint, Sewage Technology, Agriculture and Paper.",
};

export default function IndustriesPage() {
  return (
    <>
      <IndustriesHero
        title="Industries We Serve"
        description="Pumpsquare pumps are utilized throughout the world in a variety of process and industrial applications."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Industries" }]}
      />

      <section id="industry-applications" aria-label="Industry applications" className="bg-surface py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-[900px]">
            <span aria-hidden="true" className="mb-6 block mx-auto h-1 w-10 rounded-full bg-accent" />
            <p className="text-center text-base leading-relaxed text-steel sm:text-lg">
              {aboutApplications}
            </p>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry, index) => (
              <Reveal
                key={industry.name}
                delay={(index % 4) * 80}
                className="h-full"
              >
                <article className="group h-full overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-xl hover:shadow-primary/10">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={industry.image}
                      alt={`${industry.name} industry`}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center gap-3 p-5">
                    <span
                      aria-hidden="true"
                      className="size-2.5 shrink-0 rounded-full bg-accent"
                    />
                    <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink transition-colors group-hover:text-primary">
                      {industry.name}
                    </h2>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16 overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
            <div className="grid items-center gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_auto]">
              <div>
                <span
                  aria-hidden="true"
                  className="mb-5 block h-1 w-10 rounded-full bg-accent"
                />
                <h2 className="max-w-lg font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  Looking for a pump for your industry?
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
                  With a complete range of pumps, Pumpsquare offers to the engineers,
                  suppliers, OEM&rsquo;s and users a single source of supply for their
                  pump requirements.
                </p>
              </div>
              <div className="lg:justify-self-end">
                <ButtonLink href="/contact" className="px-8 py-3.5">
                  Request a Quote
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
