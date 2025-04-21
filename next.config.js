/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  webpack: (config) => {
    // Handle puppeteer in serverless environment
    if (!config.externals) {
      config.externals = [];
    }
    config.externals.push('puppeteer');

    // Ignore source map files from chrome-aws-lambda
    config.module.rules.push({
      test: /\.map$/,
      use: 'ignore-loader'
    });
    
    return config;
  },
  // Add output configuration for serverless
  output: 'standalone',
}

module.exports = nextConfig 