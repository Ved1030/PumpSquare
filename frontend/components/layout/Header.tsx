"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { navLinks, productMenu } from "@/lib/content";
import { cn } from "@/lib/utils";
import { usePagePathname } from "@/lib/use-page-pathname";
import Logo from "./Logo";
import MobileNavigation, { MobileMenuButton } from "./MobileNavigation";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const productsRef = useRef<HTMLLIElement | null>(null);

  const path = usePagePathname();
  const hasOverlayHero = path === "/" || path === "/about" || path === "/industries" || path === "/contact" || path === "/products" || path.startsWith("/products/");
  const transparent = hasOverlayHero && !scrolled;

  const primaryLinks = navLinks.filter((link) => link.label !== "Contact Us");
  const contactLink = navLinks.find((link) => link.label === "Contact Us");

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setProductsOpen(false);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 40;
      setScrolled((prev) => (prev === next ? prev : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!productsOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProductsOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (
        productsRef.current &&
        !productsRef.current.contains(event.target as Node)
      ) {
        setProductsOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [productsOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[9999] w-full transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-out",
        transparent
          ? "bg-transparent [text-shadow:0_1px_10px_rgba(0,59,92,0.55)]"
          : "bg-primary-deep shadow-[0_10px_30px_rgba(0,59,92,0.35)] backdrop-blur-md [text-shadow:none]",
      )}
    >
      <div className="relative z-[9999] mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo tone="light" />

        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {primaryLinks.map((link) => (
              <li key={link.href}>
                <NavLink href={link.href} active={pathname === link.href}>
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li ref={productsRef} className="relative">
              <button
                type="button"
                aria-expanded={productsOpen}
                aria-haspopup="menu"
                onClick={() => setProductsOpen((value) => !value)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  productsOpen
                    ? "text-accent"
                    : "text-white hover:text-accent",
                )}
              >
                Products
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "size-4 text-white/80 transition-transform duration-200",
                    productsOpen && "rotate-180 text-accent",
                  )}
                />
              </button>

              {productsOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 z-[10000] w-64 rounded-lg border border-line bg-white p-2 shadow-xl shadow-primary/10 [text-shadow:none]"
                >
                  {productMenu.map((group) => (
                    <div key={group.heading} className="py-1">
                      <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                        {group.heading}
                      </p>
                      <ul>
                        {group.items.map((item) => {
                          const external = /^https?:\/\//.test(item.href);
                          const className =
                            "block rounded-md px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-accent-soft hover:text-primary-deep";
                          return (
                            <li key={item.label}>
                              {external ? (
                                <a
                                  href={item.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  role="menuitem"
                                  onClick={() => setProductsOpen(false)}
                                  className={className}
                                >
                                  {item.label}
                                </a>
                              ) : (
                                <Link
                                  href={item.href}
                                  role="menuitem"
                                  onClick={() => setProductsOpen(false)}
                                  className={className}
                                >
                                  {item.label}
                                </Link>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : null}
            </li>
            {contactLink ? (
              <li>
                <NavLink
                  href={contactLink.href}
                  active={pathname === contactLink.href}
                >
                  {contactLink.label}
                </NavLink>
              </li>
            ) : null}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-primary-deep shadow-sm transition-colors hover:bg-accent-dark lg:inline-flex"
          >
            Request a Quote
          </Link>
          <MobileMenuButton
            open={mobileOpen}
            onToggle={() => setMobileOpen((value) => !value)}
          />
        </div>
      </div>

      <div id="mobile-navigation" className="z-[10000]">
        <MobileNavigation
          pathname={pathname}
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative block rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active ? "font-semibold text-white" : "text-white/90 hover:text-white",
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent transition-transform duration-200",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
        )}
      />
    </Link>
  );
}
