import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add this block to ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;