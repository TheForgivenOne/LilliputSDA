"use client";



interface TestimonialCardProps {
  name: string;
  role: string;
  memberSince?: string;
  content: string;
}

export function TestimonialCard({ name, role, memberSince, content }: TestimonialCardProps) {
  const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("");
  
  return (
    <div className="group relative bg-white dark:bg-stone-800 rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 border border-stone-100 dark:border-stone-700 hover:border-amber-200 dark:hover:border-amber-800">
      <div className="absolute top-6 right-6 text-6xl font-[family-name:var(--font-playfair)] text-amber-500/10 select-none">
        &ldquo;
      </div>
      
      <div className="relative">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg font-[family-name:var(--font-playfair)] shadow-lg shadow-amber-500/25">
            {initials}
          </div>
          <div>
            <p className="font-bold text-stone-900 dark:text-stone-100 font-[family-name:var(--font-playfair)]">{name}</p>
            <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
              {memberSince ? `Member since ${memberSince}` : role}
            </p>
          </div>
        </div>
        <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-base relative z-10 italic">
          &ldquo;{content}&rdquo;
        </p>
      </div>
    </div>
  );
}
