/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ac.goit.global',
        pathname: '/fullstack/react/**', // покриває і notehub-og-meta.jpg, і default-avatar.jpg
      },
      // додатково, якщо колись аватари/зображення прийдуть з API-домену:
      {
        protocol: 'https',
        hostname: 'notehub-api.goit.study',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
