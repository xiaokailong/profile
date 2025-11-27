# 🚀 快速部署到 Cloudflare Pages

## ✅ 已修复的问题

1. ✅ Ant Design 版本冲突 - 降级到 5.21.6
2. ✅ API CORS 支持 - 允许跨域请求
3. ✅ 构建配置 - 添加 `.npmrc` 和正确的构建命令

## 📋 部署步骤

### 1️⃣ 推送代码到 GitHub

```bash
git add .
git commit -m "Fix deployment issues and add CORS support"
git push
```

### 2️⃣ Cloudflare Pages 设置

在 Cloudflare Dashboard 中配置：

**构建设置：**
```
框架预设: Next.js
构建命令: npm install && npm run build
构建输出目录: .next
根目录: /
```

**环境变量（重要！）：**
```bash
# 必需
DATABASE_URL=你的PostgreSQL连接字符串
NODE_VERSION=18

# 可选
NEXT_PUBLIC_APP_URL=https://velen-profile.pages.dev
```

### 3️⃣ 数据库配置

**推荐数据库服务：**

#### 选项 A: Neon（推荐）
1. 访问 https://neon.tech
2. 创建项目
3. 复制连接字符串
4. 在 Cloudflare 添加 `DATABASE_URL` 环境变量

#### 选项 B: Supabase
1. 访问 https://supabase.com
2. 创建项目
3. 获取连接字符串
4. 在 Cloudflare 添加 `DATABASE_URL` 环境变量

### 4️⃣ 初始化数据库

部署成功后，在本地运行：

```bash
# 设置生产数据库 URL
DATABASE_URL="你的生产数据库URL" npx prisma db push
```

## 🔧 本地调试连接生产 API

### 方法 1: 环境变量

创建 `.env.local` 文件：

```bash
NEXT_PUBLIC_API_URL=https://velen-profile.pages.dev
```

### 方法 2: 直接调用

由于 API 已支持 CORS，你可以直接在本地前端调用生产 API：

```typescript
// 在 src/app/page.tsx 或其他组件中
const response = await fetch('https://velen-profile.pages.dev/api/profile');
```

## ✨ 验证部署

1. 访问 https://velen-profile.pages.dev
2. 应该看到模拟数据或空页面
3. 点击"编辑信息"创建第一份简历
4. 测试 PDF 导出功能

## 🐛 常见问题

### 问题 1: 构建失败 - 依赖冲突

**解决方案：** 已通过 `.npmrc` 文件自动处理

### 问题 2: API 500 错误

**原因：** 数据库未配置或连接失败

**解决方案：**
1. 检查 `DATABASE_URL` 环境变量
2. 确保数据库可从外部访问
3. 运行 `npx prisma db push` 初始化数据库

### 问题 3: CORS 错误

**解决方案：** 已在 API 路由中添加 CORS 头部，支持跨域请求

## 📊 当前状态

- ✅ 代码构建成功
- ✅ Ant Design 版本兼容
- ✅ CORS 已配置
- ✅ `.npmrc` 已添加
- ✅ 生产环境配置完成

## 🎯 下一步

1. 推送代码到 GitHub
2. 在 Cloudflare 配置环境变量
3. 等待自动部署
4. 初始化数据库
5. 开始使用！

---

**生产地址：** https://velen-profile.pages.dev

**数据库信息：**
- 名称: profile-db
- ID: 4bb29d0b-79f9-4cb9-8f99-ea0a82810bf8
