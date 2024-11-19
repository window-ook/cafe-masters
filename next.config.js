const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const CompressionPlugin = require('compression-webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.plugins.push(new CompressionPlugin());
    return config;
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
        protocol: 'http',
        hostname: 't1.daumcdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vsemazasjbizehcambul.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/cafe%20masters/**',
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
  nextConfig
);
