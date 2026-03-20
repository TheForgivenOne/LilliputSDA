import type { LucideIcon } from "lucide-react";

interface Category {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface CategoryFilterProps {
  categories: Category[];
  selected: string;
  onSelect: (id: string) => void;
  variant?: "tabs" | "pills";
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
  variant = "pills",
}: CategoryFilterProps) {
  if (variant === "tabs") {
    return (
      <div className="flex items-center gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`px-6 py-4 font-medium transition-colors border-b-4 ${
              selected === category.id
                ? "border-amber-700 text-amber-700 dark:text-amber-400"
                : "border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-2">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors shadow-sm whitespace-nowrap ${
              selected === category.id
                ? "bg-amber-700 text-white"
                : "bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-700 dark:hover:text-amber-400"
            }`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
