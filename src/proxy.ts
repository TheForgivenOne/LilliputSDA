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

    // Auth check
    if (!session?.user) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Role-Based Access Control (RBAC)
    // Only 'admin' role can access /admin routes
    if (pathname.startsWith("/admin") && session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  if (!isPublicRoute(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};