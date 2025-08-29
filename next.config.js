const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Додайте ці налаштування
  experimental: {
    serverComponentsExternalPackages: ['cookie'],
  },
  // Вимкніть статичну генерацію для API routes
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '10mb',
    },
    externalResolver: true,
  },
}
