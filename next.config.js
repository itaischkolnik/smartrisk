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
    
    // Externalize canvas for server-side
    if (isServer) {
      config.externals.push('canvas');
    }

    // Handle Node.js modules
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
    
    // Exclude test and data directories from pdf-parse to avoid ENOENT errors
    const webpack = require('webpack');
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/test\//,
        contextRegExp: /pdf-parse/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/data\//,
        contextRegExp: /pdf-parse/,
      })
    );
    
    // Ignore PDF files from being processed
    config.module.rules.push({
      test: /\.pdf$/,
      type: 'asset/resource',
      generator: {
        emit: false,
      },
    });

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
};

module.exports = nextConfig;