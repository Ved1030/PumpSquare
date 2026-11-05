"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, PackageSearch, Search, X, ChevronDown } from "lucide-react";
import type { PublicCategory, ProductSummary } from "@/lib/products";
import ProductImage from "@/components/products/ProductImage";
import { cn } from "@/lib/utils";

function buildHref(category: string | null, query: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (query.trim()) params.set("q", query.trim());
  const suffix = params.toString();
  return suffix ? `/products?${suffix}` : "/products";
}

function CategoryFilters({
  categories,
  activeCategory,
  query,
  total,
  productCounts,
}: {
  categories: PublicCategory[];
  activeCategory: string | null;
  query: string;
  total: number;
  productCounts: Record<string, number>;
}) {
  const router = useRouter();

  const chip = (active: boolean, count: number, label: string) => (
    <button
      type="button"
      onClick={() => router.replace(buildHref(active ? null : label.toLowerCase().replace(/\s+/g, "-"), query), { scroll: false })}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 whitespace-nowrap",
        active
          ? "border-primary bg-primary text-white shadow-sm"
          : "border-line bg-white text-ink hover:border-primary/40 hover:text-primary hover:bg-primary-soft/30",
      )}
    >
      {label}
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex items-center justify-center min-w-[1.5rem] h-5 rounded-full text-[10px] font-medium",
          active ? "bg-accent text-primary-deep" : "bg-primary-soft text-primary",
        )}
      >
        {count}
      </span>
    </button>
  );

  const topLevelCategories = categories.filter((category) => !category.parentId);

  return (
    <div className="mt-4" role="group" aria-label="Filter by category">
      <button
        type="button"
        onClick={() => router.replace(buildHref(null, query), { scroll: false })}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 whitespace-nowrap",
          !activeCategory
            ? "border-primary bg-primary text-white shadow-sm"
            : "border-line bg-white text-ink hover:border-primary/40 hover:text-primary hover:bg-primary-soft/30",
        )}
        aria-pressed={!activeCategory}
      >
        All
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex items-center justify-center min-w-[1.5rem] h-5 rounded-full text-[10px] font-medium",
            !activeCategory ? "bg-accent text-primary-deep" : "bg-primary-soft text-primary",
          )}
        >
          {total}
        </span>
      </button>
      {topLevelCategories.map((category) => {
        const childSlugs = categories
          .filter((child) => child.parentId === category.id)
          .map((child) => child.slug);
        const count =
          (productCounts[category.slug] || 0) +
          childSlugs.reduce((sum, slug) => sum + (productCounts[slug] || 0), 0);

        return (
          <button
            key={category.slug}
            type="button"
            onClick={() => router.replace(buildHref(category.slug, query), { scroll: false })}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 whitespace-nowrap",
              activeCategory === category.slug
                ? "border-primary bg-primary text-white shadow-sm"
                : "border-line bg-white text-ink hover:border-primary/40 hover:text-primary hover:bg-primary-soft/30",
            )}
            aria-pressed={activeCategory === category.slug}
          >
            {category.name}
            {childSlugs.length > 0 && (
              <span className="hidden sm:inline-flex items-center justify-center min-w-[1.5rem] h-5 rounded-full text-[10px] font-normal opacity-70 bg-primary-soft/50 text-primary">
                incl.
              </span>
            )}
            <span
              aria-hidden="true"
              className={cn(
                "inline-flex items-center justify-center min-w-[1.5rem] h-5 rounded-full text-[10px] font-medium",
                activeCategory === category.slug ? "bg-accent text-primary-deep" : "bg-primary-soft text-primary",
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ProductSearch({
  value,
  onChange,
  onClear,
  placeholder = "Search products by name or category...",
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-line bg-white py-3.5 pr-14 pl-12 text-sm text-ink placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
        aria-label="Search products"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute top-1/2 right-3.5 size-8 -translate-y-1/2 rounded-lg flex items-center justify-center text-muted hover:text-ink hover:bg-primary-soft/30 transition-colors"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <li>
      <Link
        href={`/products/${product.slug}`}
        prefetch={true}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:border-accent/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
      >
        <div className="relative aspect-[4/3] bg-primary-soft/30 overflow-hidden">
          {product.image ? (
            <ProductImage
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full place-items-center text-xs text-muted">Image coming soon</div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          {product.category ? (
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              {product.category.name}
            </p>
          ) : null}
          <h3 className="mt-2 font-display text-lg font-bold text-primary-deep group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          {product.summary ? (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{product.summary}</p>
          ) : null}
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
            View details
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </Link>
    </li>
  );
}

function EmptyState({ query, activeCategory, onReset }: { query: string; activeCategory: string | null; onReset: () => void }) {
  return (
    <div className="mt-10 rounded-2xl border border-line bg-white p-12 sm:p-16 text-center">
      <PackageSearch aria-hidden="true" className="mx-auto size-10 text-muted/50" />
      <p className="mt-6 font-display text-xl font-bold text-primary-deep">
        {query
          ? `No products match “${query}”`
          : activeCategory
          ? "No products in this category yet"
          : "No products available"}
      </p>
      <p className="mt-2 text-sm text-muted max-w-xs mx-auto">
        {query
          ? "Try adjusting your search terms or clearing the filter."
          : activeCategory
          ? "This category doesn't have any published products at the moment."
          : "There are currently no published products in the catalogue."}
      </p>
      <button
        onClick={onReset}
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-primary bg-white px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary-soft transition-colors"
      >
        <ChevronDown className="size-4 rotate-180" />
        {query ? "Clear search" : "Show all products"}
      </button>
    </div>
  );
}

function ResultSummary({ count, query, activeCategory, categories }: { count: number; query: string; activeCategory: string | null; categories: PublicCategory[] }) {
  const activeCat = categories.find((c) => c.slug === activeCategory);
  
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
      <p>
        Showing <span className="font-semibold text-ink">{count}</span> product{count !== 1 ? "s" : ""}
        {activeCategory && activeCat && (
          <> in <span className="font-semibold text-primary">{activeCat.name}</span> </>
        )}
        {query && !activeCategory && <><span className="font-semibold text-primary">“{query}”</span></>}
        {query && activeCategory && activeCat && <><span className="font-semibold text-primary">“{query}”</span> in <span className="font-semibold text-primary">{activeCat.name}</span></>}
      </p>
    </div>
  );
}

function ExplorationSection() {
  return (
    <section aria-labelledby="exploration-heading" className="mt-16 rounded-2xl border border-line bg-white shadow-sm overflow-hidden">
      <div className="grid items-center gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_auto]">
        <div>
          <span aria-hidden="true" className="mb-4 block h-1 w-10 rounded-full bg-accent" />
          <h2 id="exploration-heading" className="max-w-lg font-display text-2xl font-bold tracking-tight text-primary-deep sm:text-3xl">
            Looking for the Right Pumping Solution?
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            Explore our range of pumping equipment or contact our team for assistance in identifying the right product for your application.
          </p>
        </div>
        <div className="lg:justify-self-end">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-accent px-8 py-3.5 text-sm font-semibold text-primary-deep shadow-sm transition-all hover:bg-accent-dark hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            Request a Quote
            <ArrowUpRight aria-hidden="true" className="ml-2 size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

interface ProductCatalogueClientProps {
  products: ProductSummary[];
  categories: PublicCategory[];
  activeCategory: string | null;
  query: string;
  productCounts: Record<string, number>;
}

export default function ProductCatalogueClient({ 
  products, 
  categories, 
  activeCategory, 
  query, 
  productCounts 
}: ProductCatalogueClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(query);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    const timer = setTimeout(() => {
      router.replace(buildHref(activeCategory, value), { scroll: false });
    }, 350);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    router.replace(buildHref(activeCategory, ""), { scroll: false });
  };

  const slugs = new Set(
    activeCategory
      ? [
          activeCategory,
          ...categories.filter((category) => category.parentId === activeCategory).map((category) => category.slug),
        ]
      : [],
  );

  const visible = products.filter((product) => {
    if (activeCategory && !(product.category && slugs.has(product.category.slug))) return false;
    if (query && !product.name.toLowerCase().includes(query)) return false;
    return true;
  });

  return (
    <div className="mt-8">
      <div className="rounded-2xl border border-line bg-white p-4 sm:p-5">
        <label htmlFor="product-search" className="sr-only">
          Search products
        </label>
        <ProductSearch
          value={searchValue}
          onChange={handleSearchChange}
          onClear={handleClearSearch}
          placeholder="Search products by name or category..."
        />
        <CategoryFilters
          categories={categories}
          activeCategory={activeCategory}
          query={query}
          total={products.length}
          productCounts={productCounts}
        />
      </div>

      <ResultSummary
        count={visible.length}
        query={query}
        activeCategory={activeCategory}
        categories={categories}
      />

      {visible.length === 0 ? (
        <EmptyState
          query={query}
          activeCategory={activeCategory}
          onReset={() => router.replace("/products", { scroll: false })}
        />
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {visible.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </ul>
      )}

      <ExplorationSection />
    </div>
  );
}