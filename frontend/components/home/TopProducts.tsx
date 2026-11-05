import { getPublishedCatalogue } from "@/lib/product-catalogue";
import ProductCarousel from "@/components/home/ProductCarousel";

export default async function TopProducts() {
  const products = await getPublishedCatalogue();
  if (products.length === 0) return null;

  return <ProductCarousel products={products} />;
}
