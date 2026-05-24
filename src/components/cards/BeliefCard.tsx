import type { LucideIcon } from "lucide-react";


interface BeliefCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function BeliefCard({ icon: Icon, title, description }: BeliefCardProps) {
  return (
    <div className="p-6 rounded-2xl border border-stone-100 dark:border-stone-700 bg-white dark:bg-stone-800/50">
      <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-amber-700 dark:text-amber-400" />
      </div>
      <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
        {title}
      </h3>
      <p className="text-stone-600 dark:text-stone-300 text-sm">
        {description}
      </p>
    </div>
  );
}

interface BeliefGridProps {
  beliefs: BeliefCardProps[];
  visibleCount?: number;
  onShowMore?: () => void;
}

export function BeliefGrid({ beliefs, visibleCount, onShowMore }: BeliefGridProps) {
  const displayBeliefs = visibleCount !== undefined ? beliefs.slice(0, visibleCount) : beliefs;
  const isShowingAll = visibleCount !== undefined && visibleCount >= beliefs.length;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayBeliefs.map((belief, index) => (
          <BeliefCard key={`${belief.title}-${index}`} {...belief} />
        ))}
      </div>
      {onShowMore && !isShowingAll && visibleCount !== undefined && (
        <p className="text-center mt-6 text-stone-500 dark:text-stone-400 text-sm">
          Showing {visibleCount} of {beliefs.length} — {beliefs.length - visibleCount} more below
        </p>
      )}
      {onShowMore && (
        <div className="text-center mt-4">
          <button
            onClick={onShowMore}
            className="inline-flex items-center gap-2 px-8 py-4 bg-brass text-white rounded-2xl font-semibold shadow-brass transition-all"
          >
            {isShowingAll ? "Show Less" : `Show All ${beliefs.length} Beliefs`}
          </button>
        </div>
      )}
    </div>
  );
}
