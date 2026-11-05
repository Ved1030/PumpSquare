import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth/guard";
import { hasPermission } from "@/lib/auth/roles";
import { listAdminProducts } from "@/lib/products-server";
import AdminProductTable from "@/components/admin/AdminProductTable";

export const instant = false;

export default async function AdminProductsPage() {
  const user = await requireAdmin();
  const products = await listAdminProducts();
  const canEdit = hasPermission(user.role, "products:write");

  const published = products.filter((product) => product.status === "published").length;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary-deep">Products</h1>
          <p className="mt-1 text-sm text-muted">
            {products.length} total · {published} published · {products.length - published} draft
          </p>
        </div>
        {canEdit ? (
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2.5 rounded-lg bg-accent px-5 py-3 text-sm font-bold text-primary-deep shadow-sm transition-colors hover:bg-accent-dark"
          >
            <Plus aria-hidden="true" className="size-4" strokeWidth={3} />
            Add Product
          </Link>
        ) : null}
      </div>

      <AdminProductTable products={products} canEdit={canEdit} />
    </div>
  );
}
