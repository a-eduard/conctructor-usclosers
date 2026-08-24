import createNextIntlPlugin from 'next-intl/plugin';

// Pointing the plugin to our custom i18n file location
const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
};

export default withNextIntl(nextConfig);
