/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ac.goit.global',
        pathname: '/fullstack/react/**', // покриває default-avatar.jpg та og-картинку
      },
      {
        protocol: 'https',
        hostname: 'notehub-api.goit.study',
        pathname: '/**', // якщо бекенд віддає аватари/зображення
      },
    ],
  },
};

module.exports = nextConfig;
