import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Images uploadées
      },
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net", // Images Jikan API
      },
      {
        protocol: "https",
        hostname: "myanimelist.net",
      },
      {
        protocol: "https",
        hostname: "picsum.photos", // Pour les tests
      },
    ],
  },
};

export default nextConfig;
