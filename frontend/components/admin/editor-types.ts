import {
  REVIEW_TABS,
  type MaterialRow,
  type PerformanceColumn,
  type ReviewFeature,
  type ReviewTabKey,
  type TechnicalContent,
} from "@/lib/products";

export type EditorFeature = { label: string; text: string };

export type EditorTab = {
  key: ReviewTabKey;
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

export function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export const toEditorFeature = (feature: ReviewFeature): EditorFeature => ({
  label: feature.label ?? "",
  text: feature.text,
});

export function emptyTechnical(): EditorTechnical {
  return {
    tabs: REVIEW_TABS.map((tab) => ({
      key: tab.key,
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

/** Merges saved technical content with the canonical tab list and order. */
export function normalizeTechnical(value: TechnicalContent | undefined): EditorTechnical {
  const empty = emptyTechnical();
  if (!value) return empty;
  return {
    tabs: empty.tabs.map((fallback) => {
      const saved = value.tabs.find((tab) => tab.key === fallback.key);
      if (!saved) return fallback;
      return {
        key: fallback.key,
        enabled: saved.enabled,
        heading: saved.heading || fallback.heading,
        intro: saved.intro ?? "",
        features: saved.features.map(toEditorFeature),
      };
    }),
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

  return {
    tabs: technical.tabs.map((tab) => ({
      key: tab.key,
      enabled: tab.enabled,
      heading: tab.heading.trim(),
      intro: tab.intro,
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
