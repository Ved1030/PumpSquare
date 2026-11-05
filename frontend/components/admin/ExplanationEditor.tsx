"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { plainText } from "@/lib/rich-text-editor";
import RichTextInput from "./RichTextInput";
import { moveItem, newId } from "./editor-types";

export default function ExplanationEditor({
  paragraphs,
  onChange,
}: {
  paragraphs: { id: string; html: string }[];
  onChange: (paragraphs: { id: string; html: string }[]) => void;
}) {
  const update = (index: number, html: string) =>
    onChange(paragraphs.map((paragraph, i) => (i === index ? { ...paragraph, html } : paragraph)));

  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <h2 className="font-display text-base font-bold text-primary-deep">Technical Explanation &amp; Product Details</h2>
      <p className="mt-1 text-xs text-muted">
        Free-text paragraphs shown after the performance and materials tables in every tab. Bold, italic and basic lists are supported.
      </p>

      <div className="mt-4 space-y-4">
        {paragraphs.length === 0 ? <p className="text-xs text-muted">No paragraphs yet.</p> : null}
        {paragraphs.map((paragraph, index) => (
          <div key={paragraph.id} className="rounded-lg border border-line/70 bg-slate-50/60 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
                Paragraph {index + 1}
                {plainText(paragraph.html) ? "" : " · empty"}
              </span>
              <div className="flex items-center">
                <button type="button" onClick={() => onChange(moveItem(paragraphs, index, -1))} disabled={index === 0} className="rounded p-1.5 text-muted hover:text-primary disabled:opacity-30" aria-label={`Move paragraph ${index + 1} up`}>
                  <ArrowUp aria-hidden="true" className="size-4" />
                </button>
                <button type="button" onClick={() => onChange(moveItem(paragraphs, index, 1))} disabled={index === paragraphs.length - 1} className="rounded p-1.5 text-muted hover:text-primary disabled:opacity-30" aria-label={`Move paragraph ${index + 1} down`}>
                  <ArrowDown aria-hidden="true" className="size-4" />
                </button>
                <button type="button" onClick={() => onChange(paragraphs.filter((_, i) => i !== index))} className="rounded p-1.5 text-muted hover:text-red-600" aria-label={`Delete paragraph ${index + 1}`}>
                  <Trash2 aria-hidden="true" className="size-4" />
                </button>
              </div>
            </div>
            <div className="mt-2">
              <RichTextInput
                id={`paragraph-${paragraph.id}`}
                label={`Paragraph ${index + 1} content`}
                value={paragraph.html}
                onChange={(html) => update(index, html)}
                placeholder="Write the explanation for this paragraph."
                rows={4}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        disabled={paragraphs.length >= 60}
        onClick={() => onChange([...paragraphs, { id: newId(), html: "" }])}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-deep disabled:opacity-50"
      >
        <Plus aria-hidden="true" className="size-4" />
        Add paragraph
      </button>
    </section>
  );
}
