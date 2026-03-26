import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
  "/api/scripture",
  "/api/youtube/videos",
  "/api/email",
  "/visit",
  "/decision",
];

const adminPaths = ["/dashboard", "/admin"];

function isPublicRoute(pathname: string): boolean {
  return publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
}

function isAdminRoute(pathname: string): boolean {
  return adminPaths.some(
    (path) => pathname.startsWith(path)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAdminRoute(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
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
