import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignore during production build (disable after full typing)
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  }
}

export default nextConfig;
