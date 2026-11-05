import "server-only";
import { seedProducts, type ProductSummary } from "@/lib/products";
import { getPublishedProducts } from "@/lib/products-server";

let logged = false;

/**
 * Products shown in pickers and carousels. If the database is unreachable the
 * seeded catalogue keeps the public pages renderable; errors are never exposed.
 */
export async function getPublishedCatalogue(): Promise<ProductSummary[]> {
  try {
    return await getPublishedProducts();
  } catch (error) {
    if (!logged) {
      logged = true;
      console.error("Product catalogue unavailable, using bundled copy:", error);
    }
    return seedProducts.map(({ slug, name, image, category }) => ({ slug, name, image, category }));
  }
}
