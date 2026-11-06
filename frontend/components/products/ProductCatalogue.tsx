import { Suspense } from "react";
import { getCategories, getPublishedProducts } from "@/lib/products-server";
import ProductCatalogueClient from "@/components/products/ProductCatalogueClient";

interface ProductCatalogueProps {
  searchParams?: Promise<{ category?: string; q?: string }>;
}

async function ProductCatalogueServer({ searchParams }: ProductCatalogueProps) {
  const params = searchParams ? await searchParams : {};
  const [products, categories] = await Promise.all([getPublishedProducts(), getCategories()]);

  const activeCategory = categories.find((category) => category.slug === params.category)?.slug ?? null;
  const query = (params.q ?? "").trim().toLowerCase();

  const productCounts: Record<string, number> = {};
  products.forEach((product) => {
    if (product.category?.slug) {
      productCounts[product.category.slug] = (productCounts[product.category.slug] || 0) + 1;
    }
  });

  return (
    <ProductCatalogueClient
      products={products}
      categories={categories}
      activeCategory={activeCategory}
      query={query}
      productCounts={productCounts}
    />
  );
}

function CatalogueSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <div className="h-8 w-56 rounded bg-line/60" />
          <div className="h-1 w-14 rounded-full bg-accent/50" />
        </div>
        <div className="h-11 w-full rounded-lg bg-line/60 sm:w-[340px]" />
      </div>
      <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:gap-8">
        <div className="hidden w-[240px] shrink-0 space-y-2 rounded-xl border border-line p-2.5 lg:block">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-10 rounded-lg bg-line/40" />
          ))}
        </div>
        <div className="grid flex-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-80 rounded-xl bg-line/40" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductCatalogue({ searchParams }: ProductCatalogueProps) {
  return (
    <Suspense fallback={<CatalogueSkeleton />}>
      <ProductCatalogueServer searchParams={searchParams} />
    </Suspense>
  );
}