import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Use remotePatterns for better security and flexibility (Next.js 12.3+)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      // Add more patterns as needed for other image hosts
      // Allow any HTTPS image (for flexibility - you can restrict this)
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Fallback: allow unoptimized images if remotePatterns don't match
    // This helps with images that might come from unexpected domains
    unoptimized: false,
    // Image formats to optimize
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
