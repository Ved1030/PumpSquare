import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, ClipboardCheck, FlaskConical, Gauge, Ruler, ShieldCheck, Wrench } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

import {
  aboutCompanyParagraphs,
  assemblyEquipment,
  certificateLinkPhrase,
  certificationParagraphs,
  infrastructureParagraphs,
  machineryInstalled,
  measuringInstrumentsParagraphs,
  qualityParagraphs,
  researchDevelopmentParagraphs,
  testingEquipment,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "About Pumpsquare Systems LLP — pump manufacturing facility at Vithal Udyog Nagar (near Anand), Gujarat - India, machinery, testing equipment, R&D and ISO 9001:2008 compliance.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Pumpsquare Systems LLP"
        description="A company manufacturing & marketing pumps, process equipment and installations from Vithal Udyog Nagar (near Anand), Gujarat – India."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "About Us" }]}
        backgroundImage="/images/Modern Metal Fabrication Facility.png"
        imageAlt="Modern metal fabrication facility with CNC machinery and an overhead yellow crane"
        imagePosition="object-[45%_58%] lg:object-[36%_center]"
        imageClassName="scale-[0.7] md:scale-[0.8] lg:scale-100"
        imageOverlay={{
          desktop:
            "linear-gradient(90deg,rgba(0,59,92,0.90)_0%,rgba(0,59,92,0.72)_45%,rgba(0,59,92,0.20)_100%)",
          mobile:
            "linear-gradient(160deg,rgba(0,59,92,0.88)_0%,rgba(0,59,92,0.72)_55%,rgba(0,59,92,0.4)_100%)",
        }}
        highlight="Vithal Udyog Nagar"
      />

      <div className="bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <section aria-labelledby="about-company" className="scroll-mt-28 flow-root">
            <Reveal>
              <div className="w-full md:float-right md:w-[42%] lg:w-[40%] md:ml-8 md:mb-6 lg:ml-12 lg:mb-8 clear-right">
                <Reveal delay={200} className="relative mb-6 aspect-[4/3]">
                  <Image
                    src="/images/Industrial_Blue_Pump_Assembly-removebg-preview.png"
                    alt="Progressive cavity pump manufactured by Pumpsquare Systems LLP"
                    fill
                    sizes="(min-width: 1024px) 800px, 100vw"
                    className="object-contain scale-110"
                    priority
                  />
                </Reveal>

                <Reveal delay={400}>
                  <div className="relative bg-white rounded-2xl border border-line p-5 sm:p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div
                        aria-hidden="true"
                        className="w-1 h-11 sm:h-12 rounded-full bg-accent shrink-0"
                      />
                      <div>
                        <h3 className="font-display text-lg sm:text-xl font-bold text-ink">
                          Since 2011
                        </h3>
                        <p className="mt-0.5 text-steel leading-relaxed">
                          Vithal Udyog Nagar, Gujarat – India
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>

              <span
                aria-hidden="true"
                className="block h-1 w-14 rounded-full bg-accent mb-6 animate-rise"
              />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4 animate-rise" style={{ "--reveal-delay": "100ms" } as React.CSSProperties}>
                ABOUT COMPANY
              </p>
              <h2
                id="about-company"
                className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-primary-deep leading-[1.2] animate-rise"
                style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
              >
                About Company
              </h2>

              <div className="mt-8 space-y-6 animate-rise" style={{ "--reveal-delay": "300ms" } as React.CSSProperties}>
                {aboutCompanyParagraphs.map((paragraph, index) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className={
                      index === 0
                        ? "text-lg sm:text-xl leading-[1.8] text-ink font-medium w-full max-w-none"
                        : "text-base sm:text-lg leading-[1.8] text-muted w-full max-w-none"
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          </section>

          <section
            aria-labelledby="infrastructure"
            className="mt-24 scroll-mt-28"
          >
            <Reveal>
              <SectionHeading
                eyebrow="02"
                title="Infrastructure"
                align="left"
              />
              <div className="mt-10 space-y-6 w-full max-w-none">
                {infrastructureParagraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-base sm:text-lg leading-[1.8] text-muted w-full max-w-none"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={60} className="mt-14">
              <div className="rounded-2xl border border-line bg-white p-7 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-primary-soft text-steel">
                    <Wrench aria-hidden="true" className="size-5" />
                  </span>
                  <h3 className="font-display text-lg font-bold text-primary-deep">
                    Machinery Installed
                  </h3>
                </div>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {machineryInstalled.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 rounded-lg border border-line bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-accent/40 hover:bg-white"
                    >
                      <Check
                        aria-hidden="true"
                        className="size-4 shrink-0 text-accent"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={100} className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="h-full rounded-2xl border border-line bg-white p-7 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-primary-soft text-steel">
                    <Gauge aria-hidden="true" className="size-5" />
                  </span>
                  <h3 className="font-display text-lg font-bold text-primary-deep">
                    Testing Equipment&rsquo;s
                  </h3>
                </div>
                <ul className="mt-5 space-y-3">
                  {testingEquipment.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 border-b border-line pb-3 text-sm text-muted last:border-b-0 last:pb-0"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="h-full rounded-2xl border border-line bg-white p-7 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-primary-soft text-steel">
                    <ClipboardCheck aria-hidden="true" className="size-5" />
                  </span>
                  <h3 className="font-display text-lg font-bold text-primary-deep">
                    Assembly Equipment&rsquo;s
                  </h3>
                </div>
                <ul className="mt-5 space-y-3">
                  {assemblyEquipment.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 border-b border-line pb-3 text-sm text-muted last:border-b-0 last:pb-0"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </section>

          <section
            aria-labelledby="measuring-instruments"
            className="mt-24 scroll-mt-28"
          >
            <Reveal>
              <SectionHeading
                eyebrow="03"
                title="Measuring Instruments"
                align="left"
              />
              <div className="mt-10 rounded-2xl border border-line bg-white p-7 sm:p-8 shadow-sm">
                <span className="mb-5 grid size-10 place-items-center rounded-lg bg-primary-soft text-steel">
                  <Ruler aria-hidden="true" className="size-5" />
                </span>
                <div className="space-y-5 w-full max-w-none">
                  {measuringInstrumentsParagraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className="text-base sm:text-lg leading-[1.8] text-muted"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          </section>

          <section
            aria-labelledby="research-development"
            className="mt-24 scroll-mt-28"
          >
            <Reveal>
              <SectionHeading
                eyebrow="04"
                title="Research & Development"
                align="left"
              />
              <div className="mt-10 rounded-2xl border border-line bg-white p-7 sm:p-8 shadow-sm">
                <span className="mb-5 grid size-10 place-items-center rounded-lg bg-primary-soft text-steel">
                  <FlaskConical aria-hidden="true" className="size-5" />
                </span>
                <div className="space-y-5 w-full max-w-none">
                  {researchDevelopmentParagraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className="text-base sm:text-lg leading-[1.8] text-muted"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          </section>

          <section
            aria-labelledby="production-quality"
            className="mt-24 scroll-mt-28"
          >
            <Reveal>
              <SectionHeading
                eyebrow="05"
                title="Production and Quality Assurance"
                align="left"
              />
              <div className="mt-10 space-y-5 w-full max-w-none">
                {qualityParagraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-base sm:text-lg leading-[1.8] text-muted"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          </section>

          <section
            aria-labelledby="certifications"
            className="mt-24 scroll-mt-28"
          >
            <Reveal>
              <div className="relative overflow-hidden rounded-2xl bg-primary p-8 sm:p-10 lg:p-12 text-white shadow-xl shadow-primary/10">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1.5 bg-accent"
                />
                <div
                  aria-hidden="true"
                  className="absolute -right-16 -top-16 size-56 rounded-full border border-white/10"
                />
                <div className="relative max-w-none w-full">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="grid size-12 place-items-center rounded-lg bg-white/10 text-accent">
                      <ShieldCheck aria-hidden="true" className="size-6" />
                    </span>
                    <h2
                      id="certifications"
                      className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
                    >
                      CERTIFICATIONS
                    </h2>
                    <span className="rounded-full border border-accent/60 bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-accent">
                      ISO 9001:2008
                    </span>
                  </div>
                  <div className="mt-8 space-y-5">
                    {certificationParagraphs.map((paragraph, index) => {
                      const linkStart = paragraph.indexOf(certificateLinkPhrase);
                      const isLinked = index === 1 && linkStart !== -1;

                      return (
                        <p
                          key={paragraph.slice(0, 40)}
                          className={
                            index === 1
                              ? "text-[18px] font-semibold leading-[1.7] text-white"
                              : "text-[19px] font-normal leading-[1.7] text-white"
                          }
                        >
                          {isLinked ? (
                            <>
                              {paragraph.slice(0, linkStart)}
                              <Link
                                href="/contact"
                                className="font-semibold text-accent underline decoration-accent underline-offset-4 transition-colors hover:text-white hover:decoration-white"
                              >
                                {certificateLinkPhrase}
                              </Link>
                              {paragraph.slice(linkStart + certificateLinkPhrase.length)}
                            </>
                          ) : (
                            paragraph
                          )}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Reveal>
          </section>
        </div>
      </div>
    </>
  );
}