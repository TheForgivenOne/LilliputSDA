import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const isPublicRoute = (pathname: string) => {
  const publicRoutes = [
    '/',
    '/about',
    '/leadership',
    '/ministries',
    '/services',
    '/media',
    '/events',
    '/news',
    '/contact',
    '/api/',
    '/visit',
    '/decision',
  ]
  
  return publicRoutes.some(route => pathname === route || pathname.startsWith(route))
}

export default function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};