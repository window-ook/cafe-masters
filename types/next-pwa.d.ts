declare module 'next-pwa' {
  import { NextConfig } from 'next';

  interface PWAConfig {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    sw?: string;
    publicExcludes?: string[];
    buildExcludes?: string[];
    fallbacks?: {
      image?: string;
      document?: string;
      font?: string;
      audio?: string;
      video?: string;
    };
    runtimeCaching?: Array<{
      urlPattern: RegExp | string;
      handler: string;
      options?: {
        cacheName?: string;
        expiration?: {
          maxEntries?: number;
          maxAgeSeconds?: number;
        };
        cacheKeyWillBeUsed?: any;
        cacheWillUpdate?: any;
        fetchDidFail?: any;
        fetchDidSucceed?: any;
        requestWillFetch?: any;
        requestDidFail?: any;
      };
    }>;
  }

  function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;

  export = withPWA;
}