import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Turbopack互換：esmExternals削除
  trailingSlash: true,

  async rewrites() {
    return [
      {
        source: '/.well-known/ucp',
        destination: '/.well-known/ucp.json'
      }
    ];
  }
};

export default nextConfig;
