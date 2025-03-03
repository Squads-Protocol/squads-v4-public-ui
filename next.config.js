const { execSync } = require('child_process');

function getGitHash() {
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch (error) {
    console.error('⚠️ Unable to retrieve Git hash. Using fallback.');
    return 'static-build';
  }
}

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Default config
  reactStrictMode: true,
  experimental: {
    disablePostcssPresetEnv: true,
    workerThreads: false,
  },
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
    generateBuildId: async () => getGitHash(),
  });
} else {
  console.log(`⚡ Running in ${process.env.NODE_ENV.toUpperCase()} mode`);
}

module.exports = nextConfig;
