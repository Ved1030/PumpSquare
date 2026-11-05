"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import type { TechnicalContent } from "@/lib/products";
import { REVIEW_TABS } from "@/lib/products";
import { hasRichText, RichText } from "@/lib/rich-text";
import { cn } from "@/lib/utils";

type TabView = {
  key: string;
  label: string;
  heading: string;
  intro: string;
  features: { label?: string; text: string }[];
};

type Props = {
  technical?: TechnicalContent;
};

/**
 * "Product Reviews" tabs. Only tabs the admin enabled and filled are shown;
 * the performance table, materials table and explanation paragraphs belong to
 * the product and render identically under every tab.
 */
export default function TechnicalTabs({ technical }: Props) {
  const openTabs: TabView[] = REVIEW_TABS.flatMap((meta) => {
    const saved = technical?.tabs.find((tab) => tab.key === meta.key);
    if (!saved || !saved.enabled) return [];
    if (!saved.features.length && !hasRichText(saved.intro)) return [];
    return [
      {
        key: meta.key,
        label: meta.label,
        heading: saved.heading.trim() || meta.defaultHeading,
        intro: saved.intro,
        features: saved.features,
      },
    ];
  });

  const [selected, setSelected] = useState(openTabs[0]?.key ?? "");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const performance = technical?.performance;
  const columns = performance?.columns ?? [];
  const rows = (performance?.rows ?? []).filter((row) => Object.values(row.cells).some((value) => value.trim()));
  const materials = technical?.materials ?? [];
  const paragraphs = (technical?.paragraphs ?? []).filter((paragraph) => hasRichText(paragraph.html));

  if (!openTabs.length) return null;

  const active = openTabs.find((tab) => tab.key === selected) ?? openTabs[0];

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? openTabs.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + openTabs.length) % openTabs.length;
    const target = openTabs[next];
    setSelected(target.key);
    tabRefs.current[target.key]?.focus();
  }

  return (
    <section aria-labelledby="product-reviews-heading" className="mt-16">
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="h-1 w-10 flex-shrink-0 rounded-full bg-accent" />
        <h2 id="product-reviews-heading" className="font-display text-xl font-extrabold tracking-tight text-primary-deep sm:text-2xl">
          Product Reviews
        </h2>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <div
          role="tablist"
          aria-label="Product reviews"
          className="flex gap-1 overflow-x-auto border-b border-line bg-primary-soft/40 px-2 py-2"
        >
          {openTabs.map((tab, index) => (
            <button
              key={tab.key}
              ref={(node) => {
                tabRefs.current[tab.key] = node;
              }}
              type="button"
              role="tab"
              id={`review-tab-${tab.key}`}
              aria-selected={tab.key === active.key}
              aria-controls={`review-panel-${tab.key}`}
              tabIndex={tab.key === active.key ? 0 : -1}
              onClick={() => setSelected(tab.key)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors sm:px-5",
                tab.key === active.key
                  ? "bg-primary text-white shadow-sm"
                  : "text-primary-deep hover:bg-white hover:text-primary",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`review-panel-${active.key}`}
          aria-labelledby={`review-tab-${active.key}`}
          tabIndex={0}
          className="p-5 focus:outline-none sm:p-8"
        >
          <h3 className="font-display text-lg font-bold text-primary-deep sm:text-xl">{active.heading}</h3>
          <span aria-hidden="true" className="mt-2 block h-0.5 w-12 rounded-full bg-accent" />

          {hasRichText(active.intro) ? (
            <RichText
              html={active.intro}
              className="mt-4 space-y-3 text-base leading-[1.8] text-muted [&_h3]:font-display [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-primary-deep [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5"
            />
          ) : null}

          {active.features.length > 0 ? (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {active.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 rounded-lg border border-line bg-surface p-4">
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
                  <p className="text-sm leading-relaxed text-ink">
                    {feature.label ? <strong className="font-semibold text-primary-deep">{feature.label}: </strong> : null}
                    {feature.text}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}

          {columns.length > 0 && rows.length > 0 ? (
            <div className="mt-10">
              <h4 className="font-display text-base font-bold text-primary-deep sm:text-lg">Performance Table</h4>
              <div className="mt-3 overflow-x-auto rounded-xl border border-line">
                <table className="w-full min-w-[640px] border-collapse text-sm">
                  <caption className="sr-only">{`Performance table for ${active.heading}`}</caption>
                  <thead>
                    <tr className="bg-primary-deep text-left text-white">
                      {columns.map((column) => (
                        <th key={column.id} scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wide sm:text-sm sm:normal-case sm:tracking-normal">
                          {column.name}
                          {column.unit ? <span className="block text-[11px] font-medium text-steel sm:inline sm:pl-1 sm:text-xs">({column.unit})</span> : null}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, rowIndex) => (
                      <tr key={row.id} className={cn("border-t border-line", rowIndex % 2 ? "bg-primary-soft/30" : "bg-white")}>
                        {columns.map((column) => (
                          <td key={column.id} className="whitespace-nowrap px-4 py-3 text-ink">
                            {row.cells[column.id] ?? "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {materials.length > 0 ? (
            <div className="mt-10">
              <h4 className="font-display text-base font-bold text-primary-deep sm:text-lg">Materials of Construction</h4>
              <div className="mt-3 overflow-x-auto rounded-xl border border-line">
                <table className="w-full min-w-[480px] border-collapse text-sm">
                  <caption className="sr-only">Materials of construction</caption>
                  <thead>
                    <tr className="bg-primary-deep text-left text-white">
                      <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wide sm:text-sm sm:normal-case sm:tracking-normal">Components</th>
                      <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wide sm:text-sm sm:normal-case sm:tracking-normal">Material of Construction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map((row, rowIndex) => (
                      <tr key={row.id} className={cn("border-t border-line", rowIndex % 2 ? "bg-primary-soft/30" : "bg-white")}>
                        <td className="px-4 py-3 font-semibold text-primary-deep">{row.component}</td>
                        <td className="px-4 py-3 text-ink">
                          {row.material}
                          {row.specification ? <span className="block text-xs text-muted sm:inline sm:pl-2">{row.specification}</span> : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {paragraphs.length > 0 ? (
            <div className="mt-10 rounded-xl bg-surface p-5 sm:p-6">
              <h4 className="font-display text-base font-bold text-primary-deep sm:text-lg">Technical Explanation &amp; Product Details</h4>
              {paragraphs.map((paragraph) => (
                <RichText
                  key={paragraph.id}
                  html={paragraph.html}
                  className="mt-3 space-y-3 text-sm leading-[1.8] text-muted sm:text-base [&_h3]:font-display [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-primary-deep [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5"
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
