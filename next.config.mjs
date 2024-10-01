/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
      ignoreDuringBuilds: true,
    },

    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: process.env.URL_CONFIG,
          pathname: "/storage/v1/**"
        }
      ]
    }
};

export default nextConfig;
