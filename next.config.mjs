/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'encoding');
    return config;
  },
    experimental: {
        // Disable caching in development
        workerThreads: false,
        cpus: 1
      },
};

export default nextConfig;
