/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  webpack: (config) => {
    if (!config.externals) {
      config.externals = [];
    }
    config.externals.push('puppeteer');

    config.module.rules.push({
      test: /\.map$/,
      exclude: /node_modules/,
      use: ['ignore-loader'],
    });

    return config;
  },
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  async rewrites() {
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      return {
        beforeFiles: [
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
    }
    
    // Return empty rewrites in development
    return [];
  },
};

module.exports = nextConfig;