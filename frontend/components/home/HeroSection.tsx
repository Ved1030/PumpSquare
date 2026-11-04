import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";
import ButtonLink from "@/components/ui/ButtonLink";

const HERO_IMAGE = "/images/Blue Industrial Pump at Sunset Refinery.png";

export default function HeroSection() {
  return (
    <section className="relative isolate flex h-svh max-h-[850px] min-h-[650px] w-full max-w-none flex-col justify-center overflow-hidden bg-primary-deep">
      <Image
        src={HERO_IMAGE}
        alt="Blue industrial pump at a refinery at sunset"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[90%_55%] lg:object-[85%_55%]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(0,59,92,0.9)_0%,rgba(0,59,92,0.72)_20%,rgba(0,59,92,0.45)_38%,rgba(0,59,92,0.18)_52%,rgba(0,59,92,0)_64%)] lg:block"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(115deg,rgba(0,59,92,0.95)_0%,rgba(0,59,92,0.86)_38%,rgba(0,59,92,0.62)_72%,rgba(0,59,92,0.45)_100%)] lg:hidden"
      />

      <div className="relative z-10 w-full">
        <div className="w-full px-4 pb-10 pt-24 sm:px-6 sm:pt-24 lg:px-8 lg:pl-[7.5%] lg:pr-10 lg:pt-20">
          <div className="max-w-[700px]">
            <p className="animate-rise inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-accent sm:text-xs">
              <span aria-hidden="true" className="h-px w-8 bg-accent sm:w-10" />
              WE&rsquo;RE PUMPSQUARE
            </p>

            <h1 className="animate-rise mt-5 font-display text-3xl font-extrabold leading-[1.14] tracking-tight text-white [animation-delay:100ms] [text-shadow:0_2px_18px_rgba(0,59,92,0.5)] sm:mt-6 sm:text-4xl lg:text-5xl lg:leading-[1.1] xl:text-[3.25rem] xl:leading-[1.08]">
              <span className="block">We&rsquo;re Pumpsquare,</span>
              <span className="block">
                <span className="inline-block border-b-[3px] border-accent pb-1.5">
                  Pumping and Solutions
                </span>
              </span>
            </h1>

            <p className="animate-rise mt-5 max-w-[540px] text-lg font-normal leading-[1.6] text-primary-soft [animation-delay:200ms] [text-shadow:0_1px_12px_rgba(0,59,92,0.55)] sm:mt-6">
              PUMPSQUARE offers a wide range of pumping solutions
            </p>

            <div className="animate-rise mt-8 flex flex-col gap-3 [animation-delay:300ms] min-[420px]:flex-row min-[420px]:flex-wrap sm:gap-4">
              <ButtonLink
                href="/#products"
                variant="primary"
                className="group px-7 py-3.5 transition-all"
              >
                Explore Our Products
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                />
              </ButtonLink>
              <ButtonLink
                href="/contact"
                variant="outlineLight"
                className="bg-primary-deep/25 px-7 py-3.5 backdrop-blur-[2px] transition-all hover:bg-white/10"
              >
                Contact Us
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#company-statistics"
        aria-label="Scroll to company statistics"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 text-primary-soft transition-colors hover:text-accent lg:block"
      >
        <ChevronDown aria-hidden="true" className="animate-drift size-6" />
      </a>
    </section>
  );
}
