import Reveal from "@/components/ui/Reveal";
import SectionHeading, {
  ReadMoreLink,
} from "@/components/ui/SectionHeading";
import Pump3DViewerWrapper from "@/components/home/Pump3DViewerWrapper";
import { whoWeAre } from "@/lib/content";

export default function AboutPreview() {
  return (
    <section aria-label="Who We Are" className="bg-white py-10 sm:py-12">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="Who We Are"
            title="Pumpsquare Systems LLP"
          />
          <p className="mt-7 text-base leading-[1.85] text-muted">{whoWeAre}</p>
          <div className="mt-8">
            <ReadMoreLink href="/about" />
          </div>
        </Reveal>

        <Reveal delay={0} className="relative">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -left-4 -top-4 hidden h-24 w-24 border-l-4 border-t-4 border-accent sm:block"
            />
            <Pump3DViewerWrapper />

            <div className="mt-6 flex items-start gap-4 rounded-xl border border-line bg-white p-5 shadow-lg shadow-primary/5 sm:mt-8 sm:max-w-xs">
              <span aria-hidden="true" className="mt-1 h-10 w-1 shrink-0 rounded-full bg-accent" />
              <div>
                <p className="font-display text-lg font-bold text-ink">Since 2011</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  Vithal Udyog Nagar, Gujarat &ndash; India
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}