import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        // Thumbnails dos depoimentos em vídeo (YouTube Shorts)
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
};

export default nextConfig;
