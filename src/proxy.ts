import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',           // Home page
  '/about',      // About page (public)
  '/leadership', // Leadership page (public)
  '/ministries', // Ministries page (public)
  '/services',   // Services page (public)
  '/media',      // Media page (public)
  '/events',     // Events page (public)
  '/news',       // News page (public)
  '/contact',    // Contact page (public)
  '/api/scripture', // Scripture API
  '/api/youtube/videos', // YouTube API (public)
  '/api/email', // Email API (public - called from contact/prayer forms)
  '/visit',      // Plan Your Visit page (public)
  '/decision', // Decision Card page (public)
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
