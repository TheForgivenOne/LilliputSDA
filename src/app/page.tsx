import { Church, Cross, Heart, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans dark:bg-stone-900 overflow-hidden">
      {/* Warm decorative backdrop */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-200/30 dark:bg-amber-800/20 rounded-full blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-between px-8 md:px-16 lg:px-24">
        {/* Left side - Decorative church icons */}
        <div className="hidden lg:flex flex-col gap-6 opacity-50 dark:opacity-40">
          <Cross className="w-14 h-14 text-stone-600 dark:text-stone-400" />
          <Church className="w-16 h-16 text-amber-700 dark:text-amber-400 ml-4" />
          <Heart className="w-12 h-12 text-red-700 dark:text-red-400 ml-2" />
        </div>

        {/* Center - Main content */}
        <main className="flex-1 max-w-2xl text-center lg:text-left lg:ml-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-8">
            <span className="w-2 h-2 bg-amber-600 dark:bg-amber-400 rounded-full animate-pulse" />
            <span className="text-sm text-amber-800 dark:text-amber-200 font-medium">
              Our new home is being prepared
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-tight mb-6">
            Growing together in faith,
            <br />
            building something new.
          </h1>

          <p className="text-lg text-stone-600 dark:text-stone-300 leading-relaxed mb-8 max-w-prose mx-auto lg:mx-0">
            We're preparing a new online space where our community can connect, grow, 
            and worship together. Stay tuned for our grand opening—your presence is what makes 
            this house a home.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a
              href="#"
              className="px-6 py-3 bg-amber-700 dark:bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-800 dark:hover:bg-amber-700 transition-colors duration-200 shadow-sm"
            >
              Join Our Mailing List
            </a>
            <a
              href="#"
              className="px-6 py-3 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 font-medium transition-colors duration-200 flex items-center gap-2 justify-center lg:justify-start"
            >
              <Users className="w-4 h-4" />
              Meet Our Community
            </a>
          </div>

          <p className="mt-8 text-sm text-stone-500 dark:text-stone-500">
            "For where two or three gather in my name, there am I with them."
            <br />
            <span className="text-stone-400 dark:text-stone-500">— Matthew 18:20</span>
          </p>
        </main>
      </div>
    </div>
  );
}
