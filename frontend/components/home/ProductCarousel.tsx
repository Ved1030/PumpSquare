"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { topProducts } from "@/lib/content";
import { cn } from "@/lib/utils";

const ANIMATION_DURATION = 45;
const CARD_WIDTH = 280;
const GAP = 24;
const TRANSLATE_X = -(topProducts.length) * (CARD_WIDTH + GAP);

const KEYFRAMES_ID = "product-carousel-keyframes";

const productRoutes: Record<string, string> = {
  "Progressive Cavity Pumps": "/products/progressive-cavity-pumps",
  "Triple Screw Pumps": "/products/triple-screw-pumps",
  "External Gear Pumps": "/products/external-gear-pumps",
  "Twin Screw Pumps": "/products/twin-screw-pumps",
  "Internal Gear Pumps": "/products/internal-gear-pumps",
  "Gerotor Pumps": "/products/gerotor-pumps",
  "Trochoidal Gear Pumps": "/products/trochoidal-gear-pumps",
  "Shuttle Block Pumps": "/products/shuttle-block-pumps",
  "External Lobe Pumps": "/products/external-lobe-pumps",
};

function injectKeyframes() {
  if (typeof document === "undefined") return;
  
  if (document.getElementById(KEYFRAMES_ID)) return;
  
  const style = document.createElement("style");
  style.id = KEYFRAMES_ID;
  style.textContent = `
    @keyframes product-carousel {
      from { transform: translateX(0); }
      to { transform: translateX(${TRANSLATE_X}px); }
    }
  `;
  document.head.appendChild(style);
}

function removeKeyframes() {
  if (typeof document === "undefined") return;
  
  const existing = document.getElementById(KEYFRAMES_ID);
  if (existing) existing.remove();
}

export default function ProductCarousel() {
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    injectKeyframes();
    return removeKeyframes;
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setPaused(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleMouseEnter = () => {
    if (!reducedMotion) setPaused(true);
  };

  const handleMouseLeave = () => {
    if (!reducedMotion) setPaused(false);
  };

  const handleTouchStart = () => {
    if (!reducedMotion) setPaused(true);
  };

  const handleTouchEnd = () => {
    if (!reducedMotion) setPaused(false);
  };

  const duplicatedProducts = [...topProducts, ...topProducts];

  return (
    <section aria-label="Top Products" className="bg-white py-20 sm:py-24">
      <div className="mx-auto w-full max-w-[1450px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-1 w-10 rounded-full bg-accent flex-shrink-0" />
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
              TOP PRODUCTS
            </p>
          </div>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-extrabold leading-[1.1] tracking-tight text-primary-deep">
            Pumps We Manufacture
          </h2>
          <span aria-hidden="true" className="mt-3 block h-1 w-16 rounded-full bg-accent" />
          <p className="mt-6 text-base leading-relaxed text-muted max-w-2xl">
            A selection from the complete range of positive displacement pumps produced at our facility.
          </p>
        </div>

        <div
          ref={carouselRef}
          className="relative mt-14 overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex gap-6"
            style={{
              animation: reducedMotion || paused
                ? "none"
                : `product-carousel ${ANIMATION_DURATION}s linear infinite`,
              width: "max-content",
            }}
          >
            {duplicatedProducts.map((product, index) => (
              <Link
                key={`${product.name}-${index}`}
                href={productRoutes[product.name]}
                className={cn(
                  "flex-shrink-0 relative flex flex-col overflow-hidden rounded-[16px] border border-line bg-white shadow-sm transition-all duration-300",
                  "hover:-translate-y-1 hover:border-accent hover:shadow-[0_12px_30px_rgba(255,209,0,0.25)]"
                )}
                style={{ width: `${CARD_WIDTH}px` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-surface p-6">
                  <div
                    aria-hidden="true"
                    className="absolute top-0 left-0 right-0 h-1.5 bg-accent"
                  />
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="280px"
                    className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 p-4">
                  <h3 className="text-sm font-semibold leading-snug text-ink sm:text-base">
                    {product.name}
                  </h3>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-accent transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:scale-110"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}