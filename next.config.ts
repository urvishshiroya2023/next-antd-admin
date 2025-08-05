const nextConfig = {
  reactStrictMode: true,
  // Webpack configuration (only applied when not using Turbopack)
  webpack: (config: any, { isServer }: any) => {
    // Only apply webpack config when not using Turbopack
    if (!config.name?.includes('turbopack')) {
      config.externals = config.externals || {};
      config.externals['react/jsx-runtime'] = 'react/jsx-runtime';
    }
    return config;
  },
  // Turbopack configuration should be done via turbopack.config.js if needed
  // Removed unsupported 'turbo' key to eliminate warnings
};

export default nextConfig;
