"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, X } from "lucide-react";
import { navLinks, productMenu } from "@/lib/content";
import { cn } from "@/lib/utils";

type MobileNavigationProps = {
  pathname: string;
  open: boolean;
  onClose: () => void;
};

export default function MobileNavigation({
  pathname,
  open,
  onClose,
}: MobileNavigationProps) {
  const [productsOpen, setProductsOpen] = useState(false);

  if (!open) return null;

  return (
    <div className="relative z-[10000] border-t border-white/15 bg-primary-deep/95 backdrop-blur-md [text-shadow:none] md:hidden">
      <nav
        aria-label="Mobile navigation"
        className="mx-auto max-w-7xl px-4 py-4 sm:px-6"
      >
        <ul className="flex flex-col gap-1">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block rounded-md border-l-4 px-3 py-2.5 text-base font-medium transition-colors",
                    active
                      ? "border-accent bg-white/10 font-semibold text-white"
                      : "border-transparent text-white/90 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setProductsOpen((value) => !value)}
              aria-expanded={productsOpen}
              className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-base font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
            >
              Products
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  "size-4 text-white/70 transition-transform",
                  productsOpen && "rotate-180 text-accent",
                )}
              />
            </button>
            {productsOpen ? (
              <div className="mt-1 space-y-4 border-l-2 border-white/20 pl-4">
                {productMenu.map((group) => (
                  <div key={group.heading}>
                    <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-silver">
                      {group.heading}
                    </p>
                    <ul className="mt-1">
                      {group.items.map((item) => (
                        <li key={item.label}>
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={onClose}
                            className="block rounded-md px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                          >
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}
          </li>
        </ul>

        <Link
          href="/contact"
          onClick={onClose}
          className="mt-4 flex w-full items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
        >
          Request a Quote
        </Link>
      </nav>
    </div>
  );
}

export function MobileMenuButton({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="mobile-navigation"
      aria-label={open ? "Close menu" : "Open menu"}
      className="grid size-11 place-items-center rounded-md border border-white/40 text-white transition-colors hover:border-white hover:bg-white/10 md:hidden"
    >
      {open ? (
        <X aria-hidden="true" className="size-5" />
      ) : (
        <span className="grid gap-1.5">
          <span className="block h-0.5 w-5 bg-current" />
          <span className="block h-0.5 w-5 bg-current" />
          <span className="block h-0.5 w-5 bg-current" />
        </span>
      )}
    </button>
  );
}
