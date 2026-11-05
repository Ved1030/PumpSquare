import { Suspense } from "react";
import { getCategories, getPublishedProducts } from "@/lib/products-server";
import ProductCatalogueClient from "@/components/products/ProductCatalogueClient";
import type { PublicCategory, ProductSummary } from "@/lib/products";

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
    <div className="mt-8 animate-pulse space-y-6" aria-hidden="true">
      <div className="rounded-2xl border border-line bg-white p-4 sm:p-5">
        <div className="h-11 rounded-lg bg-line/60 w-3/4" />
        <div className="mt-4 h-12 rounded-lg bg-line/60" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-72 rounded-xl bg-line/50" />
        ))}
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