/** @type {import('next').NextConfig} */
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

export default nextConfig;
