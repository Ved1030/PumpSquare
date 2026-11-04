import { ArrowUpRight, Globe, Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/content";

const linkClasses =
  "underline decoration-transparent underline-offset-4 transition-colors hover:text-primary hover:decoration-current";

export default function ContactInformation() {
  const { contact } = site;

  return (
    <div className="flex h-full flex-col rounded-xl border border-line bg-white p-6 shadow-sm sm:p-8">
      <h2 className="font-display text-2xl font-bold tracking-tight text-primary-deep">
        Contact Information
      </h2>
      <span
        aria-hidden="true"
        className="mt-4 block h-1 w-14 rounded-full bg-accent"
      />
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Speak with our engineering team directly about your pump application,
        or use the form to share your requirements.
      </p>

      <ul className="mt-8 space-y-6">
        <li className="flex gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
            <MapPin aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-ink">Address</h3>
            <address className="mt-1.5 text-sm leading-relaxed text-muted not-italic">
              {contact.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>
        </li>

        <li className="flex gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
            <Phone aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-ink">Phone</h3>
            <ul className="mt-1.5 space-y-1">
              {contact.phones.map((phone) => (
                <li key={phone.href}>
                  <a
                    href={phone.href}
                    className={`text-sm font-medium text-ink ${linkClasses}`}
                  >
                    {phone.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </li>

        <li className="flex gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
            <Mail aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-ink">Email</h3>
            <a
              href={`mailto:${contact.email}`}
              className={`mt-1.5 block break-all text-sm font-medium text-ink ${linkClasses}`}
            >
              {contact.email}
            </a>
          </div>
        </li>

        <li className="flex gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
            <Globe aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-ink">Website</h3>
            <a
              href={contact.websiteHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-1.5 inline-flex items-center gap-1 text-sm font-medium text-ink ${linkClasses}`}
            >
              {contact.websiteLabel}
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </a>
          </div>
        </li>
      </ul>

      <div className="mt-auto pt-8">
        <div className="rounded-lg bg-primary-soft p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Prefer to talk?
          </p>
          <p className="mt-2 text-sm leading-relaxed text-primary-deep">
            Call{" "}
            <a
              href={contact.phones[0].href}
              className="font-semibold underline underline-offset-4 hover:text-primary"
            >
              {contact.phones[0].label}
            </a>{" "}
            to discuss your requirement with our team.
          </p>
        </div>
      </div>
    </div>
  );
}
