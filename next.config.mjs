import createNextIntlPlugin from 'next-intl/plugin';

// Pointing the plugin to our custom i18n file location
const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracing: false, // <-- Вот эта строка отключит багованную трассировку на Vercel
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.getbiz.me',
      },
    ],
  },
};

export default withNextIntl(nextConfig);