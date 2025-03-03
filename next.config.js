const { execSync } = require('child_process');

function getGitHash() {
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch (error) {
    console.error('Unable to retrieve Git hash. Using fallback.');
    return 'static-build';
  }
}

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    disablePostcssPresetEnv: true,
    workerThreads: false,
  },
  turbo: {
    moduleIdStrategy: 'deterministic',
  },
  images: {
    unoptimized: true,
  },
  optimization: {
    minimize: false,
  },
  generateBuildId: async () => getGitHash(), // ✅ Use Git hash to stabilize build ID
};

if (process.env.NODE_ENV === 'static') {
  console.log('🚀 Running in STATIC mode (export enabled)');
  Object.assign(nextConfig, {
    output: 'export',
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    assetPrefix: '/',
    distDir: 'out',
    optimizeCss: false,
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.output.filename = 'static/chunks/[name].[contenthash].js';
        config.output.chunkFilename = 'static/chunks/[name].[contenthash].chunk.js';
      }
      return config;
    },
  });
} else {
  console.log(`⚡ Running in ${process.env.NODE_ENV.toUpperCase()} mode`);
}

module.exports = nextConfig;
