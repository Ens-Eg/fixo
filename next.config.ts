import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

// Bundle analyzer (only enabled when ANALYZE=true)
const withBundleAnalyzer = process.env.ANALYZE === "true"
  ? require("@next/bundle-analyzer")({ enabled: true })
  : (config: NextConfig) => config;

const nextConfig: NextConfig = {
  // Enable standalone output for Docker production builds
  output: 'standalone',
  
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },

  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },

  // Disable telemetry in production
  productionBrowserSourceMaps: false,

  // Enable experimental features for better subdomain support
  experimental: {
    // serverActions: true,
  },

  // Allow multiple domains/subdomains
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(withBundleAnalyzer(nextConfig));
