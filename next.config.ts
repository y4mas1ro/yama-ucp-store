import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/.well-known/ucp',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600' }
        ]
      }
    ];
  }
};

export default nextConfig;
