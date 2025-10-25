/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export in production builds, not in dev mode
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  trailingSlash: true,
  basePath: '',
  assetPrefix: '',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Bundle analyzer (uncomment to analyze bundle)
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.resolve.fallback = {
  //       ...config.resolve.fallback,
  //       fs: false,
  //       path: false,
  //     }
  //   }
  //   return config
  // },
};

export default nextConfig;
