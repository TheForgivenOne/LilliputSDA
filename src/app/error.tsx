"use client";

import Link from "next/link";
import { Home, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <span className="text-8xl font-bold text-red-600 dark:text-red-500 font-playfair">
            500
          </span>
        </div>

        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
          Something Went Wrong
        </h1>

        <p className="text-stone-600 dark:text-stone-400 mb-8">
          We apologize for the inconvenience. An unexpected error occurred while loading this page.
          {error.digest && (
            <span className="block mt-2 text-sm text-stone-500 dark:text-stone-500 font-mono">
              Error ID: {error.digest}
            </span>
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 rounded-xl bg-amber-600 text-white hover:bg-amber-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 px-8 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 rounded-xl border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:border-amber-500 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 px-8 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
