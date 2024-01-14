/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: "",
  webpack: (config, { isServer }) => {
    // Ensure that the 'fs' module is not included in the client-side bundle
    if (!isServer) {
      config.resolve.fallback = config.resolve.fallback || {};
      config.resolve.fallback.fs = false;
    }
    return config;
  },
};

module.exports = nextConfig;
