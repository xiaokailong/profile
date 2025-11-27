# Cloudflare Pages 部署说明

## 环境变量配置

在 Cloudflare Pages 项目设置中添加以下环境变量：

### 必需的环境变量

```bash
# 数据库连接（使用 Neon 或其他 PostgreSQL）
DATABASE_URL=postgresql://user:password@host:port/database

# 或者使用 Cloudflare D1（需要额外配置）
# D1 数据库已创建：
# 名称: profile-db
# ID: 4bb29d0b-79f9-4cf99-ea0a82810bf8
```

### 构建设置

在 Cloudflare Pages 项目设置中配置：

```
框架预设: Next.js
构建命令: npm install --legacy-peer-deps && npm run build
构建输出目录: .next
根目录: /
Node 版本: 18
```

### 环境变量（在 Cloudflare Dashboard 设置）

```
NPM_FLAGS=--legacy-peer-deps
NODE_VERSION=18
DATABASE_URL=你的数据库连接字符串
```

## 本地开发配置

如果要本地调试连接生产 API：

1. 编辑 `.env.local` 文件：

```bash
NEXT_PUBLIC_API_URL=https://velen-profile.pages.dev
```

2. 更新 API 调用代码使用环境变量：

```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
const response = await fetch(`${apiUrl}/api/profile`);
```

## CORS 配置

API 已配置 CORS 允许跨域请求，支持：
- 所有来源 (`*`)
- GET, POST, PUT, DELETE, OPTIONS 方法
- Content-Type, Authorization 头部

## 数据库迁移

部署后首次运行需要初始化数据库：

```bash
npx prisma db push
```

或使用 Prisma Studio 管理数据：

```bash
npx prisma studio
```
