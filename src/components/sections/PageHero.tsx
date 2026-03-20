import Image from "next/image";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";

interface PageHeroProps {
  title: string;
  description: string;
  badge?: React.ReactNode;
  backgroundImage?: StaticImport | string;
  theme?: "stone" | "amber" | "gradient";
  children?: React.ReactNode;
}

export function PageHero({
  title,
  description,
  badge,
  backgroundImage,
  theme = "stone",
  children,
}: PageHeroProps) {
  const baseClasses = "relative text-white py-24 lg:py-32";
  const themeClasses = {
    stone: "bg-stone-900",
    amber: "bg-amber-700 dark:bg-amber-800",
    gradient: "bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800 dark:from-amber-900 dark:via-amber-800 dark:to-amber-900",
  };

  return (
    <section className={`${baseClasses} ${themeClasses[theme]}`}>
      {backgroundImage && (
        <div className="absolute inset-0 opacity-30">
          <Image
            src={backgroundImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {badge && (
            <div className="mb-4">
              {badge}
            </div>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {title}
          </h1>
          <p className={`text-xl leading-relaxed ${
            theme === "amber" ? "text-amber-100" : "text-stone-300"
          }`}>
            {description}
          </p>
          {children}
        </div>
      </div>
    </section>
  );
}
