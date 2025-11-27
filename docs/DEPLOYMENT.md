# Cloudflare Pages 部署指南

## 前提条件

1. GitHub 账号
2. Cloudflare 账号
3. PostgreSQL 数据库（推荐使用 Neon 或 Supabase）

## 步骤 1: 准备数据库

### 使用 Neon（推荐）

1. 访问 [https://neon.tech](https://neon.tech)
2. 创建免费账号
3. 创建新项目
4. 复制连接字符串（类似：`postgresql://user:password@host/database`）

### 使用 Supabase

1. 访问 [https://supabase.com](https://supabase.com)
2. 创建新项目
3. 在设置中找到数据库连接字符串

## 步骤 2: 推送代码到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/profile.git
git push -u origin main
```

## 步骤 3: 在 Cloudflare 创建 Pages 项目

1. 登录 Cloudflare Dashboard
2. 进入 **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**
3. 选择你的 GitHub 仓库
4. 配置构建设置：

   ```
   框架预设: Next.js
   构建命令: npm run build
   构建输出目录: .next
   根目录: /
   ```

5. 配置环境变量：
   - 点击 **Environment variables**
   - 添加变量：
     - `DATABASE_URL`: 你的数据库连接字符串
     - `NEXT_PUBLIC_APP_URL`: 你的应用 URL（可选）

6. 点击 **Save and Deploy**

## 步骤 4: 初始化数据库

部署完成后，你需要初始化数据库：

### 方法 1: 本地运行（推荐）

```bash
# 在本地项目目录
npm run db:push
```

### 方法 2: 使用 Prisma Studio

```bash
npm run db:studio
```

这将打开一个浏览器界面，你可以直接添加数据。

## 步骤 5: 访问应用

部署完成后，Cloudflare 会提供一个 URL（如 `your-project.pages.dev`）。

首次访问时，应用会提示创建个人信息。

## 常见问题

### 1. 构建失败：依赖冲突

在 Cloudflare Pages 的构建设置中，添加以下环境变量：

```
NPM_FLAGS=--legacy-peer-deps
```

### 2. 数据库连接失败

确保：
- DATABASE_URL 格式正确
- 数据库允许从外部连接
- 如果使用 SSL，URL 中包含 `?sslmode=require`

### 3. 图片不显示

在 `next.config.ts` 中已配置 `unoptimized: true`，确保图片 URL 可访问。

### 4. 部署后更新代码

只需推送到 GitHub：

```bash
git add .
git commit -m "Update code"
git push
```

Cloudflare 会自动重新部署。

## 自定义域名（可选）

1. 在 Cloudflare Pages 项目设置中
2. 点击 **Custom domains**
3. 添加你的域名
4. 按照提示配置 DNS 记录

## 性能优化建议

1. **使用 CDN**: Cloudflare 自动提供全球 CDN
2. **启用缓存**: 在 `wrangler.toml` 中配置缓存策略
3. **数据库连接池**: 使用 Prisma Data Proxy 或 Accelerate
4. **图片优化**: 使用 Cloudflare Images 或外部 CDN

## 监控与分析

Cloudflare Pages 提供：
- 访问统计
- 构建日志
- 错误追踪

在项目 Dashboard 中查看详细信息。

## 备份数据

定期备份数据库：

```bash
# 使用 pg_dump（PostgreSQL）
pg_dump $DATABASE_URL > backup.sql
```

## 下一步

- 配置自定义域名
- 添加 Google Analytics
- 设置 HTTPS（Cloudflare 自动提供）
- 启用 CDN 缓存优化

---

祝你部署成功！🚀
