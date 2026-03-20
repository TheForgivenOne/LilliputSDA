import type { LucideIcon } from "lucide-react";

interface ContactInfoCardProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}

export function ContactInfoCard({ icon: Icon, title, children }: ContactInfoCardProps) {
  return (
    <div className="bg-white dark:bg-stone-800 p-6 rounded-xl shadow-lg">
      <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-amber-700 dark:text-amber-400" />
      </div>
      <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-2">
        {title}
      </h3>
      <div className="text-stone-600 dark:text-stone-400 text-sm">
        {children}
      </div>
    </div>
  );
}
