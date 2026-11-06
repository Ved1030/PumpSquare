"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight, PackageSearch, Search, X } from "lucide-react";
import type { PublicCategory, ProductSummary } from "@/lib/products";
import ProductImage from "@/components/products/ProductImage";
import { cn } from "@/lib/utils";

const SEARCH_DEBOUNCE_MS = 300;

function buildHref(category: string | null, query: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (query.trim()) params.set("q", query.trim());
  const suffix = params.toString();
  return suffix ? `/products?${suffix}` : "/products";
}

type CategoryNode = PublicCategory & { children: PublicCategory[] };

function buildCategoryTree(categories: PublicCategory[]): CategoryNode[] {
  return categories
    .filter((category) => !category.parentId)
    .map((category) => ({
      ...category,
      children: categories.filter((child) => child.parentId === category.id),
    }));
}

function countProductsForCategory(products: ProductSummary[], node: CategoryNode) {
  const slugs = new Set([node.slug, ...node.children.map((child) => child.slug)]);
  return products.filter((product) => product.category && slugs.has(product.category.slug)).length;
}

function matchesQuery(product: ProductSummary, query: string) {
  if (!query) return true;
  return (
    product.name.toLowerCase().includes(query) ||
    (product.summary ?? "").toLowerCase().includes(query) ||
    (product.category?.name ?? "").toLowerCase().includes(query)
  );
}

function CategorySidebar({
  tree,
  products,
  activeCategory,
  query,
}: {
  tree: CategoryNode[];
  products: ProductSummary[];
  activeCategory: string | null;
  query: string;
}) {
  const items = [
    { slug: null, name: "All Products", count: products.length },
    ...tree.map((node) => ({ slug: node.slug, name: node.name, count: countProductsForCategory(products, node) })),
  ];

  return (
    <>
      {/* Mobile: scrollable category navigation */}
      <nav aria-label="Browse categories" className="-mx-4 sm:-mx-6 lg:hidden">
        <ul className="flex gap-2 overflow-x-auto px-4 pb-1 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => {
            const active = item.slug === activeCategory;
            return (
              <li key={item.slug ?? "all"} className="shrink-0">
                <Link
                  href={buildHref(item.slug, query)}
                  scroll={false}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors duration-200",
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-line bg-white text-primary-deep hover:border-primary/50 hover:text-primary",
                  )}
                >
                  {item.name}
                  <span
                    className={cn(
                      "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
                      active ? "bg-accent text-primary-deep" : "bg-primary-soft text-primary",
                    )}
                  >
                    {item.count}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Desktop: sticky sidebar card */}
      <nav
        aria-label="Browse categories"
        className="hidden rounded-xl border border-line bg-white shadow-[0_1px_2px_rgba(0,59,92,0.04)] lg:block"
      >
        <h2 className="border-b border-line px-5 py-4 font-display text-sm font-bold tracking-[0.02em] text-primary-deep">
          Browse Categories
        </h2>
        <ul className="p-2.5">
          {items.map((item) => {
            const active = item.slug === activeCategory;
            return (
              <li key={item.slug ?? "all"}>
                <Link
                  href={buildHref(item.slug, query)}
                  scroll={false}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "group relative flex items-center justify-between gap-2 rounded-lg py-2.5 pr-3 pl-4 text-sm transition-colors duration-200",
                    active
                      ? "bg-primary-soft font-semibold text-primary-deep"
                      : "font-medium text-primary-deep hover:bg-[#F2F2F2] hover:text-primary",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-full bg-accent transition-opacity duration-200",
                      active ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="truncate">{item.name}</span>
                  <span
                    className={cn(
                      "inline-flex h-5 min-w-6 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums",
                      active ? "bg-white text-primary" : "bg-[#F2F2F2] text-muted group-hover:bg-white group-hover:text-primary",
                    )}
                  >
                    {item.count}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

function SearchField({
  value,
  onChange,
  onClear,
  inputRef,
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="relative w-full sm:w-[340px] lg:w-[360px]">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted"
      />
      <input
        ref={inputRef}
        id="product-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && value) onClear();
        }}
        placeholder="Search products by name or category..."
        aria-label="Search products"
        className="h-11 w-full rounded-lg border border-line bg-white pr-10 pl-10 text-sm text-ink transition-colors placeholder:text-muted/80 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value ? (
        <button
          type="button"
          onClick={onClear}
          className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted transition-colors hover:bg-[#F2F2F2] hover:text-primary-deep"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}

function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <li className="h-full">
      <Link
        href={`/products/${product.slug}`}
        prefetch
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white shadow-[0_1px_3px_rgba(0,59,92,0.06)] transition-[box-shadow,transform,border-color] duration-250 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_12px_28px_-12px_rgba(0,59,92,0.25)]"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-primary-soft">
          {product.image ? (
            <ProductImage
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
              className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full place-items-center text-xs font-medium text-muted">Image coming soon</div>
          )}
        </div>
        <div className="flex flex-1 flex-col border-t border-line p-5">
          {product.category ? (
            <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-primary">{product.category.name}</p>
          ) : null}
          <h4 className="mt-1.5 font-display text-base leading-snug font-bold text-primary-deep transition-colors group-hover:text-primary">
            {product.name}
          </h4>
          {product.summary ? (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{product.summary}</p>
          ) : null}
          <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-primary">
            View Details
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-200 group-hover:translate-x-1"
            />
          </span>
        </div>
      </Link>
    </li>
  );
}

function ProductGrid({ products }: { products: ProductSummary[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </ul>
  );
}

function CategorySection({
  id,
  name,
  products,
  query,
}: {
  id?: string;
  name: string;
  products: ProductSummary[];
  query: string;
}) {
  return (
    <section aria-labelledby={id} className="scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div>
          <h3 id={id} className="font-display text-xl font-bold tracking-tight text-primary-deep sm:text-[22px]">
            {name}
          </h3>
          <span aria-hidden="true" className="mt-2.5 block h-[3px] w-10 rounded-full bg-accent" />
          <p className="mt-2 text-xs font-medium tracking-wide text-muted uppercase">
            {products.length} {products.length === 1 ? "Product" : "Products"}
          </p>
        </div>
        <Link
          href={buildHref(null, query)}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-deep"
        >
          View All
          <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="mt-5">
        <ProductGrid products={products} />
      </div>
    </section>
  );
}

function EmptyState({
  query,
  activeCategoryName,
  onClearSearch,
  onShowAll,
}: {
  query: string;
  activeCategoryName: string | null;
  onClearSearch: () => void;
  onShowAll: () => void;
}) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-white px-6 py-14 text-center">
      <PackageSearch aria-hidden="true" className="mx-auto size-9 text-silver" strokeWidth={1.5} />
      <p className="mt-5 font-display text-lg font-bold text-primary-deep">No products found.</p>
      <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted">
        {query
          ? activeCategoryName
            ? `Nothing in ${activeCategoryName} matches “${query}”. Try a different search or browse all categories.`
            : `Nothing in the catalogue matches “${query}”. Try a different search term.`
          : activeCategoryName
            ? `There are no published products in ${activeCategoryName} yet.`
            : "There are currently no published products in the catalogue."}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {query ? (
          <button
            type="button"
            onClick={onClearSearch}
            className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Clear Search
          </button>
        ) : null}
        {activeCategoryName ? (
          <button
            type="button"
            onClick={onShowAll}
            className="inline-flex items-center rounded-lg border border-line bg-white px-5 py-2.5 text-sm font-semibold text-primary-deep transition-colors hover:border-primary/50 hover:text-primary"
          >
            View All Products
          </button>
        ) : null}
      </div>
    </div>
  );
}

function EnquiryCta() {
  return (
    <section
      aria-labelledby="enquiry-heading"
      className="mt-14 rounded-xl border border-line bg-white p-6 shadow-[0_1px_3px_rgba(0,59,92,0.06)] sm:p-8"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
        <div>
          <h2
            id="enquiry-heading"
            className="font-display text-xl font-bold tracking-tight text-primary-deep sm:text-2xl"
          >
            Looking for the Right Pumping Solution?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Explore our range of pumping equipment or contact our team for assistance in identifying the right product
            for your application.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-accent px-7 py-3 text-sm font-semibold text-primary-deep transition-colors hover:bg-accent-dark focus-visible:ring-2 focus-visible:ring-accent md:self-auto"
        >
          Request a Quote
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
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
}: ProductCatalogueClientProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState(query);

  // Keep the input in sync when the URL changes via back/forward or a sidebar link.
  const lastQuery = useRef(query);
  useEffect(() => {
    if (query !== lastQuery.current) {
      lastQuery.current = query;
      setSearchValue(query);
    }
  }, [query]);

  useEffect(() => {
    if (searchValue.trim() === query) return;
    const timer = setTimeout(() => {
      router.replace(buildHref(activeCategory, searchValue), { scroll: false });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchValue, query, activeCategory, router]);

  const handleClearSearch = () => {
    setSearchValue("");
    lastQuery.current = "";
    router.replace(buildHref(activeCategory, ""), { scroll: false });
    inputRef.current?.focus();
  };

  const handleShowAll = () => {
    router.replace(buildHref(null, searchValue), { scroll: false });
  };

  const tree = buildCategoryTree(categories);
  const activeNode = activeCategory ? tree.find((node) => node.slug === activeCategory) ?? null : null;

  const scopedSlugs = activeNode
    ? new Set([activeNode.slug, ...activeNode.children.map((child) => child.slug)])
    : null;

  const visible = products.filter((product) => {
    if (scopedSlugs && !(product.category && scopedSlugs.has(product.category.slug))) return false;
    return matchesQuery(product, query);
  });

  const groupedSections = tree
    .map((node) => ({
      node,
      items: visible.filter((product) => product.category && product.category.slug === node.slug),
    }))
    .filter((section) => section.items.length > 0);

  // Published products whose category is left unset or inactive stay reachable
  // under All Products so no class of product silently disappears.
  const knownSlugs = new Set(tree.flatMap((node) => [node.slug, ...node.children.map((c) => c.slug)]));
  const ungrouped = visible.filter((product) => !product.category || !knownSlugs.has(product.category.slug));

  const activeCategoryName = activeNode?.name ?? null;

  return (
    <div className="mt-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="catalogue-heading"
            className="font-display text-2xl font-bold tracking-tight text-primary-deep sm:text-3xl"
          >
            Product Catalogue
          </h2>
          <span aria-hidden="true" className="mt-3 block h-1 w-14 rounded-full bg-accent" />
        </div>
        <div className="w-full sm:w-auto">
          <label htmlFor="product-search" className="sr-only">
            Search products
          </label>
          <SearchField value={searchValue} onChange={setSearchValue} onClear={handleClearSearch} inputRef={inputRef} />
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <aside className="lg:w-[240px] lg:shrink-0">
          <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
            <CategorySidebar tree={tree} products={products} activeCategory={activeCategory} query={query} />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <p aria-live="polite" className="mb-5 text-sm text-muted">
            {activeCategoryName ? (
              <>
                Showing{" "}
                <span className="font-semibold text-primary-deep">
                  {visible.length} {visible.length === 1 ? "product" : "products"}
                </span>{" "}
                in <span className="font-semibold text-primary">{activeCategoryName}</span>
                {query ? (
                  <>
                    {" "}
                    for “<span className="font-semibold text-primary-deep">{query}</span>”
                  </>
                ) : null}
              </>
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold text-primary-deep">
                  {visible.length} {visible.length === 1 ? "product" : "products"}
                </span>{" "}
                across {groupedSections.length + (ungrouped.length ? 1 : 0)}{" "}
                {groupedSections.length + (ungrouped.length ? 1 : 0) === 1 ? "category" : "categories"}
                {query ? (
                  <>
                    {" "}
                    matching “<span className="font-semibold text-primary-deep">{query}</span>”
                  </>
                ) : null}
              </>
            )}
          </p>

          {visible.length === 0 ? (
            <EmptyState
              query={query}
              activeCategoryName={activeCategoryName}
              onClearSearch={handleClearSearch}
              onShowAll={handleShowAll}
            />
          ) : activeNode ? (
            <section aria-label={activeNode.name}>
              <ProductGrid products={visible} />
            </section>
          ) : (
            <div className="space-y-12">
              {groupedSections.map(({ node, items }) => (
                <CategorySection
                  key={node.slug}
                  id={`category-${node.slug}`}
                  name={node.name}
                  products={items}
                  query={query}
                />
              ))}
              {ungrouped.length > 0 ? (
                <CategorySection
                  id="category-other-products"
                  name="Other Products"
                  products={ungrouped}
                  query={query}
                />
              ) : null}
            </div>
          )}
        </div>
      </div>

      <EnquiryCta />
    </div>
  );
}
