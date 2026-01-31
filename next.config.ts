import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // headers削除（Server Route不要）
  trailingSlash: true,

  // 静的配信最適化のみ
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ucp.dev' },
      { protocol: 'https', hostname: 'yama-ucp-store.vercel.app' }
    ]
  }
};

export default nextConfig;
