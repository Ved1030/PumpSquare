import {
  REVIEW_TABS,
  type MaterialRow,
  type PerformanceColumn,
  type ReviewFeature,
  type TechnicalContent,
} from "@/lib/products";
import { richTextToPlain } from "@/lib/rich-text";
import { slugifyUnicode } from "@/lib/slugify";

export type EditorFeature = { label: string; text: string };

export type EditorTab = {
  /** Stable identifier; standard keys come from REVIEW_TABS, custom tabs use a UUID. */
  key: string;
  label: string;
  /** Set when the tab is customised; standard tabs keep their label from REVIEW_TABS. */
  customLabel?: string;
  /** True when this tab was created by an administrator (or renamed away from its default). */
  isCustom: boolean;
  enabled: boolean;
  heading: string;
  intro: string;
  features: EditorFeature[];
};

export type EditorTechnical = {
  tabs: EditorTab[];
  columns: PerformanceColumn[];
  rows: { id: string; cells: Record<string, string> }[];
  materials: MaterialRow[];
  paragraphs: { id: string; html: string }[];
};

export const DEFAULT_TAB_COUNT = REVIEW_TABS.length;
export const MAX_TABS = 40;

export function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export const toEditorFeature = (feature: ReviewFeature): EditorFeature => ({
  label: feature.label ?? "",
  text: feature.text,
});

function standardMeta(key: string) {
  return REVIEW_TABS.find((tab) => tab.key === key);
}

export function emptyTechnical(): EditorTechnical {
  return {
    tabs: REVIEW_TABS.map((tab) => ({
      key: tab.key,
      label: tab.label,
      isCustom: false,
      enabled: true,
      heading: tab.defaultHeading,
      intro: "",
      features: [],
    })),
    columns: [],
    rows: [],
    materials: [],
    paragraphs: [],
  };
}

/**
 * Custom tab names must be unique per product, ignoring case. The comparison
 * lowercases copies only — the stored label keeps the exact entered casing.
 */
export function tabNameTaken(tabs: EditorTab[], label: string, ignoreKey?: string) {
  const target = label.trim().toLowerCase();
  return tabs.some((tab) => tab.key !== ignoreKey && tab.label.trim().toLowerCase() === target);
}

/** Tab identifier for a new custom tab; never shown to visitors. */
export function tabKeyFor(name: string, taken: Iterable<string>) {
  const used = new Set(taken);
  const base = slugifyUnicode(name);
  const key = base || "tab";
  return used.has(key) ? newId() : key;
}

export function blankTabCount(tab: EditorTab) {
  return tab.features.filter((feature) => feature.text.trim()).length + (richTextToPlain(tab.intro) ? 1 : 0);
}

/** A tab is visible on the website only when enabled and not empty. */
export function isTabLive(tab: EditorTab) {
  return tab.enabled && (blankTabCount(tab) > 0 || tab.heading.trim().length > 0);
}

/** A tab that never received any content beyond its default heading. */
export function tabIsEmpty(tab: EditorTab) {
  const defaultHeading = standardMeta(tab.key)?.defaultHeading;
  return !blankTabCount(tab) && tab.heading.trim() === (defaultHeading ?? "");
}

export function moveTab(tabs: EditorTab[], from: number, to: number): EditorTab[] {
  if (from === to || from < 0 || to < 0 || from >= tabs.length || to >= tabs.length) return tabs;
  const next = [...tabs];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/**
 * Merges saved technical content with the standard tab list. Standard tabs are
 * always present (their saved copy wins), saved custom tabs follow in their
 * restored position, and any tab saved twice keeps its first copy.
 */
export function normalizeTechnical(value: TechnicalContent | undefined): EditorTechnical {
  const empty = emptyTechnical();
  if (!value) return empty;

  const savedKeys = new Set<string>();
  const custom: { tab: EditorTab; order: number }[] = [];
  let customIndex = 0;

  for (const saved of value.tabs) {
    if (savedKeys.has(saved.key)) continue;
    savedKeys.add(saved.key);
    const meta = standardMeta(saved.key);
    const features = (saved.features ?? []).map(toEditorFeature);
    if (meta) {
      // A standard tab only stops being standard once it is renamed; the key
      // never changes so its identity (and content) is preserved. The saved
      // label is shown exactly as stored.
      const isCustom = Boolean(saved.isCustom) || Boolean(saved.label && saved.label !== meta.label);
      custom.push({
        tab: {
          key: meta.key,
          label: saved.label?.trim() || meta.label,
          customLabel: isCustom && saved.label !== meta.label ? saved.label : undefined,
          isCustom,
          enabled: saved.enabled,
          heading: saved.heading || meta.defaultHeading,
          intro: saved.intro ?? "",
          features,
        },
        order: Number.isFinite(saved.sortOrder) ? (saved.sortOrder as number) : REVIEW_TABS.indexOf(meta),
      });
    } else {
      const order = Number.isFinite(saved.sortOrder) ? (saved.sortOrder as number) : REVIEW_TABS.length + customIndex;
      // The key is an identifier (often a lowercase slug) and is never shown;
      // a custom tab saved without a name starts blank so the editor asks for one.
      custom.push({
        tab: {
          key: saved.key,
          label: saved.label?.trim() || "",
          isCustom: true,
          enabled: saved.enabled,
          heading: saved.heading ?? "",
          intro: saved.intro ?? "",
          features,
        },
        order,
      });
      customIndex += 1;
    }
  }

  const tabs = [...custom].sort((a, b) => a.order - b.order).map((item) => item.tab);
  const standard = tabs.filter((tab) => !tab.isCustom && standardMeta(tab.key));
  const customisedStandard = tabs.filter((tab) => tab.isCustom && standardMeta(tab.key));
  const customTabs = tabs.filter((tab) => !standardMeta(tab.key));
  const knownStandard = new Set([...standard, ...customisedStandard].map((tab) => tab.key));
  const missingStandard = empty.tabs.filter((tab) => !knownStandard.has(tab.key));

  // The eight standard tabs stay in their familiar order (customised ones
  // included, so a renamed tab does not jump); custom tabs follow in their slots.
  return {
    tabs: [...standard, ...customisedStandard, ...customTabs, ...missingStandard],
    columns: value.performance.columns.map((column) => ({ ...column })),
    rows: value.performance.rows.map((row) => ({ id: row.id, cells: { ...row.cells } })),
    materials: value.materials.map((row) => ({ ...row })),
    paragraphs: value.paragraphs.map((paragraph) => ({ ...paragraph })),
  };
}

/** Drops empty rows and cells the table no longer shows before saving. */
export function toPayload(technical: EditorTechnical) {
  const columns = technical.columns
    .filter((column) => column.name.trim())
    .map((column) => ({ ...column, id: column.id || newId(), name: column.name.trim(), unit: column.unit.trim() }));
  const columnIds = new Set(technical.columns.map((column) => column.id));

  const rows = technical.rows
    .map((row) => {
      const cells: Record<string, string> = {};
      for (const [columnId, value] of Object.entries(row.cells)) {
        if (columnIds.has(columnId) && value.trim()) cells[columnId] = value;
      }
      return { id: row.id || newId(), cells };
    })
    .filter((row) => Object.keys(row.cells).length > 0);

  // Keys must stay unique within the insert; a clash can only come from tabs
  // that existed before names were guaranteed unique.
  const usedKeys = new Set<string>();
  const uniqueKey = (key: string) => {
    const next = usedKeys.has(key) ? newId() : key;
    usedKeys.add(next);
    return next;
  };

  return {
    tabs: technical.tabs.map((tab, index) => ({
      key: uniqueKey(tab.key),
      label: tab.label.trim(),
      enabled: tab.enabled,
      heading: tab.heading.trim(),
      intro: tab.intro,
      sortOrder: index,
      features: tab.features
        .filter((feature) => feature.text.trim())
        .map((feature) => ({
          ...(feature.label.trim() ? { label: feature.label.trim() } : {}),
          text: feature.text.trim(),
        })),
    })),
    performance: { columns, rows },
    materials: technical.materials
      .filter((row) => row.component.trim() && row.material.trim())
      .map((row) => ({
        id: row.id || newId(),
        component: row.component.trim(),
        material: row.material.trim(),
        specification: row.specification.trim(),
      })),
    paragraphs: technical.paragraphs
      .filter((paragraph) => paragraph.html.trim() && paragraph.html.replace(/<[^>]*>/g, "").trim())
      .map((paragraph) => ({ id: paragraph.id || newId(), html: paragraph.html })),
  };
}

export function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
