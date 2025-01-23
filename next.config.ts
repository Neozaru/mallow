import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignore during production build (disable after full typing)
    ignoreDuringBuilds: true,
  },
}

export default nextConfig;
