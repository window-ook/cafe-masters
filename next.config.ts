import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 't1.kakaocdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img1.kakaocdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 't1.daumcdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'postfiles.pstatic.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'blog.kakaocdn.net',
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
    ],
  },
  compress: true,
  webpack: (
    config: Configuration,
    { isServer }: { isServer: boolean },
  ): Configuration => {
    if (!isServer && config.resolve) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'chrome-aws-lambda': false,
        'puppeteer-core': false,
      };
    }

    if (config.module) {
      if (!config.module.rules) {
        config.module.rules = [];
      }
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

    return config;
  },
};

export default nextConfig;