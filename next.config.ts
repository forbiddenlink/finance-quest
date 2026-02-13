import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Enable module/component level code splitting
  webpack: (config, { dev, isServer }) => {
    // Only optimize in production
    if (!dev && !isServer) {
      // Enable granular chunks
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 100000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          // Vendor chunk for third-party libraries
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name(module: any) {
              // Get the package name
              const match = module.context?.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              );

              if (!match || !match[1]) {
                return 'vendor.misc';
              }

              // Return a chunk name based on package name
              return `vendor.${match[1].replace('@', '')}`;
            },
            priority: 10,
            reuseExistingChunk: true,
          },
          // Common chunk for shared code
          common: {
            minChunks: 2,
            priority: -10,
            reuseExistingChunk: true,
          },
          // Calculator chunk for calculator components
          calculators: {
            test: /[\\/]components[\\/].*[\\/]calculators[\\/]/,
            name: 'calculators',
            minChunks: 1,
            priority: 5,
            reuseExistingChunk: true,
          },
          // Chapter chunk for chapter components
          chapters: {
            test: /[\\/]components[\\/]chapters[\\/]/,
            name: 'chapters',
            minChunks: 1,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };

      // Enable module concatenation
      config.optimization.concatenateModules = true;

      // Enable tree shaking
      config.optimization.usedExports = true;
    }

    return config;
  },

  // Enable image optimization
  images: {
    domains: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable experimental features
  experimental: {
    // Server actions are now stable in Next.js 15
  },

  // Configure headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.openai.com https://*.vercel.app;"
          }
        ],
      },
    ];
  },

  // Configure redirects for optimized routing
  async redirects() {
    return [];
  },

  // Configure performance monitoring
  productionBrowserSourceMaps: true,
};

export default nextConfig;