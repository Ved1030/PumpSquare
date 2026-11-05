"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  PackageSearch,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import type { AdminProductSummary } from "@/lib/products";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "published" | "draft";

const STATUS_STYLES = {
  published: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  draft: "bg-amber-50 text-amber-700 ring-amber-200",
} as const;

const PAGE_SIZE = 10;

export default function AdminProductTable({
  products,
  canEdit,
}: {
  products: AdminProductSummary[];
  canEdit: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminProductSummary | null>(null);

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((product) => {
      if (product.category) map.set(product.category.slug, product.category.name);
    });
    return [...map.entries()];
  }, [products]);

  const visible = products.filter((product) => {
    if (status !== "all" && product.status !== status) return false;
    if (category !== "all" && product.category?.slug !== category) return false;
    if (query && !`${product.name} ${product.slug} ${product.category?.name ?? ""}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  async function toggleStatus(product: AdminProductSummary) {
    setBusy(product.id);
    setError(null);
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set-status",
          status: product.status === "published" ? "draft" : "published",
        }),
      });
      const data = (await response.json()) as { ok: boolean; message?: string };
      if (!response.ok || !data.ok) throw new Error(data.message ?? "Update failed.");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Update failed.");
    } finally {
      setBusy(null);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    const product = pendingDelete;
    setBusy(product.id);
    setError(null);
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      const data = (await response.json()) as { ok: boolean; message?: string };
      if (!response.ok || !data.ok) throw new Error(data.message ?? "Delete failed.");
      setPendingDelete(null);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Delete failed.");
    } finally {
      setBusy(null);
    }
  }

  const control =
    "rounded-md border border-line bg-white px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none";

  if (products.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-dashed border-line bg-white px-6 py-16 text-center">
        <PackageSearch aria-hidden="true" className="mx-auto size-10 text-muted" />
        <h2 className="mt-4 font-display text-xl font-bold text-primary-deep">No Products Added Yet</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Start building your product catalogue by adding your first product.
        </p>
        {canEdit ? (
          <Link
            href="/admin/products/new"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-bold text-primary-deep transition-colors hover:bg-accent-dark"
          >
            <Plus aria-hidden="true" className="size-4" />
            Add Your First Product
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name, slug or category"
            aria-label="Search products"
            className="w-full rounded-md border border-line bg-white py-2 pr-3 pl-9 text-sm text-ink focus:border-primary focus:outline-none"
          />
        </div>
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as StatusFilter);
            setPage(1);
          }}
          aria-label="Filter by status"
          className={control}
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setPage(1);
          }}
          aria-label="Filter by category"
          className={control}
        >
          <option value="all">All categories</option>
          {categories.map(([slug, name]) => (
            <option key={slug} value={slug}>{name}</option>
          ))}
        </select>
      </div>

      {error ? (
        <p role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line bg-slate-50 text-xs uppercase tracking-wider text-muted">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Product</th>
              <th scope="col" className="px-4 py-3 font-semibold">Category</th>
              <th scope="col" className="px-4 py-3 font-semibold">Status</th>
              <th scope="col" className="px-4 py-3 font-semibold">Last updated</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {paged.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-md border border-line bg-slate-50">
                      {product.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.image} alt="" className="size-full object-contain p-0.5" />
                      ) : (
                        <PackageSearch aria-hidden="true" className="size-4 text-muted" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{product.name}</p>
                      <p className="truncate text-xs text-muted">/products/{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{product.category?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", STATUS_STYLES[product.status])}>
                    {product.status === "published" ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {new Date(product.updatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {product.status === "published" ? (
                      <a
                        href={`/products/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md p-2 text-muted hover:bg-slate-100 hover:text-primary"
                        aria-label={`View ${product.name} on the public site`}
                        title="Preview on public site"
                      >
                        <Eye aria-hidden="true" className="size-4" />
                      </a>
                    ) : (
                      <span className="rounded-md p-2 text-muted/50" title="Drafts are not visible on the public site">
                        <Eye aria-hidden="true" className="size-4" />
                      </span>
                    )}
                    {canEdit ? (
                      <>
                        <button
                          type="button"
                          onClick={() => toggleStatus(product)}
                          disabled={busy === product.id}
                          className="rounded-md border border-line px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-primary/40 hover:text-primary disabled:opacity-50"
                        >
                          {busy === product.id ? (
                            <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />
                          ) : product.status === "published" ? (
                            "Unpublish"
                          ) : (
                            "Publish"
                          )}
                        </button>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="rounded-md p-2 text-muted hover:bg-slate-100 hover:text-primary"
                          aria-label={`Edit ${product.name}`}
                        >
                          <Pencil aria-hidden="true" className="size-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(product)}
                          disabled={busy === product.id}
                          className="rounded-md p-2 text-muted hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          aria-label={`Delete ${product.name}`}
                        >
                          <Trash2 aria-hidden="true" className="size-4" />
                        </button>
                      </>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted">
                  No products match these filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
        <p>
          Showing {visible.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–
          {Math.min(currentPage * PAGE_SIZE, visible.length)} of {visible.length}
        </p>
        {pageCount > 1 ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 rounded-md border border-line bg-white px-2.5 py-1.5 font-semibold text-ink disabled:opacity-50"
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
              Previous
            </button>
            <span className="px-2">Page {currentPage} of {pageCount}</span>
            <button
              type="button"
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === pageCount}
              className="inline-flex items-center gap-1 rounded-md border border-line bg-white px-2.5 py-1.5 font-semibold text-ink disabled:opacity-50"
            >
              Next
              <ChevronRight aria-hidden="true" className="size-4" />
            </button>
          </div>
        ) : null}
      </div>

      {pendingDelete ? (
        <ConfirmDeleteDialog
          product={pendingDelete}
          busy={busy === pendingDelete.id}
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => void confirmDelete()}
        />
      ) : null}
    </div>
  );
}

function ConfirmDeleteDialog({
  product,
  busy,
  onCancel,
  onConfirm,
}: {
  product: AdminProductSummary;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [busy, onCancel]);

  return (
    <div className="fixed inset-0 z-[200] grid place-items-center bg-primary-deep/50 p-4" role="presentation" onClick={() => !busy && onCancel()}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="delete-title" className="font-display text-lg font-bold text-primary-deep">
            Delete “{product.name}”?
          </h2>
          <button type="button" onClick={onCancel} disabled={busy} className="rounded p-1 text-muted hover:text-ink" aria-label="Close">
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
        <p id="delete-description" className="mt-2 text-sm text-muted">
          The product will be removed from the admin list and from the public website immediately. This action cannot be undone from the dashboard.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-md border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-primary/40 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {busy ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <Trash2 aria-hidden="true" className="size-4" />}
            Delete product
          </button>
        </div>
      </div>
    </div>
  );
}
