"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, ArrowDown, ArrowUp, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import type { AdminCategory } from "@/lib/products";
import { slugify } from "@/lib/slugify";

const input = "w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none";

type Draft = {
  name: string;
  slug: string;
  description: string;
  parentId: string;
  sortOrder: string;
  isActive: boolean;
};

const emptyDraft = (categories: AdminCategory[]): Draft => ({
  name: "",
  slug: "",
  description: "",
  parentId: "",
  sortOrder: String(
    categories.reduce((max, category) => Math.max(max, category.sortOrder ?? 0), -1) + 10,
  ),
  isActive: true,
});

function byOrder(a: AdminCategory, b: AdminCategory) {
  return (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name);
}

/** Roots in display order, each followed by its children (one level deep). */
function orderedTree(categories: AdminCategory[]) {
  const ids = new Set(categories.map((category) => category.id));
  const isChild = (category: AdminCategory) => Boolean(category.parentId && ids.has(category.parentId));
  const roots = categories.filter((category) => !isChild(category)).sort(byOrder);
  return roots.flatMap((root) => [
    { category: root, depth: 0 },
    ...categories.filter((category) => category.parentId === root.id).sort(byOrder).map((category) => ({ category, depth: 1 })),
  ]);
}

export default function CategoryManager({
  categories,
  canEdit,
}: {
  categories: AdminCategory[];
  canEdit: boolean;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(() => emptyDraft(categories));
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rows = orderedTree(categories);
  // Only top-level categories can be parents, and only while they have no children.
  const parentOptions = categories
    .filter((category) => !category.parentId && (category.id === editing?.parentId || !(category.childIds?.length ?? 0)))
    .sort(byOrder);

  function update(patch: Partial<Draft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function reset() {
    setEditing(null);
    setDraft(emptyDraft(categories));
    setError(null);
  }

  function startEdit(category: AdminCategory) {
    setEditing(category);
    setDraft({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      parentId: category.parentId ?? "",
      sortOrder: String(category.sortOrder ?? 0),
      isActive: category.isActive !== false,
    });
    setError(null);
  }

  async function send(url: string, method: string, body?: unknown) {
    const response = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };
    if (!response.ok || !data.ok) throw new Error(data.message ?? "Could not save the category.");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);

    const order = Number.parseInt(draft.sortOrder, 10);
    const body = {
      name: draft.name.trim(),
      slug: draft.slug.trim(),
      description: draft.description.trim(),
      parentId: draft.parentId || null,
      sortOrder: Number.isFinite(order) ? order : 0,
      isActive: draft.isActive,
    };

    try {
      await send(editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories", editing ? "PATCH" : "POST", body);
      reset();
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save the category.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(category: AdminCategory) {
    setBusy(true);
    setError(null);
    try {
      await send(`/api/admin/categories/${category.id}`, "PATCH", { isActive: category.isActive === false });
      if (editing?.id === category.id) setEditing(null);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not update the category.");
    } finally {
      setBusy(false);
    }
  }

  async function move(category: AdminCategory, direction: -1 | 1) {
    const siblings = categories.filter((other) => (other.parentId ?? null) === (category.parentId ?? null)).sort(byOrder);
    const index = siblings.findIndex((other) => other.id === category.id);
    const target = siblings[index + direction];
    if (!target) return;

    const order = category.sortOrder ?? 0;
    const targetOrder = target.sortOrder ?? 0;
    setBusy(true);
    setError(null);
    try {
      // Swap display order with the neighbour; nudge equal values so the swap always takes effect.
      await send(`/api/admin/categories/${category.id}`, "PATCH", {
        sortOrder: targetOrder === order ? targetOrder + direction : targetOrder,
      });
      await send(`/api/admin/categories/${target.id}`, "PATCH", { sortOrder: order });
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not reorder categories.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(category: AdminCategory) {
    if (!window.confirm(`Delete “${category.name}”? This cannot be undone.`)) return;

    setBusy(true);
    setError(null);
    try {
      await send(`/api/admin/categories/${category.id}`, "DELETE");
      if (editing?.id === category.id) reset();
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not delete the category.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        {error ? (
          <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}

        <div className="overflow-hidden rounded-xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-slate-50 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Category</th>
                <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                <th scope="col" className="px-4 py-3 font-semibold">Products</th>
                {canEdit ? <th scope="col" className="px-4 py-3 text-right font-semibold">Order</th> : null}
                {canEdit ? <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th> : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map(({ category, depth }) => {
                const active = category.isActive !== false;
                const hasChildren = (category.childIds?.length ?? 0) > 0;
                const locked = category.productCount > 0 || hasChildren;
                const siblings = categories.filter((other) => (other.parentId ?? null) === (category.parentId ?? null)).sort(byOrder);
                const position = siblings.findIndex((other) => other.id === category.id);
                return (
                  <tr key={category.id} className={active ? undefined : "bg-slate-50/60"}>
                    <td className="px-4 py-3">
                      <p className={depth ? "pl-5 text-ink" : "font-semibold text-ink"}>
                        {depth ? <span aria-hidden="true" className="mr-1 text-muted">└</span> : null}
                        {category.name}
                      </p>
                      <p className="text-xs text-muted">
                        {depth ? "Sub-category · " : ""}/products?category={category.slug} · order {category.sortOrder ?? 0}
                      </p>
                      {category.description ? <p className="mt-1 text-xs text-muted">{category.description}</p> : null}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          active
                            ? "rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700"
                            : "rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600"
                        }
                      >
                        {active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {category.productCount > 0 ? (
                        <Link href="/admin" className="font-semibold text-primary hover:underline" title="Products are listed on the dashboard">
                          {category.productCount}
                        </Link>
                      ) : (
                        category.productCount
                      )}
                    </td>
                    {canEdit ? (
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => move(category, -1)}
                            disabled={busy || position <= 0}
                            className="rounded-md p-2 text-muted hover:bg-slate-100 hover:text-primary disabled:opacity-30"
                            aria-label={`Move ${category.name} up`}
                          >
                            <ArrowUp aria-hidden="true" className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => move(category, 1)}
                            disabled={busy || position < 0 || position >= siblings.length - 1}
                            className="rounded-md p-2 text-muted hover:bg-slate-100 hover:text-primary disabled:opacity-30"
                            aria-label={`Move ${category.name} down`}
                          >
                            <ArrowDown aria-hidden="true" className="size-4" />
                          </button>
                        </div>
                      </td>
                    ) : null}
                    {canEdit ? (
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => startEdit(category)}
                            className="rounded-md p-2 text-muted hover:bg-slate-100 hover:text-primary"
                            aria-label={`Edit ${category.name}`}
                          >
                            <Pencil aria-hidden="true" className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleActive(category)}
                            disabled={busy}
                            className="rounded-md p-2 text-muted hover:bg-slate-100 hover:text-primary disabled:opacity-50"
                            aria-label={`${active ? "Deactivate" : "Activate"} ${category.name}`}
                            title={active ? "Deactivate" : "Activate"}
                          >
                            <Archive aria-hidden="true" className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(category)}
                            disabled={busy || locked}
                            className="rounded-md p-2 text-muted hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label={`Delete ${category.name}`}
                            title={
                              locked
                                ? hasChildren
                                  ? "Delete or move its sub-categories first."
                                  : "This category has products. Deactivate it or move the products instead."
                                : "Delete"
                            }
                          >
                            <Trash2 aria-hidden="true" className="size-4" />
                          </button>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                );
              })}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={canEdit ? 5 : 3} className="px-4 py-10 text-center text-muted">
                    No categories yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted">
          Categories with products or sub-categories cannot be deleted. Deactivate them instead — they stay linked to existing
          products but disappear from the public catalogue and cannot be chosen for new products.
        </p>
      </div>

      {canEdit ? (
        <form onSubmit={submit} className="h-fit rounded-xl border border-line bg-white p-5">
          <h2 className="font-display text-base font-bold text-primary-deep">
            {editing ? "Edit category" : "Add category"}
          </h2>
          <div className="mt-4 space-y-3">
            <div>
              <label htmlFor="category-name" className="text-sm font-semibold text-ink">Name</label>
              <input
                id="category-name"
                value={draft.name}
                onChange={(event) => {
                  const name = event.target.value;
                  update(editing ? { name } : { name, slug: slugify(name) });
                }}
                minLength={2}
                maxLength={60}
                className={`mt-1.5 ${input}`}
                required
              />
            </div>
            <div>
              <label htmlFor="category-slug" className="text-sm font-semibold text-ink">URL slug</label>
              <input
                id="category-slug"
                value={draft.slug}
                onChange={(event) => update({ slug: event.target.value })}
                maxLength={60}
                className={`mt-1.5 ${input}`}
                required
              />
            </div>
            <div>
              <label htmlFor="category-parent" className="text-sm font-semibold text-ink">Parent category</label>
              <select
                id="category-parent"
                value={draft.parentId}
                onChange={(event) => update({ parentId: event.target.value })}
                className={`mt-1.5 ${input}`}
                disabled={Boolean(editing && (editing.childIds?.length ?? 0) > 0)}
              >
                <option value="">None (top-level)</option>
                {parentOptions
                  .filter((category) => category.id !== editing?.id)
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                      {category.isActive === false ? " (inactive)" : ""}
                    </option>
                  ))}
              </select>
              <p className="mt-1 text-xs text-muted">Sub-categories are listed under their parent in the product form.</p>
            </div>
            <div>
              <label htmlFor="category-description" className="text-sm font-semibold text-ink">Description</label>
              <textarea
                id="category-description"
                value={draft.description}
                onChange={(event) => update({ description: event.target.value })}
                rows={2}
                maxLength={300}
                className={`mt-1.5 ${input}`}
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label htmlFor="category-order" className="text-sm font-semibold text-ink">Display order</label>
                <input
                  id="category-order"
                  type="number"
                  min={0}
                  max={9999}
                  value={draft.sortOrder}
                  onChange={(event) => update({ sortOrder: event.target.value })}
                  className={`mt-1.5 ${input}`}
                />
              </div>
              <label className="flex items-end gap-2 pb-2.5 text-sm font-semibold text-ink">
                <input
                  type="checkbox"
                  checked={draft.isActive}
                  onChange={(event) => update({ isActive: event.target.checked })}
                  className="size-4 accent-primary"
                />
                Active
              </label>
            </div>
          </div>

          {error ? <p role="alert" className="mt-3 text-sm font-medium text-red-600">{error}</p> : null}

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={busy}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
            >
              {busy ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <Plus aria-hidden="true" className="size-4" />}
              {editing ? "Save" : "Add"}
            </button>
            {editing ? (
              <button
                type="button"
                onClick={reset}
                className="rounded-md border border-line p-2.5 text-muted hover:text-ink"
                aria-label="Cancel editing"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            ) : null}
          </div>
        </form>
      ) : null}
    </div>
  );
}
