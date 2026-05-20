import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.ortobom.com.br' },
      { protocol: 'https', hostname: 'www.ortobom.com.br' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
};

export default nextConfig;

