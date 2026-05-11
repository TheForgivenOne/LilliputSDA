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
  "/api/testimonials",
  "/api/site-content",
  "/visit",
  "/decision",
  "/favicons",
  "/images",
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

  // Debug logging
  console.debug("[Middleware]", pathname);

  if (isProtectedRoute(pathname)) {
    console.debug("[Middleware] Protected route, checking auth...");
    const session = await auth();
    console.debug("[Middleware] Session:", session?.user ? "exists" : "none");

    if (!session?.user) {
      console.debug("[Middleware] No session, redirecting to sign-in");
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    console.debug("[Middleware] Session found, allowing access");
    return NextResponse.next();
  }

  if (!isPublicRoute(pathname)) {
    if (pathname !== "/") {
      console.debug("[Middleware] Not public, redirecting to home");
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public|images|fonts|favicons).*)",
  ],
};