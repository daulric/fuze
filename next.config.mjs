/** @type {import('next').NextConfig} */

import pwa from "next-pwa"

const withPWA = pwa({
  dest: "public",
  reloadOnOnline: true,
  cacheOnFrontEndNav: true,
  disable: process.env.NODE_ENV === "development",
  skipWaiting: true,
});

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '4mb'
    },

    turbo: {
      enabled: true,
    },
  },

  images: {
    unoptimized: process.env.VERCEL && true,
    
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.URL_CONFIG || "example.com",
        pathname: "/storage/v1/**"
      },
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/**"
      }
    ]
  }
};

export default withPWA(nextConfig);