"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Loader2, LogIn } from "lucide-react";

/** Only allow redirects back into the admin area. */
function safeNext(value: string | null) {
  if (!value) return "/admin";
  if (!value.startsWith("/admin") || value.startsWith("//")) return "/admin";
  return value;
}

const MESSAGES: Record<string, string> = {
  INVALID: "Incorrect email or password.",
  LOCKED: "Too many failed attempts. Try again in 15 minutes.",
  THROTTLED: "Too many sign-in attempts. Try again later.",
  SERVER_ERROR: "Something went wrong. Please try again.",
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as { ok: boolean; code?: string };

      if (response.ok && data.ok) {
        router.replace(safeNext(searchParams.get("next")));
        router.refresh();
        return;
      }
      setError(MESSAGES[data.code ?? ""] ?? "Sign-in failed.");
    } catch {
      setError(MESSAGES.SERVER_ERROR);
    } finally {
      setSubmitting(false);
    }
  }

  const field =
    "mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-sm text-ink transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
      <div>
        <label htmlFor="admin-email" className="block text-sm font-semibold text-ink">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={field}
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="block text-sm font-semibold text-ink">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={field}
        />
      </div>

      {error ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          <LogIn aria-hidden="true" className="size-4" />
        )}
        {submitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
