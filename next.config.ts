import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignore during production build (disable after full typing)
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

export default nextConfig;
