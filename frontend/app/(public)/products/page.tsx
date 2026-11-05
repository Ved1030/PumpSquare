import { Suspense } from "react";
import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ProductCatalogue from "@/components/products/ProductCatalogue";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse Pumpsquare Systems LLP pumps and process equipment — progressive cavity, screw, gear and lobe pumps for industrial applications.",
};

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  return (
    <>
      <PageHero
        title="Our Products"
        description="Pumps and process equipment engineered for demanding industrial duties — browse by category or search the catalogue."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Products" }]}
        backgroundImage="/images/Precision Manufacturing Workshop Blueprint.png"
        imageAlt="Precision machined pump components on engineering drawings"
        imagePosition="object-[45%_58%] lg:object-[36%_center]"
        imageClassName="scale-[0.62] md:scale-[0.8] lg:scale-100"
        imageOverlay={{
          desktop:
            "linear-gradient(90deg,rgba(0,59,92,0.90)_0%,rgba(0,59,92,0.72)_45%,rgba(0,59,92,0.20)_100%)",
          mobile:
            "linear-gradient(160deg,rgba(0,59,92,0.92)_0%,rgba(0,59,92,0.82)_55%,rgba(0,59,92,0.55)_100%)",
        }}
      />

      <section aria-labelledby="catalogue-heading" className="bg-surface py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2
            id="catalogue-heading"
            className="font-display text-2xl font-bold tracking-tight text-primary-deep sm:text-3xl"
          >
            Product Catalogue
          </h2>
          <span aria-hidden="true" className="mt-4 block h-1 w-14 rounded-full bg-accent" />

          <Suspense fallback={<CatalogueSkeleton />}>
            <ProductCatalogue searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </>
  );
}

function CatalogueSkeleton() {
  return (
    <div className="mt-8 animate-pulse space-y-6" aria-hidden="true">
      <div className="h-11 rounded-lg bg-line/60" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-72 rounded-xl bg-line/50" />
        ))}
      </div>
    </div>
  );
}
