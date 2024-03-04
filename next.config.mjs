/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
    experimental: {
        serverComponentsExternalPackages: [
          'puppeteer-core',
          'chrome-aws-lambda'
        ],
      },
};

export default nextConfig;
