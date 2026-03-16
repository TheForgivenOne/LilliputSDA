'use client'

import { Search, Loader2 } from "lucide-react";
import { useState } from "react";

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

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setSearched(true);
    
    try {
      const response = await fetch(`/api/scripture?q=${encodeURIComponent(query)}&limit=3`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
      
      {/* Default scripture */}
      {!searched && (
        <blockquote className="text-lg text-stone-700 dark:text-stone-300 italic leading-relaxed mb-3">
          "For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do."
        </blockquote>
      )}
      
      {/* Search results */}
      {results.length > 0 && (
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
      
      {searched && results.length === 0 && !loading && (
        <p className="text-sm text-stone-500 dark:text-stone-400 italic mb-4">
          No verses found for "{query}"
        </p>
      )}
      
      <cite className="text-sm text-amber-700 dark:text-amber-400 not-italic block mb-5">
        {!searched && "— Ephesians 2:10 (NIV)"}
      </cite>
      
      {/* Scripture Search */}
      <div className="pt-5 border-t border-amber-200 dark:border-amber-800/50">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search scripture..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-stone-800 border border-amber-300 dark:border-amber-700 rounded-lg text-stone-700 dark:text-stone-300 placeholder-stone-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 bg-amber-700 dark:bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-800 dark:hover:bg-amber-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
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
          Try: "build", "work", "faith", or a book name like "Psalms"
        </p>
      </div>
    </div>
  );
}