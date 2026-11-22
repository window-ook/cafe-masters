import { NextConfig } from 'next';
import withPWA from 'next-pwa';

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  turbopack: {},
  reactCompiler: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 100],
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'postfiles.pstatic.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'blogfiles.pstatic.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vsemazasjbizehcambul.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  compress: true,
  webpack: (
    config,
    { isServer }: { isServer: boolean },
  ) => {
    if (!isServer && config.resolve) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'chrome-aws-lambda': false,
        'puppeteer-core': false,
      };
    }

    if (config.module) {
      if (!config.module.rules) config.module.rules = [];

      config.module.rules.push({
        test: /\.node$/,
        use: 'node-loader',
      });

      config.module.rules.push({
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      });
    }

    config.optimization.moduleIds = 'deterministic';
    config.optimization.chunkIds = 'deterministic';

    return config;
  },
};

export default pwaConfig(nextConfig);