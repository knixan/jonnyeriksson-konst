import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "*.ufs.sh" },
      // Admins can paste an arbitrary image URL in the product image field
      // (see ImageUploader), so any https host must be allowed here too.
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
