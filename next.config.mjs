/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        // Disable caching in development
        workerThreads: false,
        cpus: 1
      },
};

export default nextConfig;
