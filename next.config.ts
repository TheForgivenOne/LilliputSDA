import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "yt3.ggpht.com",
      },
    ],
    dangerouslyAllowSVG: true,
  },
  async redirects() {
    return [
      {
        source: "/leadership",
        destination: "/about#leadership",
        permanent: true,
      },
      {
        source: "/services",
        destination: "/events",
        permanent: true,
      },
      {
        source: "/news",
        destination: "/events",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
