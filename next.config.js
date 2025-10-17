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
    
    // Externalize pdfjs-dist for server-side to avoid bundling issues
    if (isServer) {
      config.externals.push('pdfjs-dist');
      config.externals.push('canvas');
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
    
    // Ignore test files and worker files from pdfjs-dist
    config.module.rules.push({
      test: /\.pdf$/,
      type: 'asset/resource',
    });
    
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?js/,
      type: 'asset/resource',
    });

    config.module.rules.push({
      test: /\.map$/,
      exclude: /node_modules/,
      use: ['ignore-loader'],
    });
    
    // Exclude test data from being bundled
    config.module.rules.push({
      test: /node_modules\/pdfjs-dist\/.*test.*\.pdf$/,
      use: 'null-loader',
    });
    
    config.module.rules.push({
      test: /node_modules\/pdf-parse\/.*test.*\.pdf$/,
      use: 'null-loader',
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