import type { LucideIcon } from "lucide-react";

interface InfoItemProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function InfoItem({ icon: Icon, title, children, className = "" }: InfoItemProps) {
  return (
    <div className={`flex items-start gap-4 ${className}`}>
      <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
      </div>
      <div>
        <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-1">{title}</h3>
        <div className="text-stone-600 dark:text-stone-400">
          {children}
        </div>
      </div>
    </div>
  );
}
