"use client";

import { ReactNode, useState, useCallback, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowUpDown, MoreHorizontal, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  className?: string;
  searchable?: boolean;
}

export interface ActionMenuItem<T> {
  label: string | ((item: T) => string);
  icon?: ReactNode;
  onClick: (item: T) => void;
  variant?: "default" | "danger";
}

interface AdminTableProps<T> {
  data?: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  emptyIcon?: "search" | "inbox" | "alert";
  loading?: boolean;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchKeys?: string[];
  actions?: ActionMenuItem<T>[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

export function AdminTable<T>({
  data = [],
  columns,
  keyExtractor,
  onRowClick,
  emptyMessage = "No data found",
  emptyIcon = "inbox",
  loading = false,
  selectable = false,
  selectedIds: externalSelectedIds,
  onSelectionChange,
  searchValue: externalSearchValue,
  onSearchChange,
  searchPlaceholder: _searchPlaceholder = "Search...",
  searchKeys,
  actions = [],
  pagination,
}: AdminTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [internalSelectedIds, setInternalSelectedIds] = useState<Set<string>>(new Set());
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  const selectedIds = externalSelectedIds !== undefined ? externalSelectedIds : internalSelectedIds;
  const setSelectedIds = onSelectionChange || setInternalSelectedIds;

  const searchValue = externalSearchValue ?? "";
  const isControlled = externalSearchValue !== undefined;

  useEffect(() => {
    if (!isControlled && searchValue === "" && externalSearchValue !== undefined) {
      onSearchChange?.("");
    }
  }, [isControlled, searchValue, externalSearchValue, onSearchChange]);

  const handleSort = useCallback((key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  }, [sortKey, sortOrder]);

  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return data;
    const search = searchValue.toLowerCase();
    return data.filter((item) => {
      const itemRecord = item as Record<string, unknown>;
      if (searchKeys && searchKeys.length > 0) {
        return searchKeys.some((key) => {
          const value = itemRecord[key];
          return String(value ?? "").toLowerCase().includes(search);
        });
      }
      return columns.some((col) => {
        if (!col.searchable && col.render) return false;
        const value = itemRecord[col.key];
        return String(value ?? "").toLowerCase().includes(search);
      });
    });
  }, [data, searchValue, columns, searchKeys]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aRecord = a as Record<string, unknown>;
      const bRecord = b as Record<string, unknown>;
      const aVal = aRecord[sortKey];
      const bVal = bRecord[sortKey];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      const comparison = String(aVal).localeCompare(String(bVal));
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortOrder]);

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === sortedData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sortedData.map(keyExtractor)));
    }
  }, [sortedData, selectedIds.size, keyExtractor, setSelectedIds]);

  const handleSelectRow = useCallback((id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  }, [selectedIds, setSelectedIds]);

  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 1;

  const allSelected = sortedData.length > 0 && selectedIds.size === sortedData.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < sortedData.length;

  if (loading) {
    return (
      <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
        <div className="animate-pulse p-4 space-y-4">
          {selectable && <div className="h-12 bg-stone-200 dark:bg-stone-700 rounded" />}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-stone-100 dark:bg-stone-700/50 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (sortedData.length === 0) {
    return (
      <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
        <EmptyState
          title={searchValue ? "No results found" : emptyMessage}
          description={searchValue ? `No items match "${searchValue}"` : undefined}
          icon={searchValue ? "search" : emptyIcon}
          action={searchValue ? { label: "Clear search", onClick: () => onSearchChange?.("") } : undefined}
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-stone-300 dark:border-stone-600 text-amber-600 focus:ring-amber-500"
                    aria-label="Select all"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left text-sm font-semibold text-stone-700 dark:text-stone-300",
                    col.sortable && "cursor-pointer select-none hover:bg-stone-100 dark:hover:bg-stone-800",
                    col.className
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {col.header}
                    {col.sortable && (
                      <ArrowUpDown
                        className={cn(
                          "w-4 h-4",
                          sortKey === col.key
                            ? "text-amber-600"
                            : "text-stone-400"
                        )}
                      />
                    )}
                  </div>
                </th>
              ))}
              {(actions.length > 0 || onRowClick) && (
                <th className="w-16 px-4 py-3" />
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
            {sortedData.map((item) => {
              const id = keyExtractor(item);
              const isSelected = selectedIds.has(id);

              return (
                <tr
                  key={id}
                  className={cn(
                    "transition-colors group",
                    isSelected
                      ? "bg-amber-50/50 dark:bg-amber-900/10"
                      : "hover:bg-stone-50 dark:hover:bg-stone-700/50",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {selectable && (
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(id)}
                        className="w-4 h-4 rounded border-stone-300 dark:border-stone-600 text-amber-600 focus:ring-amber-500"
                        aria-label={`Select ${id}`}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-sm text-stone-900 dark:text-stone-100"
                    >
                      {col.render
                        ? col.render(item)
                        : String((item as Record<string, unknown>)[col.key] ?? "")}
                    </td>
                  ))}
                  {(actions.length > 0 || onRowClick) && (
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="relative flex items-center justify-end">
                        {actions.length > 0 ? (
                          <div className="relative">
                            <button
                              onClick={() => setActionMenuOpen(actionMenuOpen === id ? null : id)}
                              className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-stone-100 dark:hover:bg-stone-700 transition-all"
                            >
                              <MoreHorizontal className="w-4 h-4 text-stone-500" />
                            </button>
                            {actionMenuOpen === id && (
                              <>
                                <div
                                  className="fixed inset-0 z-40"
                                  onClick={() => setActionMenuOpen(null)}
                                />
                                <div className="absolute right-0 top-full mt-1 z-50 w-40 bg-white dark:bg-stone-800 rounded-lg shadow-lg border border-stone-200 dark:border-stone-700 py-1">
                                  {onRowClick && (
                                    <button
                                      onClick={() => {
                                        onRowClick(item);
                                        setActionMenuOpen(null);
                                      }}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700"
                                    >
                                      <Eye className="w-4 h-4" />
                                      View details
                                    </button>
                                  )}
                                  {actions.map((action, index) => (
                                    <button
                                      key={index}
                                      onClick={() => {
                                        action.onClick(item);
                                        setActionMenuOpen(null);
                                      }}
                                      className={cn(
                                        "w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-stone-50 dark:hover:bg-stone-700",
                                        action.variant === "danger"
                                          ? "text-rose-600 dark:text-rose-400"
                                          : "text-stone-700 dark:text-stone-300"
                                      )}
                                    >
                                      {action.icon && <span className="w-4 h-4">{action.icon}</span>}
                                      {typeof action.label === "function" ? action.label(item) : action.label}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        ) : onRowClick ? (
                          <button className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-stone-100 dark:hover:bg-stone-700 transition-all">
                            <ChevronRight className="w-4 h-4 text-stone-400" />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
            {pagination.total}
            {searchValue && ` (filtered from ${data.length} total)`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-stone-600 dark:text-stone-300 px-2">
              Page {pagination.page} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
