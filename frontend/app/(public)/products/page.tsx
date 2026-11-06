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

      <section aria-labelledby="catalogue-heading" className="bg-surface py-12 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
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
