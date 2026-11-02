import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

type IndustriesHeroProps = {
  title: string;
  description?: string;
  breadcrumb: { label: string; href?: string }[];
};

export default function IndustriesHero({ title, description, breadcrumb }: IndustriesHeroProps) {
  const titleParts = title.split(" ");
  const firstLine = titleParts.slice(0, -2).join(" ") || titleParts[0];
  const secondLine = titleParts.slice(-2).join(" ");

  return (
    <section className="relative isolate flex h-svh min-h-[650px] max-h-[850px] w-full flex-col justify-center overflow-hidden bg-primary-deep" aria-labelledby="industries-heading">
      <Image
        src="/images/Industry_bg_2.png"
        alt="Industrial refinery with blue pump"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[90%_55%] lg:object-[85%_55%] scale-[0.95] lg:scale-[0.97]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(6,18,34,0.9)_0%,rgba(6,18,34,0.72)_20%,rgba(6,18,34,0.45)_38%,rgba(6,18,34,0.18)_52%,rgba(6,18,34,0)_64%)] lg:block"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(115deg,rgba(6,18,34,0.95)_0%,rgba(6,18,34,0.86)_38%,rgba(6,18,34,0.62)_72%,rgba(6,18,34,0.45)_100%)] lg:hidden"
      />

      <div className="relative z-10 w-full">
        <div className="w-full px-4 pb-10 pt-24 sm:px-6 sm:pt-24 lg:px-8 lg:pl-[7.5%] lg:pr-10 lg:pt-20">
          <div className="max-w-[700px]">
            <nav aria-label="Breadcrumb" className="animate-rise">
              <ol className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-accent sm:text-xs">
                {breadcrumb.map((item, index) => (
                  <li key={item.label} className="flex items-center gap-2">
                    {index > 0 ? <span aria-hidden="true" className="text-silver">/</span> : null}
                    {item.href ? (
                      <Link href={item.href} className="transition-colors hover:text-white">
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-white" aria-current="page">
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>

            <h1 id="industries-heading" className="animate-rise mt-5 font-display text-4xl font-extrabold leading-[1.14] tracking-tight text-white [animation-delay:100ms] [text-shadow:0_2px_18px_rgba(4,12,26,0.5)] sm:mt-6 sm:text-5xl lg:text-6xl lg:leading-[1.1] xl:text-[4rem] xl:leading-[1.08]">
              <span className="block">{firstLine}</span>
              <span className="block">
                <span className="inline-block border-b-[3px] border-accent pb-1.5">
                  {secondLine}
                </span>
              </span>
            </h1>

            {description ? (
              <p className="animate-rise mt-5 max-w-[540px] text-base font-medium leading-relaxed text-silver [animation-delay:200ms] [text-shadow:0_1px_12px_rgba(4,12,26,0.55)] sm:mt-6 sm:text-lg lg:text-xl">
                {description}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <a
        href="#industry-applications"
        aria-label="Scroll to industry applications"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 text-silver transition-colors hover:text-accent lg:block"
      >
        <ChevronDown aria-hidden="true" className="animate-drift size-6" />
      </a>
    </section>
  );
}