# 个人简历管理系统

一个现代化的个人简历管理系统，使用 Next.js 15、React 19、TypeScript 和 Ant Design 构建。

## 技术栈

- **前端框架**: Next.js 15 (App Router)
- **UI 库**: React 19
- **组件库**: Ant Design 6
- **语言**: TypeScript
- **数据库**: PostgreSQL (via Prisma ORM)
- **PDF 导出**: jsPDF + html2canvas
- **部署**: Cloudflare Pages (推荐)

## 功能特性

✅ 个人信息展示（漂亮的布局排版）
✅ 可编辑的表单管理
✅ PDF 简历导出与预览
✅ 完整的程序员简历模板
✅ 响应式设计
✅ 数据库持久化存储

## 快速开始

### 1. 安装依赖

```bash
npm install --legacy-peer-deps
```

### 2. 配置数据库

复制 `.env.example` 到 `.env` 并配置你的数据库连接：

```env
DATABASE_URL="postgresql://user:password@host:port/database"
```

推荐使用以下数据库服务（支持 Cloudflare）：
- [Neon](https://neon.tech) - Serverless PostgreSQL
- [Supabase](https://supabase.com) - 开源 Firebase 替代品
- [PlanetScale](https://planetscale.com) - MySQL (需调整 schema)

### 3. 初始化数据库

```bash
npx prisma generate
npx prisma db push
```

### 4. 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
profile/
├── prisma/
│   └── schema.prisma          # 数据库模型定义
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── profile/
│   │   │       └── route.ts   # API 路由
│   │   ├── layout.tsx         # 根布局（含 Ant Design 配置）
│   │   └── page.tsx           # 主页面
│   ├── components/
│   │   ├── ProfileDisplay.tsx # 个人信息展示组件
│   │   ├── ProfileForm.tsx    # 编辑表单组件
│   │   └── PDFExport.tsx      # PDF 导出组件
│   ├── lib/
│   │   └── prisma.ts          # Prisma 客户端
│   └── types/
│       └── profile.ts         # TypeScript 类型定义
├── .env                       # 环境变量配置
└── package.json
```

## 数据模型

系统支持以下个人信息：

- **基本信息**: 姓名、职位、邮箱、电话、位置、头像、简介
- **社交链接**: GitHub、LinkedIn、个人网站、博客
- **技能**: 技能名称、分类、熟练度（1-5）
- **工作经历**: 公司、职位、时间、描述、成就、技术栈
- **项目经验**: 项目名称、角色、描述、技术栈、链接
- **教育背景**: 学校、学位、专业、GPA、时间
- **证书资质**: 证书名称、颁发机构、时间
- **语言能力**: 语言、水平

## 部署到 Cloudflare Pages

### 方法 1: 使用 Cloudflare Pages (推荐)

1. 将代码推送到 GitHub
2. 在 Cloudflare Dashboard 中创建新的 Pages 项目
3. 连接你的 GitHub 仓库
4. 配置构建设置：
   - **构建命令**: `npm run build`
   - **输出目录**: `.next`
   - **Node 版本**: 18 或更高
5. 添加环境变量 `DATABASE_URL`
6. 部署

### 方法 2: 使用 Wrangler CLI

```bash
npm install -g wrangler
wrangler pages deploy .next
```

## 环境变量

```env
# 数据库连接（必需）
DATABASE_URL="postgresql://..."

# 应用 URL（可选）
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

## 开发指南

### 修改主题

在 `src/app/layout.tsx` 中修改 Ant Design 主题配置：

```tsx
<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#1890ff', // 主色调
      borderRadius: 8,         // 圆角
    },
  }}
>
```

### 添加新字段

1. 更新 `prisma/schema.prisma`
2. 更新 `src/types/profile.ts`
3. 运行 `npx prisma generate && npx prisma db push`
4. 在 `ProfileForm.tsx` 中添加表单字段
5. 在 `ProfileDisplay.tsx` 中显示新字段

## 常见问题

### 依赖冲突问题

如果遇到 peer dependency 警告，使用 `--legacy-peer-deps` 标志安装：

```bash
npm install --legacy-peer-deps
```

### 数据库连接失败

确保你的数据库 URL 格式正确，并且数据库服务可访问。

### PDF 导出空白

确保个人信息已保存，并且所有数据正确加载。

## License

MIT

---

祝你使用愉快！如有问题，欢迎提 Issue。
