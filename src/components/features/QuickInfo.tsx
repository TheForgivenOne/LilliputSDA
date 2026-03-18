"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickInfoProps {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
  iconClassName?: string;
}

export function QuickInfo({
  icon: Icon,
  label,
  value,
  className,
  iconClassName,
}: QuickInfoProps) {
  return (
    <div className={cn("flex items-center gap-4 group", className)}>
      <div
        className={cn(
          "p-3 bg-amber-500/20 rounded-xl transition-transform group-hover:scale-110",
          iconClassName
        )}
      >
        <Icon className="w-6 h-6 text-amber-400" />
      </div>
      <div>
        <p className="text-stone-400 text-sm font-medium">{label}</p>
        <p className="text-white font-semibold text-base">{value}</p>
      </div>
    </div>
  );
}
