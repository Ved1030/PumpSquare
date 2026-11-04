import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import ContactInformation from "@/components/contact/ContactInformation";
import ContactForm from "@/components/contact/ContactForm";

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
      />

      <section aria-label="Contact details and enquiry form" className="bg-surface py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-8 lg:grid-cols-5">
            <Reveal className="lg:col-span-2">
              <ContactInformation />
            </Reveal>
            <Reveal delay={100} className="lg:col-span-3">
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="location-heading" className="bg-white pb-20 sm:pb-24">
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
