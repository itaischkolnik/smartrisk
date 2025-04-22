/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com', 'googleusercontent.com'],
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
  // Configure domain handling
  async rewrites() {
    return {
      beforeFiles: [
        // Handle www to non-www redirect
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'www.smartrisk.co.il',
            },
          ],
          destination: 'https://smartrisk.co.il/:path*',
        },
      ],
    };
  },
  // Add headers for security and CORS
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  }
}

module.exports = nextConfig 