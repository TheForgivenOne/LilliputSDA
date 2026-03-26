import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://placehold.co https://images.unsplash.com https://img.youtube.com https://i.ytimg.com https://yt3.ggpht.com https://*.convex.cloud; font-src 'self'; connect-src 'self' https://*.clerk.accounts.dev https://*.convex.cloud https://www.googleapis.com https://api.resend.com wss://*.convex.cloud; frame-src 'self' https://*.clerk.accounts.dev;",
  },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "150.136.61.22"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "yt3.ggpht.com" },
    ],
    dangerouslyAllowSVG: true,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/leadership", destination: "/about#leadership", permanent: true },
      { source: "/services", destination: "/events", permanent: true },
      { source: "/news", destination: "/events", permanent: true },
    ];
  },
};

export default nextConfig;
