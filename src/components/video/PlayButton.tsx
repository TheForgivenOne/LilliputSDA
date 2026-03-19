"use client";

import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayButtonProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

export function PlayButton({ size = "md", className, onClick }: PlayButtonProps) {
  const sizes = {
    sm: "w-14 h-14",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-7 h-7",
    lg: "w-8 h-8",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group rounded-full bg-amber-600 flex items-center justify-center",
        "group-hover:bg-amber-500 transition-colors shadow-lg",
        sizes[size],
        className
      )}
    >
      <Play className={cn("text-white ml-1", iconSizes[size])} />
    </button>
  );
}
