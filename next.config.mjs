/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@xenova/transformers", "pdf-parse"],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "sharp$": false,
      "onnxruntime-node$": false,
    };
    // Ignore canvas (used by pdf-parse on some systems, not needed)
    if (isServer) {
      config.resolve.alias["canvas"] = false;
    }
    return config;
  },
  // Allow DiceBear avatar images
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
  },
};

export default nextConfig;
