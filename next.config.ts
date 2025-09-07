import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only use standalone output in production
  ...(process.env.NODE_ENV === 'production' && {
    output: 'standalone',
    serverExternalPackages: ['@prisma/client'],
  }),
  
  // Turbopack configuration (stable in Next.js 15)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  images: {
    domains: ['localhost'],
  },
  
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Ensure proper build manifest generation
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
};

export default nextConfig;
