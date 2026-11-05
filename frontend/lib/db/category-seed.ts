/**
 * Pumpsquare catalogue categories, matching the old site's product menu.
 * "Pumps Series" is listed under "SEIM SRL Pumps" there, hence the parent.
 * Products are never assigned here — they keep whatever category they have.
 */
export const PUMPSQUARE_CATEGORIES = [
  { slug: "pumps", name: "Pumps", parent: null },
  { slug: "valves", name: "Valves", parent: null },
  { slug: "filters-strainers", name: "Filters & Strainers", parent: null },
  { slug: "other-divisions", name: "Other Divisions", parent: null },
  { slug: "seim-srl-pumps", name: "SEIM SRL Pumps", parent: null },
  { slug: "pumps-series", name: "Pumps Series", parent: "seim-srl-pumps" },
] as const;

type Queryable = { query: (sql: string, params?: unknown[]) => Promise<{ rows: { id: string }[] }> };

/**
 * Creates missing categories and fills in their parent/order. Existing rows are
 * reused by slug so product relationships and admin edits (name, active flag)
 * survive repeated runs. Run inside a transaction.
 */
export async function seedPumpsquareCategories(client: Queryable) {
  const ids = new Map<string, string>();
  for (const [index, category] of PUMPSQUARE_CATEGORIES.entries()) {
    const parentId = category.parent ? ids.get(category.parent) ?? null : null;
    const { rows } = await client.query(
      `insert into product_categories (id, name, slug, sort_order, parent_id)
       values (gen_random_uuid(), $1, $2, $3, $4)
       on conflict (slug) do update set sort_order = excluded.sort_order, parent_id = excluded.parent_id
       returning id`,
      [category.name, category.slug, index, parentId],
    );
    ids.set(category.slug, rows[0].id);
  }
  return ids;
}
