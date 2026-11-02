import { Mail, MapPin, Phone, Globe } from "lucide-react";
import { site } from "@/lib/content";

export default function ContactInformation() {
  const { contact } = site;

  return (
    <div className="rounded-xl border border-line bg-white p-8 shadow-sm">
      <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
        Contact Information
      </h2>
      <span
        aria-hidden="true"
        className="mt-4 block h-1 w-14 rounded-full bg-accent"
      />

      <ul className="mt-8 space-y-7">
        <li className="flex gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-steel">
            <MapPin aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-ink">Address</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {contact.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
        </li>

        <li className="flex gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-steel">
            <Phone aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-ink">Phone</h3>
            <ul className="mt-1.5 space-y-1">
              {contact.phones.map((phone) => (
                <li key={phone.href}>
                  <a
                    href={phone.href}
                    className="text-sm text-muted transition-colors hover:text-primary"
                  >
                    {phone.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </li>

        <li className="flex gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-steel">
            <Mail aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-ink">Email</h3>
            <a
              href={`mailto:${contact.email}`}
              className="mt-1.5 block break-all text-sm text-muted transition-colors hover:text-primary"
            >
              {contact.email}
            </a>
          </div>
        </li>

        <li className="flex gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-steel">
            <Globe aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-ink">Website</h3>
            <a
              href={contact.websiteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 block text-sm text-muted transition-colors hover:text-primary"
            >
              {contact.websiteLabel}
            </a>
          </div>
        </li>
      </ul>
    </div>
  );
}
