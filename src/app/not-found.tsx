"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <span className="text-8xl font-bold text-amber-600 dark:text-amber-500 font-playfair">
            404
          </span>
        </div>

        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
          Page Not Found
        </h1>

        <p className="text-stone-600 dark:text-stone-400 mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or no longer exists.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 rounded-xl bg-amber-600 text-white hover:bg-amber-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 px-8 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 rounded-xl border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:border-amber-500 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 px-8 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
