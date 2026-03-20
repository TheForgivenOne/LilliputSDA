interface TestimonialCardProps {
  name: string;
  role: string;
  memberSince?: string;
  content: string;
}

export function TestimonialCard({ name, role, memberSince, content }: TestimonialCardProps) {
  const initial = name.split(" ").pop()?.charAt(0) || name.charAt(0);
  
  return (
    <div className="bg-white dark:bg-stone-800 rounded-xl p-6 shadow-sm border-l-4 border-amber-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <span className="text-amber-700 dark:text-amber-400 font-bold text-lg">{initial}</span>
        </div>
        <div>
          <p className="font-semibold text-stone-900 dark:text-stone-100">{name}</p>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {memberSince ? `Member since ${memberSince}` : role}
          </p>
        </div>
      </div>
      <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
        {content}
      </p>
    </div>
  );
}
