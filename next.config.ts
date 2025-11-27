import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // 图片优化配置
  images: {
    domains: [],
    unoptimized: true, // Cloudflare Pages 需要
  },
  // 实验性功能：支持 Cloudflare Pages
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
