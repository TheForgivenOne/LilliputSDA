'use client'

import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center p-8">
      <SignUp
        appearance={{
          baseTheme: undefined,
          variables: {
            colorPrimary: '#b45309', // amber-700
            colorBackground: '#fafaf9', // stone-50
            colorText: '#1c1917', // stone-900
          },
          elements: {
            rootBox: 'shadow-xl rounded-2xl p-8 bg-white dark:bg-stone-800 w-full max-w-md',
            card: 'bg-transparent',
            headerTitle: 'text-2xl font-bold text-stone-900 dark:text-stone-100 text-center mb-2',
            headerSubtitle: 'text-stone-600 dark:text-stone-400 text-center mb-6',
            formButtonPrimary: 'bg-amber-700 hover:bg-amber-800 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm',
            formButtonSecondary: 'border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700',
            formFieldInput: 'w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg bg-stone-50 dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-600 focus:border-transparent',
            formFieldLabel: 'text-sm font-medium text-stone-700 dark:text-stone-300',
            dividerRow: 'my-4',
            dividerLine: 'bg-stone-300 dark:bg-stone-600',
            dividerText: 'text-stone-500 dark:text-stone-400',
            socialButtonsBlockButton: 'w-full py-3 border border-stone-300 dark:border-stone-600 rounded-lg text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 flex items-center justify-center gap-3',
            footerActionLink: 'text-amber-700 dark:text-amber-500 hover:underline',
            footerActionText: 'text-stone-600 dark:text-stone-400',
          },
        }}
      />
    </div>
  )
}
