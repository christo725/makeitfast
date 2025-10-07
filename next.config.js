/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  // Fix for nested project structure - tells Next.js to only look in this directory
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    // Optimize for faster rebuilds
    optimizePackageImports: ['lucide-react'],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      stream: false,
      constants: false,
      crypto: false,
    };
    return config;
  },
}

module.exports = nextConfig