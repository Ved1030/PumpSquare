"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { REVIEW_TABS, type ReviewTabKey } from "@/lib/products";
import { hasRichText } from "@/lib/rich-text";
import { parseLabeledBullet } from "@/lib/review-content";
import RichTextInput from "./RichTextInput";
import { moveItem, toEditorFeature, type EditorTab, type EditorTechnical } from "./editor-types";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-md border border-line px-2.5 py-2 text-sm text-ink focus:border-primary focus:outline-none";

type Props = {
  technical: EditorTechnical;
  onChange: (technical: EditorTechnical) => void;
};

export default function ReviewTabsEditor({ technical, onChange }: Props) {
  const [activeKey, setActiveKey] = useState<ReviewTabKey>(REVIEW_TABS[0].key);
  const active = technical.tabs.find((tab) => tab.key === activeKey) ?? technical.tabs[0];
  const activeMeta = REVIEW_TABS.find((tab) => tab.key === active.key)!;

  const updateTab = (patch: Partial<EditorTab>) =>
    onChange({ ...technical, tabs: technical.tabs.map((tab) => (tab.key === active.key ? { ...tab, ...patch } : tab)) });

  const updateFeature = (index: number, patch: Partial<EditorTab["features"][number]>) =>
    updateTab({ features: active.features.map((feature, i) => (i === index ? { ...feature, ...patch } : feature)) });

  function addFeatures(text: string) {
    const entries = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => toEditorFeature(parseLabeledBullet(line)));
    if (entries.length) updateTab({ features: [...active.features, ...entries] });
  }

  function toggleEnabled(tab: EditorTab) {
    const nextEnabled = !tab.enabled;
    onChange({
      ...technical,
      tabs: technical.tabs.map((item) =>
        item.key === tab.key
          ? { ...item, enabled: nextEnabled, heading: item.heading.trim() ? item.heading : tabDefault(item.key) }
          : item,
      ),
    });
  }

  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <h2 className="font-display text-base font-bold text-primary-deep">Product Reviews &amp; Technical Information</h2>
      <p className="mt-1 text-xs text-muted">
        Each tab has its own heading and bullet points. The performance table, materials table and explanation
        paragraphs below are shared by every tab.
      </p>

      <div role="tablist" aria-label="Technical information tabs" className="mt-4 flex gap-1.5 overflow-x-auto pb-1">
        {technical.tabs.map((tab) => {
          const meta = REVIEW_TABS.find((item) => item.key === tab.key)!;
          const enabled = tab.enabled && (tab.features.length > 0 || hasRichText(tab.intro));
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={tab.key === active.key}
              onClick={() => setActiveKey(tab.key)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                tab.key === active.key
                  ? "bg-primary text-white"
                  : "border border-line text-ink hover:border-primary/40 hover:text-primary",
              )}
            >
              <span aria-hidden="true" className={cn("size-1.5 rounded-full", enabled ? "bg-emerald-400" : "bg-slate-300")} />
              {meta.label}
              <span className="text-[10px] font-medium opacity-70">{tab.features.length}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-lg border border-line bg-slate-50/50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-sm font-bold text-primary-deep">{activeMeta.label} tab</h3>
          <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-ink">
            <input
              type="checkbox"
              checked={active.enabled}
              onChange={() => toggleEnabled(active)}
              className="size-4 accent-[#2774AE]"
            />
            Show this tab on the website
          </label>
        </div>

        <div className="mt-3">
          <label htmlFor={`tab-heading-${active.key}`} className="text-sm font-semibold text-ink">Section heading</label>
          <input
            id={`tab-heading-${active.key}`}
            value={active.heading}
            onChange={(event) => updateTab({ heading: event.target.value })}
            maxLength={120}
            placeholder={activeMeta.defaultHeading}
            className={cn(field, "mt-1.5 bg-white")}
          />
        </div>

        <div className="mt-4">
          <span className="text-sm font-semibold text-ink">Bullet points</span>
          <p className="text-xs text-muted">Optional short label plus detail, e.g. &ldquo;Capacity Range&rdquo; and &ldquo;0.5 – 30 m³/hr&rdquo;.</p>
          <div className="mt-2 space-y-2">
            {active.features.length === 0 ? <p className="text-xs text-muted">No bullet points yet.</p> : null}
            {active.features.map((feature, index) => (
              <div key={index} className="grid gap-2 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)_auto]">
                <input
                  aria-label={`${activeMeta.label} bullet ${index + 1} label`}
                  value={feature.label}
                  onChange={(event) => updateFeature(index, { label: event.target.value })}
                  placeholder="Label (optional)"
                  maxLength={80}
                  className={cn(field, "bg-white")}
                />
                <input
                  aria-label={`${activeMeta.label} bullet ${index + 1} text`}
                  value={feature.text}
                  onChange={(event) => updateFeature(index, { text: event.target.value })}
                  placeholder="Detail"
                  maxLength={500}
                  className={cn(field, "bg-white")}
                />
                <div className="flex items-center">
                  <button type="button" onClick={() => updateTab({ features: moveItem(active.features, index, -1) })} disabled={index === 0} className="rounded p-1.5 text-muted hover:text-primary disabled:opacity-30" aria-label={`Move bullet ${index + 1} up`}>
                    <ArrowUp aria-hidden="true" className="size-4" />
                  </button>
                  <button type="button" onClick={() => updateTab({ features: moveItem(active.features, index, 1) })} disabled={index === active.features.length - 1} className="rounded p-1.5 text-muted hover:text-primary disabled:opacity-30" aria-label={`Move bullet ${index + 1} down`}>
                    <ArrowDown aria-hidden="true" className="size-4" />
                  </button>
                  <button type="button" onClick={() => updateTab({ features: active.features.filter((_, i) => i !== index) })} className="rounded p-1.5 text-muted hover:text-red-600" aria-label={`Delete bullet ${index + 1}`}>
                    <Trash2 aria-hidden="true" className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={active.features.length >= 60}
              onClick={() => updateTab({ features: [...active.features, { label: "", text: "" }] })}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-deep disabled:opacity-50"
            >
              <Plus aria-hidden="true" className="size-4" />
              Add bullet point
            </button>
            <BulkAdd onAdd={addFeatures} />
          </div>
        </div>

        <div className="mt-4">
          <RichTextInput
            id={`tab-intro-${active.key}`}
            label="Additional descriptive content (optional)"
            value={active.intro}
            onChange={(intro) => updateTab({ intro })}
            placeholder="Paragraphs shown above the shared tables for this tab."
            rows={3}
          />
        </div>
      </div>
    </section>
  );
}

function tabDefault(key: EditorTab["key"]) {
  return REVIEW_TABS.find((tab) => tab.key === key)?.defaultHeading ?? "";
}

function BulkAdd({ onAdd }: { onAdd: (text: string) => void }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-primary">
        Paste several lines
      </button>
    );
  }

  return (
    <div className="w-full rounded-md border border-line bg-white p-2">
      <label htmlFor="bulk-bullets" className="text-xs font-semibold text-ink">One bullet per line · use “Label: Detail” for labelled bullets</label>
      <textarea id="bulk-bullets" value={text} onChange={(event) => setText(event.target.value)} rows={4} className={cn(field, "mt-1 font-mono text-xs")} />
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => {
            onAdd(text);
            setText("");
            setOpen(false);
          }}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-deep"
        >
          Add to tab
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-xs font-semibold text-muted hover:text-ink">Cancel</button>
      </div>
    </div>
  );
}
