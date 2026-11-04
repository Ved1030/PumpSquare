import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { employeeLinks, footerContact, quickLinks, site } from "@/lib/content";
import Logo from "./Logo";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-primary-deep text-primary-soft">
      <span aria-hidden="true" className="block h-1 w-full bg-accent" />
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo tone="light" />
            <p className="mt-6 text-base leading-[1.7] text-primary-soft">
              Buy Pumps & Pumping Equipment in bulk from PUMPSQUARE SYSTEMS
              LLP at Trade India quality-assured products.
            </p>
          </div>

          <FooterColumn title="Quick Links">
            <ul className="space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base text-primary-soft transition-colors duration-200 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Employees Corner">
            <ul className="space-y-3.5">
              {employeeLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-primary-soft transition-colors duration-200 hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Contact Information">
            <ul className="space-y-5 text-base">
              <li className="flex gap-3">
                <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-steel" />
                <span className="leading-[1.7]">
                  {footerContact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-steel" />
                <a
                  href={footerContact.phone.href}
                  className="text-base text-primary-soft transition-colors duration-200 hover:text-accent"
                >
                  {footerContact.phone.label}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-steel" />
                <a
                  href={`mailto:${footerContact.email}`}
                  className="break-all text-base text-primary-soft transition-colors duration-200 hover:text-accent"
                >
                  {footerContact.email}
                </a>
              </li>
            </ul>
          </FooterColumn>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-primary-soft sm:flex-row sm:px-6 lg:px-8">
          <p>
            Copyright &copy; {year} {site.legalName}. All rights reserved.
          </p>
          <p>Vithal Udyog Nagar, Anand, Gujarat, India</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display text-lg font-bold uppercase tracking-[0.12em] text-white">
        {title}
      </h2>
      <span aria-hidden="true" className="mt-3 block h-0.5 w-10 bg-accent" />
      <div className="mt-5">{children}</div>
    </div>
  );
}
