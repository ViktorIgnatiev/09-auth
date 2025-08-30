import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ac.goit.global', pathname: '/fullstack/react/**' },
      { protocol: 'https', hostname: 'notehub-api.goit.study', pathname: '/**' },
    ],
  },
};

export default nextConfig;
