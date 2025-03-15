const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('chrome-aws-lambda', 'puppeteer-core');
    }
    return config;
  },

  experimental: {
    esmExternals: false,
  },

  images: {
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
    ],
  },
};

module.exports = withPlugins(
  [
    withBundleAnalyzer({
      compress: true,
    }),
  ],
  nextConfig,
);
