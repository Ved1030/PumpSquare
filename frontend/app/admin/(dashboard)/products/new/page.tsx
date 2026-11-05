import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { hasPermission } from "@/lib/auth/roles";
import { getAdminCategoriesSafe } from "@/lib/products-server";
import ProductEditor from "@/components/admin/ProductEditor";
import CategoryLoadError from "@/components/admin/CategoryLoadError";

export const instant = false;

export default async function NewProductPage() {
  const user = await requireAdmin();
  if (!hasPermission(user.role, "products:write")) redirect("/admin");

  const { categories, error } = await getAdminCategoriesSafe();
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary-deep">Add Product</h1>
          <p className="mt-1 text-sm text-muted">Create a new catalogue entry, then publish it when it is ready.</p>
        </div>
      </div>
      {error ? <CategoryLoadError message={error} /> : null}
      <ProductEditor categories={categories} categoriesError={error} />
    </div>
  );
}
