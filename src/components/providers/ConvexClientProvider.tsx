'use client'

import { ReactNode, useEffect, useState } from 'react'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { useAuth } from '@clerk/nextjs'

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [convexClient, setConvexClient] = useState<ConvexReactClient | null>(null)
  
  useEffect(() => {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
    if (convexUrl) {
      setConvexClient(new ConvexReactClient(convexUrl))
    }
  }, [])
  
  if (!convexClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-stone-800 mb-2">Site Under Construction</h2>
          <p className="text-stone-600">Our website is being updated. Please check back soon!</p>
        </div>
      </div>
    )
  }

  return (
    <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  )
}
