import { REVIEW_TABS, type ReviewTab } from "@/lib/products";

const STANDARD_LABELS = new Map<string, string>(REVIEW_TABS.map((tab) => [tab.key, tab.label]));

export function isStandardTabKey(key: string) {
  return STANDARD_LABELS.has(key);
}

/** The canonical name of a standard tab, or null for custom keys. */
export function standardTabLabel(key: string) {
  return STANDARD_LABELS.get(key) ?? null;
}

/**
 * The exact name an administrator entered, or null when a tab has never been
 * named. Custom tabs must not be shown (or prefilled) from their identifier.
 */
export function customTabName(tab: Pick<ReviewTab, "key" | "label">) {
  const label = tab.label?.trim();
  return label ? label : null;
}

/**
 * Display name for a public tab: the stored name exactly as entered, falling
 * back to the standard tab's canonical name — never to the internal key.
 */
export function tabDisplayName(tab: Pick<ReviewTab, "key" | "label">) {
  return customTabName(tab) ?? standardTabLabel(tab.key);
}
