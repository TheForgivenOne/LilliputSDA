'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { Show, UserButton } from '@clerk/nextjs'

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="md:hidden p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu panel */}
          <div className="absolute right-0 top-0 h-full w-64 bg-stone-50 dark:bg-stone-900 shadow-xl p-6 animate-slide-in">
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-semibold text-stone-800 dark:text-stone-100">
                Menu
              </span>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex flex-col gap-4">
              {/* Navigation links will be added when pages/sections exist */}
            </nav>
            
            <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-700">
              <p className="text-sm text-stone-500 dark:text-stone-400 text-center mb-4">
                🚧 Site under construction
              </p>
              <Show when="signed-out">
                <Link
                  href="/sign-in"
                  className="block w-full text-center px-4 py-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 font-medium transition-colors mb-2"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="block w-full text-center px-4 py-2 bg-amber-700 dark:bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-800 dark:hover:bg-amber-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Join Us
                </Link>
              </Show>
              <Show when="signed-in">
                <div className="flex justify-center">
                  <UserButton />
                </div>
              </Show>
            </div>
          </div>
        </div>
      )}
      

    </>
  )
}