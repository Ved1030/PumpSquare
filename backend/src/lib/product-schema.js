import { getSupabaseAdmin } from "./supabase.js";

// Present only after `npm run db:migrate` has added them to the products table.
const MIGRATED_COLUMNS = ["deleted_at", "display_order", "gallery_images"];
// Storage-path columns arrive with the same migration but are detected
// separately: a database without the default columns can still have them, and
// they must keep saving regardless of which other columns exist.
const STORAGE_COLUMNS = ["image_storage_path", "gallery_storage_paths", "catalogue_storage_path", "datasheet_storage_path"];

const columnCache = new Map();

/**
 * Columns are probed one at a time because PostgREST reports only the first
 * missing column of a select. A plain "select *" check cannot be used either:
 * the service key is unrestricted and silently returns every column.
 */
function hasColumns(key, columns) {
  if (!columnCache.has(key)) {
    columnCache.set(
      key,
      (async () => {
        const present = {};
        for (const column of columns) {
          const { error } = await getSupabaseAdmin().from("products").select(column).limit(1);
          if (error && error.code !== "42703") throw error;
          present[column] = !error;
        }
        return present;
      })(),
    );
  }
  return columnCache.get(key);
}

export async function hasProductMigration() {
  const present = await hasColumns("defaults", MIGRATED_COLUMNS);
  return MIGRATED_COLUMNS.every((column) => present[column]);
}

export async function hasStoragePathColumns() {
  const present = await hasColumns("storage", STORAGE_COLUMNS);
  return {
    image: present.image_storage_path,
    gallery: present.gallery_storage_paths,
    catalogue: present.catalogue_storage_path,
    datasheet: present.datasheet_storage_path,
  };
}

let reviewTabState = null;

/**
 * Dynamic tabs (label, is_custom, sort_order) arrive with the review tab
 * migration. Until it runs, tabs are saved with the standard columns only.
 */
export async function hasDynamicReviewTabs() {
  if (reviewTabState === null) {
    const { error } = await getSupabaseAdmin().from("product_review_tabs").select("label, is_custom, sort_order").limit(1);
    if (!error) reviewTabState = true;
    else if (error.code === "42703" || error.code === "PGRST204") reviewTabState = false;
    else if (error.code === "42P01") reviewTabState = false;
    else throw error;
  }
  return reviewTabState;
}

let categoryState = null;

/**
 * Category hierarchy/activation columns arrive with the same migration. Until
 * then they are reported as defaults so the admin UI keeps working.
 */
export async function hasCategoryColumns() {
  if (categoryState === null) {
    const { error } = await getSupabaseAdmin().from("product_categories").select("parent_id, is_active, description").limit(1);
    if (!error) categoryState = true;
    else if (error.code === "42703") categoryState = false;
    else throw error;
  }
  return categoryState;
}
