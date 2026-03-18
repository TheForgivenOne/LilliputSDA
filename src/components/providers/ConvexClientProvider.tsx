'use client'

import { ReactNode } from 'react'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { useAuth } from '@clerk/nextjs'

// Get convex URL from env or use a safe default
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || ''

// Only create client if URL is available
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convex) {
    // If Convex is not configured, render children without Convex provider
    console.warn('ConvexClientProvider: NEXT_PUBLIC_CONVEX_URL not configured')
    return <>{children}</>
  }

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  )
}
