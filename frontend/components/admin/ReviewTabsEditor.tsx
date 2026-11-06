"use client";

import { useRef, useState } from "react";
import { AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Lock, Pencil, Plus, Trash2 } from "lucide-react";
import { REVIEW_TABS } from "@/lib/products";
import { parseLabeledBullet } from "@/lib/review-content";
import { cn } from "@/lib/utils";
import RichTextInput from "./RichTextInput";
import {
  DEFAULT_TAB_COUNT,
  MAX_TABS,
  blankTabCount,
  isTabLive,
  moveItem,
  moveTab,
  tabKeyFor,
  tabNameTaken,
  toEditorFeature,
  type EditorTab,
  type EditorTechnical,
} from "./editor-types";

const field =
  "w-full rounded-md border border-line px-2.5 py-2 text-sm text-ink focus:border-primary focus:outline-none";

type Props = {
  technical: EditorTechnical;
  onChange: (technical: EditorTechnical) => void;
};

function defaultHeadingFor(key: string) {
  return REVIEW_TABS.find((tab) => tab.key === key)?.defaultHeading ?? "";
}

export default function ReviewTabsEditor({ technical, onChange }: Props) {
  const [activeKey, setActiveKey] = useState(technical.tabs[0]?.key ?? "");
  const [addOpen, setAddOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const active = technical.tabs.find((tab) => tab.key === activeKey) ?? technical.tabs[0];
  const activeIndex = technical.tabs.findIndex((tab) => tab.key === active.key);

  function replaceTabs(tabs: EditorTab[]) {
    onChange({ ...technical, tabs });
  }

  function updateTab(patch: Partial<EditorTab>) {
    replaceTabs(technical.tabs.map((tab) => (tab.key === active.key ? { ...tab, ...patch } : tab)));
  }

  function updateFeature(index: number, patch: Partial<EditorTab["features"][number]>) {
    updateTab({ features: active.features.map((feature, i) => (i === index ? { ...feature, ...patch } : feature)) });
  }

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
    const heading = tab.heading.trim() ? tab.heading : defaultHeadingFor(tab.key);
    replaceTabs(
      technical.tabs.map((item) => {
        if (item.key !== tab.key) return item;
        if (nextEnabled && !isTabLive({ ...item, enabled: true, heading })) {
          setNotice(`Add a heading, bullet point or descriptive content to “${item.label}” before showing it on the website.`);
        }
        return { ...item, enabled: nextEnabled, heading };
      }),
    );
  }

  function moveTabTo(from: number, to: number) {
    const tabs = moveTab(technical.tabs, from, to);
    if (tabs !== technical.tabs) {
      setNotice(null);
      replaceTabs(tabs);
    }
  }

  function addTab(input: { name: string; heading: string; position: number }): string | null {
    const name = input.name.trim();
    if (!name) return "Enter a tab name.";
    if (tabNameTaken(technical.tabs, name)) return `A tab named “${name}” already exists on this product.`;
    if (technical.tabs.length >= MAX_TABS) return `This product already has the maximum of ${MAX_TABS} tabs.`;

    // The identifier is internal only; the label keeps the exact entered name.
    const key = tabKeyFor(name, [...REVIEW_TABS.map((tab) => tab.key), ...technical.tabs.map((tab) => tab.key)]);

    const tab: EditorTab = {
      key,
      label: name,
      isCustom: true,
      enabled: true,
      heading: input.heading.trim() || `${name} Features`,
      intro: "",
      features: [],
    };
    const tabs = [...technical.tabs];
    const position = Math.min(Math.max(input.position, 1), tabs.length + 1);
    tabs.splice(position - 1, 0, tab);
    replaceTabs(tabs);
    setActiveKey(key);
    setAddOpen(false);
    setNotice(null);
    return null;
  }

  function renameTab(next: string): string | null {
    // Only surrounding whitespace is dropped; internal spacing and casing are
    // saved exactly as typed.
    const name = next.trim();
    if (!name) return "Tab name cannot be empty.";
    if (tabNameTaken(technical.tabs, name, active.key)) return `A tab named “${name}” already exists on this product.`;
    const meta = REVIEW_TABS.find((tab) => tab.key === active.key);
    if (meta) {
      // The key stays the same; the visible name just moves away from its default.
      const defaultName = name === meta.label;
      updateTab({ customLabel: defaultName ? undefined : name, isCustom: !defaultName, label: name });
    } else {
      updateTab({ label: name });
    }
    setRenaming(false);
    return null;
  }

  function deleteTab(tab: EditorTab) {
    const remaining = technical.tabs.filter((item) => item.key !== tab.key);
    replaceTabs(remaining);
    if (active.key === tab.key) setActiveKey(remaining[Math.min(activeIndex, remaining.length - 1)]?.key ?? "");
    setConfirmDelete(false);
    setNotice(null);
  }

  const standardCount = technical.tabs.filter((tab) => !tab.isCustom).length;
  const customCount = technical.tabs.length - standardCount;
  const canDelete = active.isCustom;
  const deleteHasContent = blankTabCount(active) > 0;
  // Labels are shown exactly as entered; unnamed tabs are flagged rather than
  // showing their internal identifier.
  const tabName = (tab: EditorTab) => tab.label.trim() || "Untitled tab";
  const activeName = active.label.trim();
  const nameTaken = Boolean(activeName) && tabNameTaken(technical.tabs, activeName, active.key);

  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-display text-base font-bold text-primary-deep">Product Reviews &amp; Technical Information</h2>
          <p className="mt-1 text-xs text-muted">
            {DEFAULT_TAB_COUNT} standard tabs plus your own custom tabs. The performance table, materials table and
            explanation paragraphs below are shared by every tab.
          </p>
        </div>
        <p className="text-[11px] font-medium text-muted">
          {technical.tabs.length} tabs · {standardCount} standard · {customCount} custom
        </p>
      </div>

      <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Technical information tabs">
        {technical.tabs.map((tab) => {
          const live = isTabLive(tab);
          const selected = tab.key === active.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => {
                setActiveKey(tab.key);
                setRenaming(false);
                setConfirmDelete(false);
                setNotice(null);
              }}
              onAuxClick={(event) => {
                // Middle click renames a custom tab, like a browser tab.
                if (event.button === 1 && tab.isCustom) {
                  event.preventDefault();
                  setActiveKey(tab.key);
                  setRenaming(true);
                }
              }}
              title={tab.isCustom ? `${tabName(tab)} (custom tab)` : `${tabName(tab)} (standard tab)`}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                selected ? "bg-primary text-white" : "border border-line text-ink hover:border-primary/40 hover:text-primary",
              )}
            >
              <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", live ? "bg-emerald-400" : "bg-slate-300")} />
              <span className={cn("max-w-[11rem] truncate", !tab.label.trim() && "italic")}>{tabName(tab)}</span>
              {tab.isCustom ? (
                <span
                  aria-label="custom tab"
                  className={cn(
                    "rounded px-1 text-[9px] font-bold uppercase tracking-wide",
                    selected ? "bg-white/20 text-accent" : "bg-primary-soft text-primary-deep",
                  )}
                >
                  Custom
                </span>
              ) : null}
              <span className="text-[10px] font-medium opacity-70">{tab.features.length}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => {
            setAddOpen(true);
            setNotice(null);
          }}
          disabled={technical.tabs.length >= MAX_TABS}
          className="inline-flex shrink-0 items-center gap-1 rounded-md border border-dashed border-primary/50 bg-primary-soft/40 px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:border-primary hover:bg-primary-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus aria-hidden="true" className="size-3.5" />
          Add Tab
        </button>
      </div>

      {notice ? (
        <p role="status" className="mt-3 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
          <AlertTriangle aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          {notice}
        </p>
      ) : null}

      {addOpen ? (
        <AddTabForm
          tabs={technical.tabs}
          defaultPosition={technical.tabs.length + 1}
          onCancel={() => setAddOpen(false)}
          onCreate={addTab}
        />
      ) : null}

      <div className="mt-4 rounded-lg border border-line bg-slate-50/50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            {renaming ? (
              <RenameForm label={active.label} onCancel={() => setRenaming(false)} onSave={renameTab} />
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate font-display text-sm font-bold text-primary-deep">{tabName(active)} tab</h3>
                {active.isCustom || !active.label.trim() ? (
                  <button
                    type="button"
                    onClick={() => setRenaming(true)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold hover:bg-white",
                      active.label.trim() ? "text-primary" : "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
                    )}
                  >
                    <Pencil aria-hidden="true" className="size-3" />
                    {active.label.trim() ? "Rename" : "Name this tab"}
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted" title="Standard tabs keep their name">
                    <Lock aria-hidden="true" className="size-3" />
                    Standard
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-ink">
              <input
                type="checkbox"
                checked={active.enabled}
                onChange={() => toggleEnabled(active)}
                className="size-4 accent-[#2774AE]"
              />
              Show this tab on the website
            </label>
            <div className="flex items-center gap-0.5 border-l border-line pl-2">
              <button
                type="button"
                onClick={() => moveTabTo(activeIndex, activeIndex - 1)}
                disabled={activeIndex <= 0}
                className="rounded p-1.5 text-muted hover:bg-white hover:text-primary disabled:opacity-30"
                aria-label="Move this tab left"
                title="Move left"
              >
                <ArrowLeft aria-hidden="true" className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => moveTabTo(activeIndex, activeIndex + 1)}
                disabled={activeIndex === technical.tabs.length - 1}
                className="rounded p-1.5 text-muted hover:bg-white hover:text-primary disabled:opacity-30"
                aria-label="Move this tab right"
                title="Move right"
              >
                <ArrowRight aria-hidden="true" className="size-4" />
              </button>
              {canDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="rounded p-1.5 text-muted hover:bg-white hover:text-red-600"
                  aria-label={`Delete the ${tabName(active)} tab`}
                  title="Delete tab"
                >
                  <Trash2 aria-hidden="true" className="size-4" />
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {confirmDelete ? (
          <div role="alertdialog" aria-labelledby="delete-tab-title" className="mt-3 rounded-md border border-red-200 bg-red-50 p-3">
            <p id="delete-tab-title" className="text-sm font-semibold text-red-800">
              Delete the “{tabName(active)}” tab?
            </p>
            <p className="mt-1 text-xs text-red-700">
              {deleteHasContent
                ? "This tab has saved content (bullet points or descriptive text). Deleting it removes that content from this product permanently."
                : "This tab is empty. Deleting it removes the tab from this product."}
            </p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => deleteTab(active)}
                className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
              >
                Yes, delete tab
              </button>
              <button type="button" onClick={() => setConfirmDelete(false)} className="text-xs font-semibold text-muted hover:text-ink">
                Cancel
              </button>
            </div>
          </div>
        ) : null}

        {active.isCustom ? (
          <div className="mt-3">
            <label htmlFor={`tab-name-${active.key}`} className="text-sm font-semibold text-ink">Tab name</label>
            <p className="text-xs text-muted">Shown on the website exactly as typed, including capitalisation.</p>
            <input
              id={`tab-name-${active.key}`}
              value={active.label}
              onChange={(event) => updateTab({ label: event.target.value })}
              maxLength={60}
              placeholder="e.g. Working Principle"
              aria-invalid={!activeName || nameTaken}
              className={cn(field, "mt-1.5 bg-white")}
            />
            {!activeName ? (
              <p role="alert" className="mt-1 text-xs font-semibold text-red-600">Enter a name before saving.</p>
            ) : nameTaken ? (
              <p role="alert" className="mt-1 text-xs font-semibold text-red-600">Another tab already has this name.</p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-3">
          <label htmlFor={`tab-heading-${active.key}`} className="text-sm font-semibold text-ink">Section heading</label>
          <input
            id={`tab-heading-${active.key}`}
            value={active.heading}
            onChange={(event) => updateTab({ heading: event.target.value })}
            maxLength={120}
            placeholder={defaultHeadingFor(active.key) || `Heading shown above the ${tabName(active)} bullet points`}
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
                  aria-label={`${active.label} bullet ${index + 1} label`}
                  value={feature.label}
                  onChange={(event) => updateFeature(index, { label: event.target.value })}
                  placeholder="Label (optional)"
                  maxLength={80}
                  className={cn(field, "bg-white")}
                />
                <input
                  aria-label={`${active.label} bullet ${index + 1} text`}
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

function AddTabForm({
  tabs,
  defaultPosition,
  onCancel,
  onCreate,
}: {
  tabs: EditorTab[];
  defaultPosition: number;
  onCancel: () => void;
  onCreate: (input: { name: string; heading: string; position: number }) => string | null;
}) {
  const [name, setName] = useState("");
  const [heading, setHeading] = useState("");
  const [position, setPosition] = useState(String(defaultPosition));
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const duplicate = name.trim() && tabNameTaken(tabs, name);

  function submit() {
    if (duplicate) {
      setError("A tab with this name already exists.");
      return;
    }
    const parsed = Number.parseInt(position, 10);
    const target = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), tabs.length + 1) : tabs.length + 1;
    setError(onCreate({ name, heading, position: target }));
  }

  return (
    <div className="mt-4 rounded-lg border-2 border-primary/30 bg-primary-soft/20 p-4">
      <h3 className="font-display text-sm font-bold text-primary-deep">Add a custom tab</h3>
      <p className="mt-0.5 text-xs text-muted">
        Custom tabs appear only on this product, next to the {DEFAULT_TAB_COUNT} standard tabs. You can create it now and
        fill in its content later.
      </p>
      {/* Not a <form>: this editor is rendered inside the product editor's form. */}
      <div
        role="group"
        aria-label="New tab details"
        onKeyDown={(event) => {
          if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
            event.preventDefault();
            submit();
          }
        }}
        className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,0.7fr)]"
      >
        <div>
          <label htmlFor="new-tab-name" className="text-xs font-semibold text-ink">
            Tab name <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            ref={nameRef}
            id="new-tab-name"
            autoFocus
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError(null);
            }}
            maxLength={60}
            placeholder="e.g. Maintenance"
            aria-invalid={Boolean(duplicate || error)}
            aria-describedby="new-tab-name-help"
            className={cn(field, "mt-1 bg-white")}
          />
          <p id="new-tab-name-help" className={cn("mt-1 text-[11px]", duplicate ? "font-semibold text-red-600" : "text-muted")}>
            {duplicate ? "A tab with this name already exists." : `${name.trim().length}/60 · must be unique on this product.`}
          </p>
        </div>
        <div>
          <label htmlFor="new-tab-heading" className="text-xs font-semibold text-ink">Section heading (optional)</label>
          <input
            id="new-tab-heading"
            value={heading}
            onChange={(event) => setHeading(event.target.value)}
            maxLength={120}
            placeholder={name.trim() ? `${name.trim()} Features` : "e.g. Maintenance Features"}
            className={cn(field, "mt-1 bg-white")}
          />
          <p className="mt-1 text-[11px] text-muted">Defaults to “{name.trim() || "Tab name"} Features”.</p>
        </div>
        <div>
          <label htmlFor="new-tab-position" className="text-xs font-semibold text-ink">Display position</label>
          <input
            id="new-tab-position"
            type="number"
            min={1}
            max={tabs.length + 1}
            value={position}
            onChange={(event) => setPosition(event.target.value)}
            className={cn(field, "mt-1 bg-white")}
          />
          <p className="mt-1 text-[11px] text-muted">1 = first · {tabs.length + 1} = last</p>
        </div>
        {error ? (
          <p role="alert" className="text-xs font-semibold text-red-600 sm:col-span-3">
            {error}
          </p>
        ) : null}
        <div className="flex gap-2 sm:col-span-3">
          <button
            type="button"
            onClick={submit}
            disabled={Boolean(duplicate)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-deep disabled:opacity-50"
          >
            <Plus aria-hidden="true" className="size-3.5" />
            Create tab
          </button>
          <button type="button" onClick={onCancel} className="px-2 text-xs font-semibold text-muted hover:text-ink">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function RenameForm({
  label,
  onCancel,
  onSave,
}: {
  label: string;
  onCancel: () => void;
  onSave: (name: string) => string | null;
}) {
  const [name, setName] = useState(label);
  const [error, setError] = useState<string | null>(null);

  // Not a <form>: this editor is rendered inside the product editor's form.
  return (
    <div role="group" aria-label="Rename tab" className="flex flex-wrap items-center gap-2">
      <label htmlFor="rename-tab" className="sr-only">Tab name</label>
      <input
        id="rename-tab"
        autoFocus
        value={name}
        onChange={(event) => {
          setName(event.target.value);
          setError(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            setError(onSave(name));
          }
          if (event.key === "Escape") onCancel();
        }}
        maxLength={60}
        aria-invalid={Boolean(error)}
        className={cn(field, "w-56 bg-white")}
      />
      <button type="button" onClick={() => setError(onSave(name))} className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-deep">
        Save name
      </button>
      <button type="button" onClick={onCancel} className="text-xs font-semibold text-muted hover:text-ink">
        Cancel
      </button>
      {error ? <span role="alert" className="text-xs font-semibold text-red-600">{error}</span> : null}
    </div>
  );
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
