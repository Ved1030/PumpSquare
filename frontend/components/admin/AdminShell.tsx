"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Package, ShieldCheck, Tags, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROLE_LABELS, hasPermission, type AdminRole } from "@/lib/auth/roles";

type AdminUser = { id: string; email: string; name: string; role: AdminRole };

const NAV = [
  { href: "/admin", label: "Products", icon: Package, exact: true },
  { href: "/admin/categories", label: "Categories", icon: Tags, exact: false },
  { href: "/admin/team", label: "Team", icon: Users, exact: false, superadminOnly: true },
] as const;

export default function AdminShell({
  user,
  children,
}: {
  user: AdminUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-svh flex-col bg-slate-50 lg:flex-row">
      <aside className="flex shrink-0 flex-col bg-primary-deep text-white lg:w-64">
        <div className="flex items-center gap-3 px-5 py-5">
          <span className="grid size-10 place-items-center rounded-lg bg-white/10">
            <ShieldCheck aria-hidden="true" className="size-5 text-accent" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-base font-bold leading-tight">Pumpsquare</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-primary-soft">Admin Console</p>
          </div>
        </div>

        <nav aria-label="Admin sections" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-0">
          {NAV.filter((item) => !("superadminOnly" in item) || hasPermission(user.role, "users:manage")).map(
            (item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active ? "bg-white/15 text-white" : "text-primary-soft hover:bg-white/10 hover:text-white",
                  )}
                >
                  <item.icon aria-hidden="true" className="size-4" />
                  {item.label}
                </Link>
              );
            },
          )}
        </nav>

        <div className="mt-auto hidden border-t border-white/10 p-4 lg:block">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="truncate text-xs text-primary-soft">{user.email}</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-accent">
            {ROLE_LABELS[user.role]}
          </p>
          <button
            type="button"
            onClick={signOut}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/20 px-3 py-2 text-sm font-semibold text-white transition-colors hover:border-accent hover:bg-white/10"
          >
            <LogOut aria-hidden="true" className="size-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-line bg-white px-4 py-3 lg:hidden">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              {ROLE_LABELS[user.role]}
            </p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-line px-3 py-2 text-xs font-semibold text-ink"
          >
            <LogOut aria-hidden="true" className="size-3.5" />
            Sign out
          </button>
        </header>
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
