interface Stat {
  number: string;
  label: string;
}

interface PageStatsProps {
  stats: Stat[];
}

export function PageStats({ stats }: PageStatsProps) {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-amber-700 dark:text-amber-400 mb-2">
                {stat.number}
              </div>
              <div className="text-stone-600 dark:text-stone-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
