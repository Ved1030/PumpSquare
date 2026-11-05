import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Sign-in",
  robots: { index: false, follow: false, nocache: true },
};

export const instant = false;

export default async function AdminLoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/admin");

  return (
    <div className="flex min-h-svh flex-col bg-primary-deep px-4 py-12">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div className="mb-8 flex items-center gap-3 text-white">
          <span className="grid size-11 place-items-center rounded-lg bg-white/10">
            <ShieldCheck aria-hidden="true" className="size-6 text-accent" />
          </span>
          <div>
            <p className="font-display text-lg font-bold leading-tight">Pumpsquare</p>
            <p className="text-xs uppercase tracking-[0.22em] text-primary-soft">
              Admin Console
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-xl sm:p-8">
          <h1 className="font-display text-2xl font-bold text-primary-deep">Sign in</h1>
          <p className="mt-2 text-sm text-muted">
            Restricted to approved Pumpsquare staff. Accounts are issued by an
            administrator.
          </p>
          <Suspense fallback={<div className="mt-8 h-64" />}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-8 text-center text-xs text-primary-soft/70">
          If you have lost access, ask a Superadmin to reset your account.
        </p>
      </div>
    </div>
  );
}
