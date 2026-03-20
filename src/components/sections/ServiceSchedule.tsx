import { Calendar } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

interface ScheduleItem {
  time: string;
  title: string;
  description: string;
  icon: LucideIcon;
  highlight?: boolean;
}

interface ServiceScheduleProps {
  items: ScheduleItem[];
  activeIndex?: number;
  onActiveChange?: (index: number) => void;
}

export function ServiceSchedule({
  items,
  activeIndex: controlledIndex,
  onActiveChange,
}: ServiceScheduleProps) {
  const [internalIndex, setInternalIndex] = useState(controlledIndex ?? 1);
  const activeIndex = controlledIndex ?? internalIndex;
  
  const handleSelect = (index: number) => {
    if (onActiveChange) {
      onActiveChange(index);
    } else {
      setInternalIndex(index);
    }
  };

  return (
    <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 md:p-8 border-b border-stone-100 dark:border-stone-700">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
              Sabbath Service Schedule
            </h2>
            <p className="text-stone-500 dark:text-stone-400">Every Saturday</p>
          </div>
        </div>
      </div>

      {/* Desktop Timeline */}
      <div className="hidden md:grid md:grid-cols-4 divide-x divide-stone-100 dark:divide-stone-700">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={`relative p-6 text-left transition-all duration-300 hover:bg-stone-50 dark:hover:bg-stone-700/50 ${
                isActive ? "bg-amber-50 dark:bg-amber-900/20" : ""
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
              )}
              <div className={`text-2xl font-bold mb-1 ${isActive ? "text-amber-600 dark:text-amber-400" : "text-stone-900 dark:text-stone-100"}`}>
                {item.time}
              </div>
              <div className="font-semibold text-stone-800 dark:text-stone-200 mb-1">
                {item.title}
              </div>
              <div className="text-sm text-stone-500 dark:text-stone-400">
                {item.description}
              </div>
              <div className={`mt-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isActive ? "bg-amber-500 text-white" : "bg-stone-100 dark:bg-stone-700 text-stone-400"}`}>
                <Icon className="w-5 h-5" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden p-4">
        <div className="space-y-3">
          {items.map((item, index) => {
            const Icon = item.icon;
            const isActive = index === activeIndex;
            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                    : "bg-stone-50 dark:bg-stone-700 text-stone-700 dark:text-stone-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-xl font-bold mb-1 ${isActive ? "text-white" : "text-amber-600 dark:text-amber-400"}`}>
                      {item.time}
                    </div>
                    <div className={`font-semibold ${isActive ? "text-white" : "text-stone-800 dark:text-stone-200"}`}>
                      {item.title}
                    </div>
                    <div className={`text-sm ${isActive ? "text-amber-100" : "text-stone-500 dark:text-stone-400"}`}>
                      {item.description}
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? "bg-white/20" : "bg-amber-100 dark:bg-amber-900/30"}`}>
                    <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-amber-600 dark:text-amber-400"}`} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
