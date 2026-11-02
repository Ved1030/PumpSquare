import Image from "next/image";
import { Gauge, Wrench, ClipboardCheck } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ButtonLink from "@/components/ui/ButtonLink";
import { equipment } from "@/lib/content";

const features = [
  { icon: Wrench, text: "Quick Inspection and easy maintenance at the place without dismantling the assembly." },
  { icon: Gauge, text: "Optimized rotor design ensures smooth operation, reduced internal losses and excellent suction." },
  { icon: ClipboardCheck, text: "Every pump undergoes testing and must meet minimum performance standards before approval." },
] as const;

export default function EquipmentSection() {
  return (
    <section
      aria-label={equipment.heading}
      className="relative isolate overflow-hidden bg-primary-deep"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(135deg,#0f2440_0%,#183b63_50%,#102c49_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(49,92,140,0.25)_0%,transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-[180px] bg-[linear-gradient(180deg,transparent_0%,rgba(245,166,35,0.08)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-1 bg-accent/40"
      />

      <div className="relative mx-auto grid w-full max-w-[1450px] gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.36fr_0.34fr_0.30fr] lg:gap-10 lg:px-8 lg:py-24 items-start">
        <div className="lg:pt-4">
          <Reveal>
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-1 w-10 rounded-full bg-accent flex-shrink-0" />
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
                Capabilities
              </p>
            </div>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-[38px] font-extrabold leading-[1.15] tracking-tight text-white">
              Experience Our Advance Equipments
            </h2>
            <span aria-hidden="true" className="mt-4 block h-1 w-16 rounded-full bg-accent" />
            <p className="mt-7 text-base sm:text-lg leading-[1.8] text-silver max-w-[380px]">
              {equipment.paragraphs[0]}
            </p>
            <div className="mt-10">
              <ButtonLink
                href="/contact"
                variant="primary"
                className="px-7 py-3.5 transition-all"
              >
                Request a Quote
              </ButtonLink>
            </div>
          </Reveal>
        </div>

<Reveal delay={120} className="relative flex items-center justify-start">
          <div className="relative z-10 w-full max-w-[1000px] aspect-square -ml-12" style={{ backgroundColor: 'transparent' }}>
            <Image
              src="/images/pump2.png"
              alt="Pumpsquare engineered pump equipment"
              fill
              sizes="(min-width: 1024px) 34vw, 100vw"
              className="object-contain transition-transform duration-700 hover:scale-[1.02] drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
              style={{ backgroundColor: 'transparent' }}
              placeholder="empty"
              unoptimized
            />
          </div>
        </Reveal>

        <div className="space-y-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal key={index} delay={index * 120} as="article">
                <div className="relative h-full flex gap-5 rounded-xl border border-white/15 bg-white/5 backdrop-blur-md p-5 sm:p-6 transition-all duration-300 hover:border-accent/50 hover:bg-white/10">
                  <span className="flex-shrink-0 grid size-11 place-items-center rounded-lg bg-accent text-white">
                    <Icon aria-hidden="true" className="size-5.5" strokeWidth={1.8} />
                  </span>
                  <p className="text-sm sm:text-base leading-relaxed text-silver">
                    {feature.text}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}