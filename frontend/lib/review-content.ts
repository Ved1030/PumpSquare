import type { ReviewFeature } from "@/lib/products";

/**
 * Splits "Label: Detail" into a labelled bullet when the label is short and
 * sentence-like (so "Note: see table" stays a label, a colon inside a long
 * sentence does not split it).
 */
export function parseLabeledBullet(line: string): ReviewFeature {
  const match = line.match(/^([^:]{2,40}):\s+(.+)$/);
  if (match && !/[.,;:]{1}$/.test(match[1])) return { label: match[1].trim(), text: match[2].trim() };
  return { text: line.trim() };
}
