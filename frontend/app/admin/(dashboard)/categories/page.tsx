import { requireAdmin } from "@/lib/auth/guard";
import { hasPermission } from "@/lib/auth/roles";
import { getAdminCategoriesSafe } from "@/lib/products-server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import CategoryLoadError from "@/components/admin/CategoryLoadError";
import CategoryManager from "@/components/admin/CategoryManager";

export const instant = false;

export default async function AdminCategoriesPage() {
  const user = await requireAdmin();
  const { categories, error } = await getAdminCategoriesSafe();

  return (
    <div>
      <AdminPageHeader
        title="Product categories"
        description="Categories group products in the public catalogue. Deactivate a category to hide it without losing its products."
        role={user.role}
      />
      {error ? <CategoryLoadError message={error} /> : null}
      <CategoryManager categories={categories} canEdit={!error && hasPermission(user.role, "categories:write")} />
    </div>
  );
}
