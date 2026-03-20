import { ChevronDown, ChevronUp } from "lucide-react";

interface TimelineMilestone {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  milestones: TimelineMilestone[];
  visibleCount?: number;
  onShowMore?: () => void;
  showMoreText?: string;
  showLessText?: string;
}

export function Timeline({
  milestones,
  visibleCount,
  onShowMore,
  showMoreText = "Show All",
  showLessText = "Show Less",
}: TimelineProps) {
  const displayMilestones = visibleCount !== undefined ? milestones.slice(0, visibleCount) : milestones;
  const showingAll = visibleCount !== undefined && visibleCount >= milestones.length;

  return (
    <section className="py-16 lg:py-24 bg-stone-100 dark:bg-stone-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
            Key Milestones
          </h2>
          <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
            A journey of faith spanning five decades of ministry and service.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-amber-200 dark:bg-amber-900/50" />
          
          <div className="space-y-12">
            {displayMilestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className={`relative flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <div className="bg-white dark:bg-stone-800 p-6 rounded-xl shadow-md">
                    <span className="text-3xl font-bold text-amber-700 dark:text-amber-400">
                      {milestone.year}
                    </span>
                    <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mt-2 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-stone-600 dark:text-stone-300">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                <div className="hidden md:flex items-center justify-center w-12 h-12 bg-amber-700 rounded-full border-4 border-stone-100 dark:border-stone-800 z-10 flex-shrink-0">
                  <span className="text-white font-bold text-sm">
                    {milestone.year.slice(-2)}
                  </span>
                </div>

                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>

        {onShowMore && (
          <div className="text-center mt-8">
            <button
              onClick={onShowMore}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-full font-medium transition-colors"
            >
              {showingAll ? (
                <>
                  {showLessText}
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  {showMoreText}
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
