"use client";

import type { LucideIcon } from "lucide-react";

interface WhatToExpectCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function WhatToExpectCard({ icon: Icon, title, description }: WhatToExpectCardProps) {
  return (
    <div className="group relative bg-white dark:bg-stone-800 p-6 lg:p-7 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 border border-stone-100 dark:border-stone-700 hover:border-amber-200 dark:hover:border-amber-800 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">
        <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 group-hover:scale-110 transition-all duration-300">
          <Icon className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-3 font-[family-name:var(--font-playfair)] group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
