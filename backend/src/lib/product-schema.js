import { getSupabaseAdmin } from "./supabase.js";

// Present only after `npm run db:migrate` has added them to the products table.
const MIGRATED_COLUMNS = "deleted_at, display_order, gallery_images";

let state = null;

export async function hasProductMigration() {
  if (state === null) {
    const { error } = await getSupabaseAdmin().from("products").select(MIGRATED_COLUMNS).limit(1);
    if (!error) state = true;
    else if (error.code === "42703") state = false;
    else throw error;
  }
  return state;
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
