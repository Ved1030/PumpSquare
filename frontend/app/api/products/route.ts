import { NextResponse } from "next/server";
import { getCategories } from "@/lib/products-server";
import { getPublishedCatalogue } from "@/lib/product-catalogue";

/** Public catalogue: published products only, never drafts. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();
  const category = searchParams.get("category");

  const [products, categories] = await Promise.all([getPublishedCatalogue(), getCategories()]);

  let slugs = new Set<string>();
  if (category) {
    const selected = categories.find((item) => item.slug === category);
    slugs = selected
      ? new Set([selected.slug, ...categories.filter((item) => item.parentId === selected.id).map((item) => item.slug)])
      : new Set([category]);
  }

  const filtered = products.filter((product) => {
    if (category && !(product.category && slugs.has(product.category.slug))) return false;
    if (query && !product.name.toLowerCase().includes(query)) return false;
    return true;
  });

  return NextResponse.json(
    { ok: true, products: filtered },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } },
  );
}
