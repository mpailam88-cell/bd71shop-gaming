import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed "output: export" — we need server-side features:
  // - API routes (/api/revalidate, /ads.txt)
  // - ISR / on-demand revalidation
  // - Server components (layout.tsx, generateMetadata)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "glsjqdbglzfyyrqkpwfi.supabase.co" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.vercel.app" },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  trailingSlash: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
