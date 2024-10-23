/** @type {import('next').NextConfig} */

import pwa from "next-pwa"

const withPWA = pwa({
  dest: "public",
  reloadOnOnline: true,
  cacheOnFrontEndNav: true,
  disable: false,
  skipWaiting: true,
})

const nextConfig = {
  eslint: {
      ignoreDuringBuilds: true,
    },

    env: {
      
    },

    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: process.env.URL_CONFIG ? process.env.URL_CONFIG : "example.com", // For jest tests
          pathname: "/storage/v1/**"
        }
      ]
    }
};

export default withPWA(nextConfig);