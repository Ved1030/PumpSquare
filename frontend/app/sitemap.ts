import type { MetadataRoute } from "next";
import { site } from "@/lib/content";
import { getPublishedSlugs } from "@/lib/products-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/about", "/industries", "/products", "/contact"];

  let productRoutes: string[] = [];
  try {
    productRoutes = (await getPublishedSlugs()).map((slug) => `/products/${slug}`);
  } catch (error) {
    console.error("Sitemap: product list unavailable:", error);
  }

  return [...staticRoutes, ...productRoutes].map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
