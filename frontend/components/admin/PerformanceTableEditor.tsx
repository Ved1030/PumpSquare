"use client";

import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Plus, Trash2 } from "lucide-react";
import type { PerformanceColumn } from "@/lib/products";
import { moveItem, newId } from "./editor-types";

type Row = { id: string; cells: Record<string, string> };

const cell =
  "w-full min-w-[8rem] rounded-md border border-line px-2.5 py-2 text-sm text-ink focus:border-primary focus:outline-none";

export default function PerformanceTableEditor({
  columns,
  rows,
  onColumns,
  onRows,
}: {
  columns: PerformanceColumn[];
  rows: Row[];
  onColumns: (columns: PerformanceColumn[]) => void;
  onRows: (rows: Row[]) => void;
}) {
  const updateColumn = (index: number, patch: Partial<PerformanceColumn>) =>
    onColumns(columns.map((column, i) => (i === index ? { ...column, ...patch } : column)));

  const removeColumn = (index: number) => {
    const removed = columns[index];
    onColumns(columns.filter((_, i) => i !== index));
    onRows(rows.map((row) => {
      const cells = { ...row.cells };
      delete cells[removed.id];
      return { ...row, cells };
    }));
  };

  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <h2 className="font-display text-base font-bold text-primary-deep">Performance Table</h2>
      <p className="mt-1 text-xs text-muted">
        Shown under every tab of this product. Units can be entered per column or as
        &ldquo;Inlet × Outlet (BSP)&rdquo; style notes.
      </p>

      {columns.length === 0 ? (
        <p className="mt-4 rounded-md border border-dashed border-line bg-slate-50 p-4 text-xs text-muted">
          Add a column such as &ldquo;Pump Model&rdquo; to start the table.
        </p>
      ) : (
        <div className="mt-4 space-y-2">
          {columns.map((column, index) => (
            <div key={column.id} className="flex flex-wrap items-end gap-2 rounded-md border border-line/70 bg-slate-50/60 p-2">
              <div className="min-w-[9rem] flex-1">
                <label htmlFor={`col-name-${column.id}`} className="text-[11px] font-semibold text-muted">Column</label>
                <input
                  id={`col-name-${column.id}`}
                  value={column.name}
                  onChange={(event) => updateColumn(index, { name: event.target.value })}
                  maxLength={80}
                  placeholder="e.g. Max Flow"
                  className={cell}
                />
              </div>
              <div className="min-w-[9rem] flex-1">
                <label htmlFor={`col-unit-${column.id}`} className="text-[11px] font-semibold text-muted">Unit (optional)</label>
                <input
                  id={`col-unit-${column.id}`}
                  value={column.unit}
                  onChange={(event) => updateColumn(index, { unit: event.target.value })}
                  maxLength={80}
                  placeholder="e.g. LPM"
                  className={cell}
                />
              </div>
              <RowActions
                label={column.name || `column ${index + 1}`}
                canLeft={index > 0}
                canRight={index < columns.length - 1}
                onMove={(direction) => onColumns(moveItem(columns, index, direction))}
                onRemove={() => removeColumn(index)}
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={columns.length >= 24}
          onClick={() => onColumns([...columns, { id: newId(), name: "", unit: "" }])}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-deep disabled:opacity-50"
        >
          <Plus aria-hidden="true" className="size-4" />
          Add column
        </button>
        <button
          type="button"
          disabled={columns.length === 0 || rows.length >= 200}
          onClick={() => onRows([...rows, { id: newId(), cells: {} }])}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-deep disabled:opacity-50"
        >
          <Plus aria-hidden="true" className="size-4" />
          Add row
        </button>
      </div>

      {columns.length > 0 && rows.length > 0 ? (
        <div className="mt-4 overflow-x-auto rounded-md border border-line">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">Performance table rows</caption>
            <thead>
              <tr className="bg-primary-soft/60">
                {columns.map((column) => (
                  <th key={column.id} scope="col" className="px-2 py-2 text-left text-xs font-bold text-primary-deep">
                    {column.name || "Untitled"}
                    {column.unit ? <span className="ml-1 font-medium text-muted">({column.unit})</span> : null}
                  </th>
                ))}
                <th scope="col" className="w-28 px-2 py-2">
                  <span className="sr-only">Row actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={row.id} className="border-t border-line">
                  {columns.map((column) => (
                    <td key={column.id} className="p-1">
                      <input
                        aria-label={`Row ${rowIndex + 1} ${column.name || "column"}`}
                        value={row.cells[column.id] ?? ""}
                        onChange={(event) =>
                          onRows(rows.map((item, i) => (i === rowIndex ? { ...item, cells: { ...item.cells, [column.id]: event.target.value } } : item)))
                        }
                        maxLength={300}
                        className="w-full rounded border border-transparent px-2 py-1.5 focus:border-primary focus:outline-none"
                      />
                    </td>
                  ))}
                  <td className="px-1">
                    <RowActions
                      label={`row ${rowIndex + 1}`}
                      canLeft={rowIndex > 0}
                      canRight={rowIndex < rows.length - 1}
                      onMove={(direction) => onRows(moveItem(rows, rowIndex, direction))}
                      onRemove={() => onRows(rows.filter((_, i) => i !== rowIndex))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

function RowActions({
  label,
  canLeft,
  canRight,
  onMove,
  onRemove,
}: {
  label: string;
  canLeft: boolean;
  canRight: boolean;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center">
      <button type="button" onClick={() => onMove(-1)} disabled={!canLeft} className="rounded p-1.5 text-muted hover:text-primary disabled:opacity-30" aria-label={`Move ${label} left/up`}>
        <ArrowUp aria-hidden="true" className="size-4 sm:hidden" />
        <ArrowLeft aria-hidden="true" className="hidden size-4 sm:block" />
      </button>
      <button type="button" onClick={() => onMove(1)} disabled={!canRight} className="rounded p-1.5 text-muted hover:text-primary disabled:opacity-30" aria-label={`Move ${label} right/down`}>
        <ArrowDown aria-hidden="true" className="size-4 sm:hidden" />
        <ArrowRight aria-hidden="true" className="hidden size-4 sm:block" />
      </button>
      <button type="button" onClick={onRemove} className="rounded p-1.5 text-muted hover:text-red-600" aria-label={`Remove ${label}`}>
        <Trash2 aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
