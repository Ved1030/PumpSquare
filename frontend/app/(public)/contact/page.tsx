import { Suspense } from "react";
import type { Metadata } from "next";
import { ArrowUpRight, ClipboardList, MessagesSquare, Settings2 } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import ContactInformation from "@/components/contact/ContactInformation";
import ContactForm from "@/components/contact/ContactForm";
import { getPublishedCatalogue } from "@/lib/product-catalogue";
import type { ProductSummary } from "@/lib/products";

const PROCESS_STEPS = [
  {
    number: "01",
    icon: ClipboardList,
    title: "We Review Your Requirement",
    description:
      "Our team reads the details you share — application, fluid, flow rate and pressure — so we understand what you need.",
  },
  {
    number: "02",
    icon: MessagesSquare,
    title: "We Get in Touch",
    description:
      "A member of our team contacts you to discuss your application and clarify any details before proposing a solution.",
  },
  {
    number: "03",
    icon: Settings2,
    title: "We Recommend a Pump",
    description:
      "We suggest the most suitable pump and configuration for your duty, along with a quotation where required.",
  },
] as const;

async function ContactFormLoader() {
  const products: ProductSummary[] = (await getPublishedCatalogue()).map(({ slug, name }) => ({
    slug,
    name,
    image: null,
    category: null,
  }));

  return <ContactForm products={products} />;
}

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Pumpsquare Systems LLP — Plot No. 1903, Phase IV, G.I.D.C Estate, Via Anand, Vithal Udyog Nagar - 388121, Gujarat, India. Phone: +91 93272 64813.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        description="Tell us about your pump requirement — our team at Vithal Udyog Nagar will get back to you."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
        backgroundImage="/images/Blueprints and Precision in the Factory Office.png"
        imageAlt="Engineering blueprints and precision machined components in a factory office"
        imagePosition="object-[45%_58%] lg:object-[36%_center]"
        imageClassName="scale-[0.62] md:scale-[0.8] lg:scale-100"
        imageOverlay={{
          desktop:
            "linear-gradient(90deg,rgba(0,59,92,0.90)_0%,rgba(0,59,92,0.72)_45%,rgba(0,59,92,0.20)_100%)",
          mobile:
            "linear-gradient(160deg,rgba(0,59,92,0.92)_0%,rgba(0,59,92,0.82)_55%,rgba(0,59,92,0.55)_100%)",
        }}
      />

      <section aria-label="Contact details and enquiry form" className="bg-surface py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-8 lg:grid-cols-5">
            <Reveal className="lg:col-span-2">
              <ContactInformation />
            </Reveal>
            <Reveal delay={100} className="lg:col-span-3">
              <Suspense
                fallback={
                  <div className="h-[640px] rounded-xl border border-line bg-white shadow-sm" />
                }
              >
                <ContactFormLoader />
              </Suspense>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="process-heading" className="bg-primary-soft py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2
              id="process-heading"
              className="font-display text-2xl font-bold tracking-tight text-primary-deep sm:text-3xl"
            >
              What Happens After You Contact Us?
            </h2>
            <span
              aria-hidden="true"
              className="mt-4 block h-1 w-14 rounded-full bg-accent"
            />
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {PROCESS_STEPS.map((step) => (
                <li
                  key={step.title}
                  className="rounded-xl border border-white/60 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-display text-2xl font-bold text-accent">
                      {step.number}
                    </span>
                    <span className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary">
                      <step.icon aria-hidden="true" className="size-5" />
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-primary-deep">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="location-heading" className="bg-white py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2
              id="location-heading"
              className="font-display text-2xl font-bold tracking-tight text-primary-deep sm:text-3xl"
            >
              Our Location
            </h2>
            <span
              aria-hidden="true"
              className="mt-4 block h-1 w-14 rounded-full bg-accent"
            />
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
              Plot No. 1903, Phase IV, G.I.D.C Estate, Via Anand, Vithal Udyog
              Nagar - 388121, Gujarat, India.
            </p>
            <div className="mt-8 overflow-hidden rounded-xl border border-line shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-white px-6 py-4">
                <h3 className="font-display text-base font-bold text-ink">
                  Vithal Udyog Nagar &ndash; 388121, Gujarat, India
                </h3>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Vithal+Udyog+Nagar%2C+GIDC+Estate%2C+Anand%2C+Gujarat+388121%2C+India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent"
                >
                  Get Directions
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </a>
              </div>
              <iframe
                title="Map showing Pumpsquare Systems LLP, Vithal Udyog Nagar, Gujarat"
                src="https://www.google.com/maps?q=Vithal%20Udyog%20Nagar%2C%20GIDC%20Estate%2C%20Anand%2C%20Gujarat%20388121%2C%20India&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[380px] w-full border-0 sm:h-[440px]"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
