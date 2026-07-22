'use client'

import { Search, Loader2, AlertCircle } from "lucide-react";
import { useState, useCallback, useEffect } from "react";

interface ScriptureResult {
  reference: string;
  text: string;
  book: string;
  chapter: number;
  verse: number;
}

export default function ScriptureSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ScriptureResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (searchQuery?: string) => {
    const q = searchQuery ?? query;
    if (!q.trim()) return;
    
    setLoading(true);
    setSearched(true);
    setError(null);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
      const response = await fetch(`/api/scripture?q=${encodeURIComponent(q)}&limit=3`, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.status === 404) {
        setResults([]);
        return;
      }
      
      if (response.status === 429) {
        throw new Error("Too many requests. Please wait a moment and try again.");
      }
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setResults(data.results || []);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError("Request timed out. Please try again.");
      } else {
        console.error("Search error:", err);
        setError(err instanceof Error ? err.message : "Failed to search scriptures");
      }
      setResults([]);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        handleSearch(query);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, handleSearch]);

  return (
    <div className="mt-12 p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800/50 max-w-prose mx-auto lg:mx-0">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-amber-700 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">
          Scripture Search
        </span>
      </div>
      
      {/* Error State */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2" role="alert">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
            <button
              onClick={() => handleSearch()}
              className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}
      
      {/* Loading State */}
      {loading && (
        <div className="space-y-3 mb-4">
          <div className="p-3 bg-white dark:bg-stone-800/50 rounded-lg animate-pulse">
            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-full"></div>
            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-2/3 mt-2"></div>
          </div>
        </div>
      )}
      
      {/* Default scripture */}
      {!searched && !loading && !error && (
        <blockquote className="text-lg text-stone-700 dark:text-stone-300 italic leading-relaxed mb-3">
          &quot;For we are God&apos;s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.&quot;
        </blockquote>
      )}
      
      {/* Search results */}
      {!loading && results.length > 0 && (
        <div className="space-y-3 mb-4">
          {results.map((result, index) => (
            <div key={index} className="p-3 bg-white dark:bg-stone-800/50 rounded-lg">
              <p className="text-sm text-amber-700 dark:text-amber-400 font-medium mb-1">
                {result.reference} (NIV)
              </p>
              <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed">
                {result.text}
              </p>
            </div>
          ))}
        </div>
      )}
      
      {/* No results */}
      {searched && results.length === 0 && !loading && !error && (
        <p className="text-sm text-stone-500 dark:text-stone-400 italic mb-4">
          No verses found for &quot;{query}&quot;
        </p>
      )}
      
      <cite className="text-sm text-amber-700 dark:text-amber-400 not-italic block mb-5">
        {!searched && "— Ephesians 2:10 (NIV)"}
      </cite>
      
      {/* Scripture Search */}
      <div className="pt-5 border-t border-amber-200 dark:border-amber-800/50">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!e.target.value.trim()) {
                  setSearched(false);
                  setResults([]);
                  setError(null);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Buscar escritura..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-stone-800 border border-amber-300 dark:border-amber-700 rounded-lg text-stone-700 dark:text-stone-300 placeholder-stone-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm truncate"
              aria-label="Search scriptures"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="px-4 py-2 bg-amber-700 dark:bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-800 dark:hover:bg-amber-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Search
          </button>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-500 mt-2">
          Try: &quot;build&quot;, &quot;work&quot;, &quot;faith&quot;, or a book name like &quot;Psalms&quot;
        </p>
      </div>
    </div>
  );
}
