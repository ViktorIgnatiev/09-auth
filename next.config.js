/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ac.goit.global',
        // дозволимо всі зображення під цим префіксом
        pathname: '/fullstack/**',
      },
    ],
  },
};

module.exports = nextConfig;
