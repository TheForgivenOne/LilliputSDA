import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.NEXT_BUNDLE_ANALYZE === 'true',
});

const securityHeaders = [
  { key: "Access-Control-Allow-Origin", value: "https://lilliputsda.vercel.app" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
      value:
        "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.youtube.com https://www.google.com https://maps.googleapis.com https://*.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.googleapis.com https://maps.googleapis.com; frame-src 'self' https://www.youtube.com https://youtube.com https://*.youtube.com https://www.google.com https://*.google.com https://player.vimeo.com; worker-src 'self' blob:;",
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
      { protocol: "https",       hostname: "maps.googleapis.com" },
      { protocol: "https", hostname: "www.google.com" },
      { protocol: "https", hostname: "*.gstatic.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
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

export default withBundleAnalyzer(nextConfig);
