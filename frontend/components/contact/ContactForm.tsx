"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

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
  subject: "",
  message: "",
};

function validate(values: FormState) {
  const errors: Partial<Record<keyof FormState, string>> = {};

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

  if (!values.message.trim()) errors.message = "Message is required.";

  return errors;
}

export default function ContactForm() {
  const [values, setValues] = useState<FormState>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof FormState, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
      className="rounded-xl border border-line bg-white p-8 shadow-sm"
      aria-labelledby="contact-form-heading"
    >
      <h2
        id="contact-form-heading"
        className="font-display text-2xl font-bold tracking-tight text-primary-deep"
      >
        Send Us an Enquiry
      </h2>
      <span
        aria-hidden="true"
        className="mt-4 block h-1 w-14 rounded-full bg-accent"
      />

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
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-ink"
          >
            Message <span className="text-accent">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={cn(
              "mt-2 w-full rounded-md border bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted/70 transition-colors focus:border-primary focus:bg-white focus:outline-none",
              errors.message ? "border-red-500" : "border-line",
            )}
            placeholder="Tell us about your pump requirement..."
          />
          {errors.message ? (
            <p
              id="message-error"
              className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
            >
              <AlertCircle aria-hidden="true" className="size-3.5" />
              {errors.message}
            </p>
          ) : null}
        </div>
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
          className="mt-6 flex items-start gap-2 rounded-md border border-steel bg-primary-soft px-4 py-3 text-sm font-medium text-primary-dark"
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
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-6 py-3.5 text-sm font-semibold text-primary-deep shadow-sm transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting ? "Sending..." : "Submit"}
        <Send aria-hidden="true" className="size-4" />
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
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label} {required ? <span className="text-accent">*</span> : null}
      </label>
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
        className={cn(
          "mt-2 w-full rounded-md border bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted/70 transition-colors focus:border-primary focus:bg-white focus:outline-none",
          error ? "border-red-500" : "border-line",
        )}
      />
      {error ? (
        <p
          id={`${id}-error`}
          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
        >
          <AlertCircle aria-hidden="true" className="size-3.5" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
