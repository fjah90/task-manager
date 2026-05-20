import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    // Used in local dev (pnpm dev) where there's no nginx.
    // In Docker, nginx handles /api/* routing directly to the api service.
    const apiDest =
      process.env.API_INTERNAL_URL ?? 'http://localhost:4000/api';
    return [
      {
        source: '/api/:path*',
        destination: `${apiDest}/:path*`,
      },
    ];
  },
};

export default nextConfig;
