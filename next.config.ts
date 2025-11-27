import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Cloudflare Pages 兼容配置
  output: 'standalone',
  // 图片优化配置
  images: {
    domains: [],
    unoptimized: true, // Cloudflare Pages 需要
  },
};

export default nextConfig;
