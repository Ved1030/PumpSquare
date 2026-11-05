"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { PublicCategory } from "@/lib/products";
import { cn } from "@/lib/utils";

function buildHref(category: string | null, query: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (query.trim()) params.set("q", query.trim());
  const suffix = params.toString();
  return suffix ? `/products?${suffix}` : "/products";
}

export default function CatalogueFilters({
  categories,
  activeCategory,
  query,
  total,
}: {
  categories: PublicCategory[];
  activeCategory: string | null;
  query: string;
  total: number;
}) {
  const router = useRouter();
  const [value, setValue] = useState(query);
  const mounted = useRef(false);

  // Debounced server-side filtering keeps the URL shareable.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (value.trim() === query) return;

    const timer = setTimeout(() => {
      router.replace(buildHref(activeCategory, value), { scroll: false });
    }, 350);
    return () => clearTimeout(timer);
  }, [value, query, activeCategory, router]);

  const chip = (active: boolean) =>
    cn(
      "inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
      active
        ? "border-primary bg-primary text-white"
        : "border-line bg-white text-ink hover:border-primary/40 hover:text-primary",
    );

  return (
    <div className="rounded-xl border border-line bg-white p-4 sm:p-5">
      <label htmlFor="product-search" className="sr-only">
        Search products
      </label>
      <div className="relative">
        <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
        <input
          id="product-search"
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search products, e.g. twin screw"
          className="w-full rounded-lg border border-line bg-surface py-3 pr-4 pl-10 text-sm text-ink placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
        <button
          type="button"
          onClick={() => router.replace(buildHref(null, value), { scroll: false })}
          className={chip(!activeCategory)}
          aria-pressed={!activeCategory}
        >
          All <span className="ml-1.5 text-xs opacity-70">{total}</span>
        </button>
        {categories.filter((category) => !category.parentId).map((category) => (
          <button
            key={category.slug}
            type="button"
            onClick={() => router.replace(buildHref(category.slug, value), { scroll: false })}
            className={chip(activeCategory === category.slug)}
            aria-pressed={activeCategory === category.slug}
          >
            {category.name}
            {categories.some((child) => child.parentId === category.id) ? (
              <span className="ml-1.5 text-xs font-normal opacity-70">incl. series</span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
