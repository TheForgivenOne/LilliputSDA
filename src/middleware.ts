import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

const publicPaths = [
  "/",
  "/about",
  "/leadership",
  "/ministries",
  "/services",
  "/media",
  "/events",
  "/news",
  "/contact",
  "/sign-in",
  "/sign-up",
  "/api/scripture",
  "/api/youtube/videos",
  "/api/email",
  "/api/announcements",
  "/api/events",
  "/api/ministries",
  "/api/staff",
  "/api/contact",
  "/api/prayers",
  "/api/auth",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/session",
  "/api/auth/callback",
  "/visit",
  "/decision",
];

const protectedPaths = [
  "/dashboard",
  "/admin",
];

function isPublicRoute(pathname: string): boolean {
  return publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
}

function isProtectedRoute(pathname: string): boolean {
  return protectedPaths.some((path) => pathname.startsWith(path));
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isProtectedRoute(pathname)) {
    const session = await auth();
    if (!session?.user) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Check if user has admin role
    if (session.user.role !== "admin") {
      // If unauthorized for admin routes, redirect to home
      // Only redirect if not already at home to avoid potential loops
      if (pathname !== "/") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return NextResponse.next();
  }

  if (!isPublicRoute(pathname)) {
    if (pathname !== "/") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};