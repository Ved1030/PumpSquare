import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Download, FileText, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getProduct, productSlugs } from "@/lib/products";

interface ProductDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  
  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | Pumpsquare Systems LLP`,
      description: product.description,
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-primary-deep mb-4">Product Not Found</h1>
          <p className="text-muted mb-6">The requested product page does not exist.</p>
          <Link href="/#products" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-white font-semibold transition-colors hover:bg-accent-dark">
            Back to Products
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <nav aria-label="Breadcrumb" className="bg-white border-b border-line">
        <div className="mx-auto max-w-[1200px] px-4 py-4 sm:px-6 lg:px-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <li>
              <Link href="/" className="transition-colors hover:text-primary">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/#products" className="transition-colors hover:text-primary">Products</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-primary font-medium" aria-current="page">{product.name}</li>
          </ol>
        </div>
      </nav>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16 items-start">
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-white shadow-xl shadow-primary/5">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority
                  className="object-contain p-6 sm:p-8"
                />
              </div>
              {product.catalogueUrl && (
                <a
                  href={product.catalogueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-line bg-white text-sm font-semibold text-primary shadow-sm transition-all duration-200 hover:bg-primary-soft hover:border-accent/40 hover:shadow-md"
                >
                  <FileText className="size-4" aria-hidden="true" />
                  <span>Download Catalogue</span>
                  <Download className="size-4" aria-hidden="true" />
                </a>
              )}
            </div>

            <div className="lg:pt-4">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="h-1 w-10 rounded-full bg-accent flex-shrink-0" />
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                  Product Series
                </p>
              </div>
              <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-primary-deep">
                {product.name}
              </h1>
              <span aria-hidden="true" className="mt-3 block h-1 w-16 rounded-full bg-accent" />
              <p className="mt-8 text-lg leading-[1.8] text-muted">
                {product.description}
              </p>

              <div className="mt-10">
                <h2 className="font-display text-lg font-bold text-primary-deep">Available Series</h2>
                <ul className="mt-4 space-y-3">
                  {product.series.map((series, index) => (
                    <li key={index} className="flex items-center gap-3 rounded-lg border border-line bg-white p-4 shadow-sm transition-colors hover:border-accent/40">
                      <Check className="size-5 shrink-0 text-accent" aria-hidden="true" />
                      <span className="font-medium text-ink">{series}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <h2 className="font-display text-lg font-bold text-primary-deep">Key Features</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 rounded-lg border border-line bg-white p-4 shadow-sm">
                      <Check className="size-5 shrink-0 mt-0.5 text-accent" aria-hidden="true" />
                      <span className="text-muted">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <h2 className="font-display text-lg font-bold text-primary-deep">Applications</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.applications.map((app, index) => (
                    <span key={index} className="rounded-full border border-line bg-white px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-accent/40 hover:bg-primary-soft">
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              {product.specifications && (
                <div className="mt-10">
                  <h2 className="font-display text-lg font-bold text-primary-deep">Specifications</h2>
                  <div className="mt-4 rounded-xl border border-line bg-white overflow-hidden">
                    <dl className="divide-y divide-line">
                      {Object.entries(product.specifications).map(([key, values], index) => (
                        <div key={index} className="grid grid-cols-[1fr_2fr] px-5 py-4 transition-colors hover:bg-primary-soft/30">
                          <dt className="font-medium text-muted">{key}</dt>
                          <dd className="text-ink">{values.join(", ")}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              )}

              {product.materials && (
                <div className="mt-10">
                  <h2 className="font-display text-lg font-bold text-primary-deep">Materials of Construction</h2>
                  <div className="mt-4 rounded-xl border border-line bg-white overflow-hidden">
                    <dl className="divide-y divide-line">
                      {Object.entries(product.materials).map(([key, value], index) => (
                        <div key={index} className="grid grid-cols-[1fr_2fr] px-5 py-4 transition-colors hover:bg-primary-soft/30">
                          <dt className="font-medium text-muted">{key}</dt>
                          <dd className="text-ink">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              )}

              <div className="mt-12 rounded-2xl border border-line bg-primary p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">
                      Need More Information?
                    </h2>
                    <p className="mt-2 text-silver">
                      Contact our technical team for detailed specifications, pricing, and application support.
                    </p>
                  </div>
                  <Link
                    href={`/contact?product=${slug}`}
                    className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-accent text-primary-deep font-semibold transition-colors hover:bg-accent-dark"
                  >
                    Request a Quote
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function generateStaticParams() {
  return productSlugs.map((slug) => ({ slug }));
}