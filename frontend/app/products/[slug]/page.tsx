import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Download, FileText, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductDetailProps {
  params: Promise<{ slug: string }>;
}

const productData: Record<string, {
  name: string;
  image: string;
  description: string;
  series: string[];
  features: string[];
  applications: string[];
  specifications?: Record<string, string[]>;
  materials?: Record<string, string>;
  catalogueUrl?: string;
}> = {
  "progressive-cavity-pumps": {
    name: "Progressive Cavity Pumps",
    image: "/images/products/progressive_cavity_pumps_small.jpg",
    description: "Progressive cavity pumps are positive displacement pumps that use a helical rotor and a double-threaded helical stator to create a continuous flow. These pumps are ideal for handling viscous, abrasive, and shear-sensitive fluids.",
    series: ["Standard Series", "Heavy Duty Series", "Sanitary Series"],
    features: [
      "Smooth, pulsation-free flow",
      "Self-priming capability",
      "Handles viscous and abrasive fluids",
      "Low shear rate for sensitive products",
      "Reversible flow direction",
      "Compact design with high efficiency"
    ],
    applications: [
      "Wastewater treatment",
      "Chemical processing",
      "Food and beverage",
      "Oil and gas",
      "Paper and pulp",
      "Ceramics and mining"
    ],
    specifications: {
      "Capacity": ["Up to 500 m³/hr"],
      "Pressure": ["Up to 48 bar"],
      "Temperature": ["-20°C to 150°C"],
      "Viscosity": ["Up to 1,000,000 cSt"],
      "Sizes": ["25mm to 300mm"],
      "Drive": ["Direct coupled, belt drive, VFD"]
    },
    materials: {
      "Stator": "Natural rubber, NBR, EPDM, Viton, PTFE",
      "Rotor": "Chrome plated steel, Stainless steel 316, Hardened tool steel",
      "Body": "Cast iron, Stainless steel 316, Alloy steel"
    },
    catalogueUrl: "/catalogues/progressive-cavity-pumps.pdf"
  },
  "triple-screw-pumps": {
    name: "Triple Screw Pumps",
    image: "/images/products/triple_screw_pumps_small.jpg",
    description: "Triple screw pumps are high-performance positive displacement pumps with three intermeshing screws. They provide smooth, pulsation-free flow and are ideal for lubricating oil, hydraulic, and fuel applications.",
    series: ["Low Pressure Series", "Medium Pressure Series", "High Pressure Series"],
    features: [
      "Extremely low noise and vibration",
      "High efficiency across wide operating range",
      "Pulsation-free continuous flow",
      "Self-lubricating screw design",
      "Bidirectional operation capability",
      "Compact and robust construction"
    ],
    applications: [
      "Power generation lubrication",
      "Marine engine lubrication",
      "Hydraulic systems",
      "Fuel oil transfer",
      "Industrial gearboxes",
      "Turbine lubrication"
    ],
    specifications: {
      "Capacity": ["Up to 1,500 m³/hr"],
      "Pressure": ["Up to 100 bar"],
      "Temperature": ["-10°C to 180°C"],
      "Viscosity": ["2 to 760 cSt"],
      "Sizes": ["40mm to 400mm"],
      "Drive": ["Direct coupled, motor mounted"]
    },
    materials: {
      "Screws": "Hardened alloy steel, Nitride treated",
      "Casing": "Cast iron, Ductile iron, Steel",
      "Bearings": "Product lubricated, External lubrication optional"
    },
    catalogueUrl: "/catalogues/triple-screw-pumps.pdf"
  },
  "external-gear-pumps": {
    name: "External Gear Pumps",
    image: "/images/products/external_gear_pumps_small.jpg",
    description: "External gear pumps use two identical gears rotating against each other to create flow. They are simple, reliable, and widely used for clean, lubricating fluids in industrial applications.",
    series: ["Standard Series", "High Pressure Series", "Magnetically Coupled Series"],
    features: [
      "Simple, robust construction",
      "High pressure capability",
      "Bidirectional operation",
      "Compact design",
      "Cost-effective solution",
      "Easy maintenance"
    ],
    applications: [
      "Hydraulic power units",
      "Lubrication systems",
      "Fuel oil systems",
      "Chemical dosing",
      "Cooling systems",
      "Filtration systems"
    ],
    specifications: {
      "Capacity": ["Up to 300 m³/hr"],
      "Pressure": ["Up to 250 bar"],
      "Temperature": ["-20°C to 200°C"],
      "Viscosity": ["10 to 100,000 cSt"],
      "Sizes": ["15mm to 150mm"],
      "Drive": ["Direct coupled, close coupled, bell housing"]
    },
    materials: {
      "Gears": "Hardened steel, Cast iron, Stainless steel",
      "Body": "Cast iron, Ductile iron, Stainless steel",
      "Bearings": "Product lubricated, External optional"
    },
    catalogueUrl: "/catalogues/external-gear-pumps.pdf"
  },
  "twin-screw-pumps": {
    name: "Twin Screw Pumps",
    image: "/images/products/twin_screw_pumps_small.jpg",
    description: "Twin screw pumps feature two intermeshing screws that provide smooth, non-pulsating flow. They excel in handling multiphase fluids and are widely used in oil & gas, marine, and process industries.",
    series: ["Standard Series", "Multiphase Series", "Hygienic Series"],
    features: [
      "Handles multiphase flow (gas/liquid)",
      "Self-priming with high suction lift",
      "Low NPSH requirements",
      "Non-contacting screws - no wear",
      "CIP/SIP capable (hygienic series)",
      "Wide viscosity range"
    ],
    applications: [
      "Crude oil transfer",
      "Multiphase production",
      "Ship loading/unloading",
      "Tank farm operations",
      "Food and pharmaceutical",
      "Chemical processing"
    ],
    specifications: {
      "Capacity": ["Up to 2,000 m³/hr"],
      "Pressure": ["Up to 80 bar"],
      "Temperature": ["-40°C to 200°C"],
      "Viscosity": ["1 to 1,000,000 cSt"],
      "Sizes": ["50mm to 500mm"],
      "Drive": ["Direct coupled, belt drive, gearbox"]
    },
    materials: {
      "Screws": "Hardened steel, Stainless steel, Coated options",
      "Casing": "Cast steel, Stainless steel, Duplex steel",
      "Seals": "Mechanical seals, Magnetic coupling"
    },
    catalogueUrl: "/catalogues/twin-screw-pumps.pdf"
  },
  "internal-gear-pumps": {
    name: "Internal Gear Pumps",
    image: "/images/products/internal_gear_pumps_small.jpg",
    description: "Internal gear pumps use a rotor and idler gear with internal meshing. They provide smooth, low-pulsation flow and are excellent for high-viscosity fluids including asphalt, chocolate, and adhesives.",
    series: ["Standard Series", "Jacketted Series", "Sealless Magnetic Drive"],
    features: [
      "Handles extremely high viscosity",
      "Smooth, low-pulsation flow",
      "Single point end clearance adjustment",
      "Jacketted options for temperature control",
      "Sealless magnetic drive available",
      "Bidirectional operation"
    ],
    applications: [
      "Asphalt and bitumen",
      "Chocolate and confectionery",
      "Adhesives and sealants",
      "Resins and polymers",
      "Heavy fuel oil",
      "Surfactants and soaps"
    ],
    specifications: {
      "Capacity": ["Up to 500 m³/hr"],
      "Pressure": ["Up to 14 bar"],
      "Temperature": ["-20°C to 250°C"],
      "Viscosity": ["Up to 1,000,000 cSt"],
      "Sizes": ["25mm to 250mm"],
      "Drive": ["Direct coupled, belt drive, gear reducer"]
    },
    materials: {
      "Gears": "Cast iron, Steel, Stainless steel, Bronze",
      "Casing": "Cast iron, Ductile iron, Stainless steel",
      "Bearings": "Product lubricated, External optional"
    },
    catalogueUrl: "/catalogues/internal-gear-pumps.pdf"
  },
  "gerotor-pumps": {
    name: "Gerotor Pumps",
    image: "/images/products/gerotor_pumps_small.jpg",
    description: "Gerotor pumps use an inner rotor with external teeth and an outer rotor with internal teeth. They are compact, efficient, and widely used in automotive and industrial lubrication systems.",
    series: ["Standard Series", "High Speed Series", "Custom Profile Series"],
    features: [
      "Extremely compact design",
      "High volumetric efficiency",
      "Low noise operation",
      "Smooth flow characteristics",
      "Cost-effective for OEM volumes",
      "Custom profiles available"
    ],
    applications: [
      "Engine lubrication",
      "Transmission systems",
      "Hydraulic power steering",
      "Fuel injection systems",
      "Industrial lubrication",
      "Cooling circuits"
    ],
    specifications: {
      "Capacity": ["Up to 100 L/min"],
      "Pressure": ["Up to 50 bar"],
      "Temperature": ["-40°C to 150°C"],
      "Viscosity": ["10 to 5,000 cSt"],
      "Sizes": ["10mm to 80mm"],
      "Drive": ["Direct coupled, spline drive, press fit"]
    },
    materials: {
      "Rotors": "Powdered metal, Hardened steel",
      "Body": "Aluminum, Cast iron, Steel",
      "Port plates": "Bronze, Composite materials"
    },
    catalogueUrl: "/catalogues/gerotor-pumps.pdf"
  },
  "trochoidal-gear-pumps": {
    name: "Trochoidal Gear Pumps",
    image: "/images/products/trochoidal_gear_pumps_small.jpg",
    description: "Trochoidal gear pumps use cycloidal gear profiles for exceptionally smooth, low-pulsation flow. They are ideal for precision metering and high-pressure hydraulic applications.",
    series: ["Standard Series", "High Precision Series", "High Pressure Series"],
    features: [
      "Exceptionally low flow pulsation",
      "High pressure capability",
      "Precision metering accuracy",
      "Low noise and vibration",
      "Long service life",
      "Compact footprint"
    ],
    applications: [
      "Precision metering",
      "High-pressure hydraulics",
      "Fuel injection systems",
      "Chemical dosing",
      "Test rigs and laboratories",
      "Aerospace hydraulics"
    ],
    specifications: {
      "Capacity": ["Up to 200 L/min"],
      "Pressure": ["Up to 300 bar"],
      "Temperature": ["-20°C to 180°C"],
      "Viscosity": ["5 to 10,000 cSt"],
      "Sizes": ["8mm to 60mm"],
      "Drive": ["Direct coupled, motor mounted"]
    },
    materials: {
      "Gears": "Hardened tool steel, Carbide options",
      "Body": "High strength steel, Stainless steel",
      "Bearings": "Hydrodynamic, Roller bearings"
    },
    catalogueUrl: "/catalogues/trochoidal-gear-pumps.pdf"
  },
  "shuttle-block-pumps": {
    name: "Shuttle Block Pumps",
    image: "/images/products/shuttle_block_pumps_small.jpg",
    description: "Shuttle block pumps (also known as radial piston pumps) use multiple pistons in a rotating cylinder block. They provide extremely high pressure capability and are used in demanding industrial and mobile hydraulic applications.",
    series: ["Fixed Displacement", "Variable Displacement", "Multiple Flow Series"],
    features: [
      "Extremely high pressure capability",
      "High volumetric efficiency",
      "Low noise at high pressure",
      "Multiple outlet options",
      "Through-drive capability",
      "Variable displacement available"
    ],
    applications: [
      "High-pressure hydraulics",
      "Presses and forming machines",
      "Injection molding",
      "Die casting machines",
      "Test rigs",
      "Marine deck machinery"
    ],
    specifications: {
      "Capacity": ["Up to 500 L/min"],
      "Pressure": ["Up to 700 bar"],
      "Temperature": ["-20°C to 100°C"],
      "Viscosity": ["10 to 2,000 cSt"],
      "Sizes": ["Various frame sizes"],
      "Drive": ["Direct coupled, flange mounted"]
    },
    materials: {
      "Pistons": "Hardened steel, Carbide coated",
      "Cylinder block": "Hardened steel",
      "Body": "High strength cast iron, Steel"
    },
    catalogueUrl: "/catalogues/shuttle-block-pumps.pdf"
  },
  "external-lobe-pumps": {
    name: "External Lobe Pumps",
    image: "/images/products/external_lobe_pumps_small.jpg",
    description: "External lobe pumps use two or more lobes rotating in opposite directions. They provide gentle, low-shear pumping action ideal for food, pharmaceutical, and biotechnology applications.",
    series: ["Sanitary Series", "Industrial Series", "High Viscosity Series"],
    features: [
      "Gentle product handling",
      "CIP/SIP capable",
      "Low shear rate",
      "Handles solids and particulates",
      "Reversible flow",
      "Easy maintenance and cleaning"
    ],
    applications: [
      "Dairy processing",
      "Beverage production",
      "Pharmaceutical manufacturing",
      "Biotechnology",
      "Cosmetics and personal care",
      "Sauces and condiments"
    ],
    specifications: {
      "Capacity": ["Up to 300 m³/hr"],
      "Pressure": ["Up to 15 bar"],
      "Temperature": ["-20°C to 150°C"],
      "Viscosity": ["Up to 500,000 cSt"],
      "Sizes": ["25mm to 200mm"],
      "Drive": ["Direct coupled, gearbox, VFD"]
    },
    materials: {
      "Lobes": "Stainless steel 316L, Non-metallic options",
      "Body": "Stainless steel 316L, Electropolished",
      "Seals": "EPDM, Viton, PTFE, FEP encapsulated"
    },
    catalogueUrl: "/catalogues/external-lobe-pumps.pdf"
  },
};

export async function generateMetadata({ params }: ProductDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const product = productData[slug];
  
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
  const product = productData[slug];

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-primary mb-4">Product Not Found</h1>
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
              <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-primary">
                {product.name}
              </h1>
              <span aria-hidden="true" className="mt-3 block h-1 w-16 rounded-full bg-accent" />
              <p className="mt-8 text-lg leading-[1.8] text-muted">
                {product.description}
              </p>

              <div className="mt-10">
                <h2 className="font-display text-lg font-bold text-primary">Available Series</h2>
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
                <h2 className="font-display text-lg font-bold text-primary">Key Features</h2>
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
                <h2 className="font-display text-lg font-bold text-primary">Applications</h2>
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
                  <h2 className="font-display text-lg font-bold text-primary">Specifications</h2>
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
                  <h2 className="font-display text-lg font-bold text-primary">Materials of Construction</h2>
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
                    href="/contact"
                    className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-accent text-white font-semibold transition-colors hover:bg-accent-dark"
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
  return Object.keys(productData).map((slug) => ({ slug }));
}