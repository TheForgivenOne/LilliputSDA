import type { LucideIcon } from "lucide-react";

interface WhatToExpectCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function WhatToExpectCard({ icon: Icon, title, description }: WhatToExpectCardProps) {
  return (
    <div className="group bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-amber-200 dark:hover:border-amber-700">
      <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/20 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-7 h-7 text-amber-600 dark:text-amber-400" />
      </div>
      <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">
        {title}
      </h3>
      <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
