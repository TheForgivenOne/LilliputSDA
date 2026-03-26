"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  Search,
  X,
  ChevronDown,
  Check,
  Filter,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

interface BulkAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface AdminTableToolbarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchDebounceMs?: number;
  filters?: FilterConfig[];
  activeFilters?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  onClearFilters?: () => void;
  selectedCount?: number;
  bulkActions?: BulkAction[];
  onClearSelection?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  actions?: ReactNode;
  className?: string;
}

export function AdminTableToolbar({
  searchPlaceholder = "Search...",
  searchValue: externalSearchValue,
  onSearchChange,
  searchDebounceMs = 300,
  filters = [],
  activeFilters = {},
  onFilterChange,
  onClearFilters,
  selectedCount = 0,
  bulkActions = [],
  onClearSelection,
  onRefresh,
  isRefreshing = false,
  actions,
  className,
}: AdminTableToolbarProps) {
  const [internalSearchValue, setInternalSearchValue] = useState("");
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const searchValue = externalSearchValue !== undefined ? externalSearchValue : internalSearchValue;

  const handleSearchChange = useCallback(
    (value: string) => {
      if (externalSearchValue === undefined) {
        setInternalSearchValue(value);
      }

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        onSearchChange?.(value);
      }, searchDebounceMs);
    },
    [externalSearchValue, onSearchChange, searchDebounceMs]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const hasActiveFilters = filters.length > 0 && Object.keys(activeFilters).length > 0;
  const hasSearch = searchValue.length > 0;
  const showBulkBar = selectedCount > 0;

  if (showBulkBar) {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-600 text-white text-sm font-semibold">
            {selectedCount}
          </div>
          <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
            {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
          </span>
        </div>
        <div className="flex items-center gap-2">
          {bulkActions.map((action, index) => (
            <Button
              key={index}
              size="sm"
              variant={action.variant === "danger" ? "danger" : "secondary"}
              leftIcon={action.icon}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
          <Button size="sm" variant="ghost" onClick={onClearSelection}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <div className="flex-1 min-w-[200px] max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className={cn(
              "w-full pl-10 pr-10 py-2.5 text-sm",
              "bg-white dark:bg-stone-800",
              "border border-stone-200 dark:border-stone-700",
              "rounded-lg",
              "placeholder:text-stone-400 dark:placeholder:text-stone-500",
              "focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500",
              "transition-colors"
            )}
          />
          {hasSearch && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-stone-100 dark:hover:bg-stone-700 rounded"
            >
              <X className="w-3 h-3 text-stone-400" />
            </button>
          )}
        </div>
      </div>

      {filters.map((filter) => {
        const isOpen = openFilter === filter.key;
        const activeValue = activeFilters[filter.key];
        const hasActiveFilter = !!activeValue;

        return (
          <div key={filter.key} className="relative">
            <button
              onClick={() => setOpenFilter(isOpen ? null : filter.key)}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg border transition-colors",
                hasActiveFilter
                  ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400"
                  : "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-600"
              )}
            >
              <Filter className="w-4 h-4" />
              <span>{filter.label}</span>
              {hasActiveFilter ? (
                <span className="px-1.5 py-0.5 text-xs bg-amber-600 text-white rounded">
                  1
                </span>
              ) : (
                <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
              )}
            </button>
            {isOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpenFilter(null)} />
                <div className="absolute top-full left-0 mt-1 z-50 w-48 bg-white dark:bg-stone-800 rounded-lg shadow-lg border border-stone-200 dark:border-stone-700 py-1">
                  {filter.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onFilterChange?.(filter.key, option.value);
                        setOpenFilter(null);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors",
                        activeValue === option.value
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-stone-700 dark:text-stone-300"
                      )}
                    >
                      {option.label}
                      {activeValue === option.value && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                  {hasActiveFilter && (
                    <>
                      <div className="border-t border-stone-200 dark:border-stone-700 my-1" />
                      <button
                        onClick={() => {
                          onFilterChange?.(filter.key, "");
                          setOpenFilter(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Clear filter
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
        >
          <X className="w-4 h-4" />
          Clear filters
        </button>
      )}

      <div className="flex items-center gap-2 ml-auto">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className={cn(
              "p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 transition-colors",
              "hover:border-stone-300 dark:hover:border-stone-600",
              isRefreshing && "animate-spin"
            )}
            aria-label="Refresh data"
          >
            <RefreshCw className="w-4 h-4 text-stone-500" />
          </button>
        )}
        {actions}
      </div>
    </div>
  );
}
