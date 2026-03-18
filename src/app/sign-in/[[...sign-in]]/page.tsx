'use client'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        {/* Construction notice */}
        <div className="mb-8 p-6 bg-amber-100 dark:bg-amber-900/30 rounded-xl border border-amber-200 dark:border-amber-800/50">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-600 dark:bg-amber-400"></span>
            </span>
            <span className="text-sm font-semibold text-amber-800 dark:text-amber-200 tracking-wide">
              UNDER CONSTRUCTION
            </span>
          </div>
          <p className="text-amber-700 dark:text-amber-300 text-sm">
            Authentication is currently disabled while we build the new site.
          </p>
        </div>
        
        {/* Alternative contact */}
        <div className="bg-stone-100 dark:bg-stone-800/50 rounded-xl p-6">
          <p className="text-stone-600 dark:text-stone-300 mb-4">
            Need to access your account? Contact us directly:
          </p>
          <a 
            href="mailto:info@lilliputsda.org" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-700 dark:bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-800 dark:hover:bg-amber-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Us
          </a>
        </div>
      </div>
    </div>
  )
}
