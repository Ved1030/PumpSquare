"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Info,
  Loader2,
  Send,
} from "lucide-react";
import { site } from "@/lib/content";
import type { ProductSummary } from "@/lib/products";
import { cn } from "@/lib/utils";

const ENQUIRY_TYPES = [
  "Request a Quote",
  "Product Information",
  "Technical Enquiry",
  "General Enquiry",
  "Other",
] as const;

const NO_PRODUCT = "Not sure yet";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  enquiryType: string;
  product: string;
  subject: string;
  message: string;
};

type FieldName = keyof FormState;

type Status =
  | { type: "idle" }
  | { type: "error"; message: string }
  | { type: "not-configured" }
  | { type: "success" };

const initialValues: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  enquiryType: ENQUIRY_TYPES[0],
  product: NO_PRODUCT,
  subject: "",
  message: "",
};

function validate(values: FormState) {
  const errors: Partial<Record<FieldName, string>> = {};

  if (!values.firstName.trim()) errors.firstName = "First name is required.";
  if (!values.lastName.trim()) errors.lastName = "Last name is required.";

  if (!values.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (values.phone.trim() && !/^[+\d][\d\s()-]{6,}$/.test(values.phone.trim())) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!values.enquiryType) errors.enquiryType = "Please choose an enquiry type.";

  if (!values.message.trim()) errors.message = "Message is required.";

  return errors;
}

const inputClasses = (hasError: boolean) =>
  cn(
    "mt-2 w-full rounded-md border bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/70 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
    hasError ? "border-red-500" : "border-line",
  );

export default function ContactForm({ products }: { products: ProductSummary[] }) {
  const searchParams = useSearchParams();
  const requestedProduct = products.find(
    (product) => product.slug === searchParams.get("product"),
  );

  const [values, setValues] = useState<FormState>(() =>
    requestedProduct
      ? {
          ...initialValues,
          enquiryType: "Request a Quote",
          product: requestedProduct.name,
          subject: `Enquiry: ${requestedProduct.name}`,
        }
      : initialValues,
  );
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [submitting, setSubmitting] = useState(false);

  const update = (field: FieldName, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitting) return;

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({
        type: "error",
        message: "Please correct the highlighted fields and try again.",
      });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "idle" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as { ok: boolean; code?: string };

      if (response.ok && data.ok) {
        setStatus({ type: "success" });
        setValues(initialValues);
      } else if (data.code === "NOT_CONFIGURED") {
        setStatus({ type: "not-configured" });
      } else {
        setStatus({
          type: "error",
          message:
            "Something went wrong while sending your message. Please try again or contact us by phone or email.",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message:
          "Something went wrong while sending your message. Please try again or contact us by phone or email.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-xl border border-line bg-white p-6 shadow-sm sm:p-8"
      aria-labelledby="contact-form-heading"
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
        Let&rsquo;s Connect
      </p>
      <h2
        id="contact-form-heading"
        className="mt-3 font-display text-2xl font-bold tracking-tight text-primary-deep sm:text-3xl"
      >
        Tell Us About Your Pumping Requirement
      </h2>
      <span
        aria-hidden="true"
        className="mt-4 block h-1 w-14 rounded-full bg-accent"
      />
      <p className="mt-4 text-base leading-relaxed text-ink">
        Share your application details with us. Whether you need product
        information, a quotation or technical guidance, our team is ready to
        understand your requirements.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field
          id="firstName"
          label="First Name"
          value={values.firstName}
          error={errors.firstName}
          onChange={(value) => update("firstName", value)}
          autoComplete="given-name"
          required
        />
        <Field
          id="lastName"
          label="Last Name"
          value={values.lastName}
          error={errors.lastName}
          onChange={(value) => update("lastName", value)}
          autoComplete="family-name"
          required
        />
        <Field
          id="email"
          label="Email Address"
          type="email"
          value={values.email}
          error={errors.email}
          onChange={(value) => update("email", value)}
          autoComplete="email"
          required
        />
        <Field
          id="phone"
          label="Phone"
          type="tel"
          value={values.phone}
          error={errors.phone}
          onChange={(value) => update("phone", value)}
          autoComplete="tel"
        />

        <SelectField
          id="enquiryType"
          label="What can we help you with?"
          value={values.enquiryType}
          error={errors.enquiryType}
          onChange={(value) => update("enquiryType", value)}
          required
        >
          {ENQUIRY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </SelectField>

        <SelectField
          id="product"
          label="Which pump or product are you interested in?"
          hint="Optional"
          value={values.product}
          onChange={(value) => update("product", value)}
        >
          <option value={NO_PRODUCT}>{NO_PRODUCT}</option>
          {products.map((product) => (
            <option key={product.slug} value={product.name}>
              {product.name}
            </option>
          ))}
          <option value="Other">Other</option>
        </SelectField>

        <div className="sm:col-span-2">
          <Field
            id="subject"
            label="Subject"
            value={values.subject}
            error={errors.subject}
            onChange={(value) => update("subject", value)}
          />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel id="message" label="Message" required />
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={inputClasses(Boolean(errors.message))}
            placeholder="Tell us about your application, fluid type, required flow rate, operating pressure or any other relevant details..."
          />
          <FieldError id="message" error={errors.message} />
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-lg bg-primary-soft p-4 text-sm leading-relaxed text-primary-deep">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>
          Not sure which pump is right for your application? That&rsquo;s okay.
          Simply describe what you need to pump, and share any specifications
          you have available.
        </p>
      </div>

      {status.type === "error" ? (
        <p
          role="alert"
          className="mt-6 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {status.message}
        </p>
      ) : null}

      {status.type === "not-configured" ? (
        <p
          role="status"
          className="mt-6 flex items-start gap-2 rounded-md border border-steel bg-primary-soft px-4 py-3 text-sm font-medium text-primary-deep"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>
            Email delivery is not yet connected on this website, so your message
            has not been sent. Please email{" "}
            <a
              href={`mailto:${site.contact.email}`}
              className="font-semibold underline underline-offset-2"
            >
              {site.contact.email}
            </a>{" "}
            or call{" "}
            <a
              href={site.contact.phones[0].href}
              className="font-semibold underline underline-offset-2"
            >
              {site.contact.phones[0].label}
            </a>{" "}
            and we will get back to you soon.
          </span>
        </p>
      ) : null}

      {status.type === "success" ? (
        <p
          role="status"
          className="mt-6 flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
        >
          <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          Thanks for contacting us! We will get back to you soon!
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-primary-deep shadow-sm transition-all hover:bg-accent-dark hover:shadow-md focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting ? (
          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          <Send aria-hidden="true" className="size-4" />
        )}
        {submitting ? "Sending..." : "Send My Enquiry"}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  error,
  onChange,
  type = "text",
  autoComplete,
  required,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <FieldLabel id={id} label={label} required={required} />
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputClasses(Boolean(error))}
      />
      <FieldError id={id} error={error} />
    </div>
  );
}

function SelectField({
  id,
  label,
  hint,
  value,
  error,
  onChange,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="sm:col-span-2">
      <FieldLabel id={id} label={label} hint={hint} required={required} />
      <div className="relative">
        <select
          id={id}
          name={id}
          required={required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(inputClasses(Boolean(error)), "appearance-none pr-10")}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted"
        />
      </div>
      <FieldError id={id} error={error} />
    </div>
  );
}

function FieldLabel({
  id,
  label,
  hint,
  required,
}: {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={id} className="block text-sm font-semibold text-ink">
      {label}
      {required ? (
        <span aria-hidden="true" className="ml-0.5 text-accent">
          *
        </span>
      ) : null}
      {hint ? (
        <span className="ml-2 text-xs font-medium text-muted">({hint})</span>
      ) : null}
    </label>
  );
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;

  return (
    <p
      id={`${id}-error`}
      className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
    >
      <AlertCircle aria-hidden="true" className="size-3.5" />
      {error}
    </p>
  );
}
