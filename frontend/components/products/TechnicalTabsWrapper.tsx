"use client";

import { Suspense } from "react";
import TechnicalTabs from "./TechnicalTabs";

function TechnicalTabsSkeleton() {
  return (
    <section aria-labelledby="product-reviews-heading" className="mt-16 animate-pulse" aria-hidden="true">
      <div className="flex items-center gap-3">
        <div className="h-1 w-10 flex-shrink-0 rounded-full bg-line/60" />
        <div className="h-7 w-40 rounded bg-line/60" />
      </div>

      <div className="mt-5 rounded-2xl border border-line bg-white shadow-sm">
        <div className="h-12 border-b border-line bg-primary-soft/40" />
        <div className="p-5 sm:p-8 space-y-6">
          <div className="h-6 w-1/3 rounded bg-line/60" />
          <div className="h-4 w-full rounded bg-line/60" />
          <div className="h-4 w-5/6 rounded bg-line/60" />
          <div className="h-24 w-full rounded-xl border border-line bg-line/50" />
          <div className="h-24 w-full rounded-xl border border-line bg-line/50" />
          <div className="h-16 w-full rounded-xl bg-surface" />
        </div>
      </div>
    </section>
  );
}

interface TechnicalTabsWrapperProps {
  technical: import("@/lib/products").TechnicalContent | undefined;
}

export default function TechnicalTabsWrapper({ technical }: TechnicalTabsWrapperProps) {
  // Remount on product change so the active tab and autoplay timer reset.
  const productKey = technical?.tabs?.map((tab) => tab.key).join("|") ?? "";
  return (
    <Suspense fallback={<TechnicalTabsSkeleton />}>
      <TechnicalTabs key={productKey} technical={technical} />
    </Suspense>
  );
}