"use client";

import { useState } from "react";
import ProductImage from "./ProductImage";
import { cn } from "@/lib/utils";

/** Main image plus selectable thumbnails so additional images are reachable on the detail page. */
export default function ProductGallery({ name, images }: { name: string; images: string[] }) {
  const [selected, setSelected] = useState(0);
  const active = images[Math.min(selected, images.length - 1)];

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-white shadow-xl shadow-primary/5">
        {active ? (
          <ProductImage
            src={active}
            alt={selected === 0 ? name : `${name} view ${selected + 1}`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            className="object-contain p-6 sm:p-8"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-muted">Image coming soon</div>
        )}
      </div>

      {images.length > 1 ? (
        <ul className="mt-4 grid grid-cols-5 gap-2 sm:gap-3" aria-label="Product images">
          {images.map((src, index) => (
            <li key={`${src}-${index}`}>
              <button
                type="button"
                onClick={() => setSelected(index)}
                aria-label={index === 0 ? "Show main image" : `Show image ${index + 1}`}
                aria-pressed={index === selected}
                className={cn(
                  "relative block aspect-square w-full overflow-hidden rounded-lg border-2 bg-white transition-colors",
                  index === selected ? "border-accent" : "border-line hover:border-steel",
                )}
              >
                <ProductImage src={src} alt="" fill sizes="15vw" className="object-contain p-2" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
