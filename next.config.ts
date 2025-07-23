import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config: any, { isServer }: { isServer: any }) => {
    if (isServer) {
      config.externals.push('chrome-aws-lambda', 'puppeteer-core');
    }
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
    ] as any,
  },
  
  compress: true,
};

export default bundleAnalyzer(nextConfig);