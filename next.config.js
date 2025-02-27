/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Default config
  reactStrictMode: true,
};

if (process.env.NODE_ENV === "static") {
  console.log("🚀 Running in STATIC mode (export enabled)");
  Object.assign(nextConfig, {
    output: "export",
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    assetPrefix: "/",
    distDir: "out",
  });
} else {
  console.log(`⚡ Running in ${process.env.NODE_ENV.toUpperCase()} mode`);
}

module.exports = nextConfig;
