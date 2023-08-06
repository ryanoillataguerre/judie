/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  experimental: {
    esmExternals: 'loose'
  },
  transpilePackages: ["@nivo"]
};

module.exports = nextConfig;
