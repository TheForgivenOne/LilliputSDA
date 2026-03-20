interface MissionVisionCardProps {
  title: string;
  content: string;
  variant?: "amber" | "stone";
}

export function MissionVisionCard({ title, content, variant = "amber" }: MissionVisionCardProps) {
  const variantClasses = {
    amber: "bg-amber-700 dark:bg-amber-800 text-white",
    stone: "bg-stone-800 dark:bg-stone-900 text-white",
  };

  return (
    <div className={`${variantClasses[variant]} p-8 lg:p-12 rounded-2xl`}>
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      <p className={`text-lg leading-relaxed ${variant === "amber" ? "text-amber-100" : "text-stone-300"}`}>
        {content}
      </p>
    </div>
  );
}

interface MissionVisionProps {
  mission: { title: string; content: string };
  vision: { title: string; content: string };
}

export function MissionVision({ mission, vision }: MissionVisionProps) {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <MissionVisionCard title={mission.title} content={mission.content} variant="amber" />
          <MissionVisionCard title={vision.title} content={vision.content} variant="stone" />
        </div>
      </div>
    </section>
  );
}
