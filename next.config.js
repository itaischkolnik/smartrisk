/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  webpack: (config, { isServer }) => {
    if (!config.externals) {
      config.externals = [];
    }
    config.externals.push('puppeteer');
    
    // Externalize PDF libraries for server-side to avoid bundling issues
    if (isServer) {
      config.externals.push('canvas');
      // Note: We're not externalizing pdf-parse because it needs to be bundled,
      // but we'll exclude its test files below
    }

    // Handle Node.js modules for pdf-parse
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        http: false,
        https: false,
        url: false,
        path: false,
        stream: false,
        crypto: false,
        buffer: false,
        util: false,
        zlib: false,
        canvas: false,
      };
    }
    
    // Exclude test PDF files from being bundled (they cause ENOENT errors)
    config.module.rules.push({
      test: /\.pdf$/,
      type: 'asset/resource',
      generator: {
        emit: false, // Don't emit PDF files at all
      },
    });

    config.module.rules.push({
      test: /\.map$/,
      exclude: /node_modules/,
      use: ['ignore-loader'],
    });
    
    // Use IgnorePlugin to completely exclude test directories
    const webpack = require('webpack');
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /test\/data/,
        contextRegExp: /pdf-parse/,
      })
    );

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
};

module.exports = nextConfig;