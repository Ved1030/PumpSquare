"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { MaterialRow } from "@/lib/products";
import { moveItem, newId } from "./editor-types";

const field =
  "w-full rounded-md border border-line px-2.5 py-2 text-sm text-ink focus:border-primary focus:outline-none";

export default function MaterialsTableEditor({
  rows,
  onChange,
}: {
  rows: MaterialRow[];
  onChange: (rows: MaterialRow[]) => void;
}) {
  const update = (index: number, patch: Partial<MaterialRow>) =>
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <h2 className="font-display text-base font-bold text-primary-deep">Materials of Construction Table</h2>
      <p className="mt-1 text-xs text-muted">Shared across every tab of this product.</p>

      <div className="mt-4 hidden gap-2 text-[11px] font-semibold text-muted sm:grid sm:grid-cols-[1fr_1fr_1fr_auto]">
        <span>Component</span>
        <span>Material of construction</span>
        <span>Grade / specification (optional)</span>
        <span />
      </div>

      <div className="mt-1 space-y-2">
        {rows.length === 0 ? <p className="text-xs text-muted">No materials entered yet.</p> : null}
        {rows.map((row, index) => (
          <div key={row.id} className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
            <input
              aria-label={`Component ${index + 1}`}
              value={row.component}
              onChange={(event) => update(index, { component: event.target.value })}
              placeholder="e.g. Pump casing and covers"
              maxLength={120}
              className={field}
            />
            <input
              aria-label={`Material ${index + 1}`}
              value={row.material}
              onChange={(event) => update(index, { material: event.target.value })}
              placeholder="e.g. 316 stainless steel"
              maxLength={200}
              className={field}
            />
            <input
              aria-label={`Specification ${index + 1}`}
              value={row.specification}
              onChange={(event) => update(index, { specification: event.target.value })}
              placeholder="Optional"
              maxLength={200}
              className={field}
            />
            <div className="flex items-center">
              <button type="button" onClick={() => onChange(moveItem(rows, index, -1))} disabled={index === 0} className="rounded p-1.5 text-muted hover:text-primary disabled:opacity-30" aria-label={`Move material ${index + 1} up`}>
                <ArrowUp aria-hidden="true" className="size-4" />
              </button>
              <button type="button" onClick={() => onChange(moveItem(rows, index, 1))} disabled={index === rows.length - 1} className="rounded p-1.5 text-muted hover:text-primary disabled:opacity-30" aria-label={`Move material ${index + 1} down`}>
                <ArrowDown aria-hidden="true" className="size-4" />
              </button>
              <button type="button" onClick={() => onChange(rows.filter((_, i) => i !== index))} className="rounded p-1.5 text-muted hover:text-red-600" aria-label={`Remove material ${index + 1}`}>
                <Trash2 aria-hidden="true" className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        disabled={rows.length >= 60}
        onClick={() => onChange([...rows, { id: newId(), component: "", material: "", specification: "" }])}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-deep disabled:opacity-50"
      >
        <Plus aria-hidden="true" className="size-4" />
        Add component
      </button>
    </section>
  );
}
