'use client'

import { Church, Cross, Heart, Users } from "lucide-react";
import ScriptureSearch from "@/components/ScriptureSearch";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans dark:bg-stone-900 overflow-hidden bg-pattern">
      {/* Warm decorative backdrop with intentional gradient */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-br from-amber-200/40 to-orange-100/20 dark:from-amber-800/20 dark:to-orange-900/10 rounded-full blur-3xl gradient-animate" />
      
      {/* Subtle pattern overlay for texture */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />

      <div className="relative z-10 flex min-h-screen items-center justify-between px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24">
        {/* Left side - Decorative church icons with better hierarchy */}
        <div className="hidden lg:flex flex-col gap-8 opacity-60 dark:opacity-50">
          <div className="flex items-center gap-3 group cursor-default">
            <Cross className="w-10 h-10 text-stone-600 dark:text-stone-400 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors duration-300" />
            <span className="text-xs text-stone-500 dark:text-stone-500 tracking-wider group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors duration-300">
              COMMUNITY
            </span>
          </div>
          <div className="flex items-center gap-3 ml-8 group cursor-default">
            <Church className="w-12 h-12 text-amber-700 dark:text-amber-400 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors duration-300" />
            <span className="text-xs text-stone-500 dark:text-stone-500 tracking-wider group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors duration-300">
              GATHERING
            </span>
          </div>
          <div className="flex items-center gap-3 ml-4 group cursor-default">
            <Heart className="w-8 h-8 text-red-700 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors duration-300" />
            <span className="text-xs text-stone-500 dark:text-stone-500 tracking-wider group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors duration-300">
              FAITH
            </span>
          </div>
        </div>

        {/* Center - Main content */}
        <main className="flex-1 max-w-2xl text-center lg:text-left lg:ml-8 py-8">
          {/* Status badge with better hierarchy */}
          <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-10 border border-amber-200 dark:border-amber-800/50">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-600 dark:bg-amber-400"></span>
            </span>
            <span className="text-sm text-amber-800 dark:text-amber-200 font-medium tracking-wide">
              UNDER CONSTRUCTION
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
              Growing together in faith,<br />
              <span className="text-amber-700 dark:text-amber-400">building something new.</span>
            </h1>
          </div>

          <p className="text-lg text-stone-600 dark:text-stone-300 leading-relaxed mb-10 max-w-prose mx-auto lg:mx-0">
            We're creating a new online home for our church family. This space is still 
            being built, but we're excited to welcome you when it's ready.
          </p>
          
          <p className="text-sm text-stone-500 dark:text-stone-500 italic mb-8">
            "For where two or three gather in my name, there am I with them." 
            <br />— Matthew 18:20
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
            <a
              href="#"
              className="group px-8 py-4 bg-amber-700 dark:bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-800 dark:hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 text-base relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              <span className="w-2 h-2 bg-white/90 rounded-full" />
              Notify Me When Ready
            </a>
            <a
              href="mailto:info@lilliputsda.org"
              className="group px-8 py-4 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 font-medium transition-all duration-300 flex items-center gap-3 justify-center lg:justify-start border-2 border-stone-300 dark:border-stone-600 rounded-xl hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-base relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              <Users className="w-5 h-5" />
              Email Us Directly
            </a>
          </div>

          <div className="max-w-prose mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800/50 px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 bg-stone-400 dark:bg-stone-500 rounded-full"></span>
              <span>Response time: 1-2 business days</span>
            </div>
          </div>

          {/* Scripture Section */}
          <ScriptureSearch />
        </main>
      </div>
    </div>
  );
}
