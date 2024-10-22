/** @type {import('next').NextConfig} */
const nextConfig = {
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
        hostname: 'keybay.tech',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
