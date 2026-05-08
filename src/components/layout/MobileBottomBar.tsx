"use client";

import { Mail, MapPin, Heart } from "lucide-react";
import Link from "next/link";

export function MobileBottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 shadow-lg md:hidden">
      <div className="grid grid-cols-3 h-16">
        <a
          href="https://maps.google.com/?q=Lilliput+SDA+Church+Montego+Bay+Jamaica"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
        >
          <MapPin className="w-5 h-5" />
          <span className="text-xs font-medium">Directions</span>
        </a>

        <a
          href="mailto:lhamilton@westjamaica.org"
          className="flex flex-col items-center justify-center gap-1 text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
        >
          <Mail className="w-5 h-5" />
          <span className="text-xs font-medium">Email</span>
        </a>

        <Link
          href="/contact#prayer"
          className="flex flex-col items-center justify-center gap-1 text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
        >
          <Heart className="w-5 h-5" />
          <span className="text-xs font-medium">Prayer</span>
        </Link>
      </div>
    </div>
  );
}
