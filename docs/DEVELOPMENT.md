# 开发指南

## 本地开发环境设置

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd profile
```

### 2. 安装依赖

```bash
npm install --legacy-peer-deps
```

### 3. 配置环境变量

复制 `.env.example` 到 `.env`：

```bash
cp .env.example .env
```

编辑 `.env` 文件，设置你的数据库 URL。

### 4. 初始化数据库

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库结构
npm run db:push
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 项目架构

### 目录结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   └── profile/       # 个人信息 CRUD API
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/            # React 组件
│   ├── ProfileDisplay.tsx # 展示组件
│   ├── ProfileForm.tsx    # 表单组件
│   └── PDFExport.tsx      # PDF 导出组件
├── lib/                   # 工具库
│   └── prisma.ts          # Prisma 客户端实例
└── types/                 # TypeScript 类型定义
    └── profile.ts         # 个人信息类型
```

### 数据流

```
用户操作
  ↓
React 组件
  ↓
API 路由 (/api/profile)
  ↓
Prisma Client
  ↓
PostgreSQL 数据库
```

## 核心功能实现

### 1. 个人信息展示

`ProfileDisplay.tsx` 组件负责展示个人信息：

- 使用 Ant Design 组件构建 UI
- 响应式布局（移动端友好）
- 渐变色背景头部
- 时间线展示工作经历和教育背景
- 技能进度条可视化

### 2. 表单编辑

`ProfileForm.tsx` 提供完整的编辑功能：

- 动态表单（支持添加/删除条目）
- 日期选择器（工作经历、教育背景）
- 标签输入（技能、技术栈）
- 表单验证
- 数据格式化（日期转换）

### 3. PDF 导出

`PDFExport.tsx` 实现简历导出：

- 使用 html2canvas 将 DOM 转换为图片
- 使用 jsPDF 生成 PDF
- 支持多页 PDF
- PDF 预览功能
- 下载功能

### 4. API 路由

`/api/profile/route.ts`：

- **GET**: 获取个人信息
- **POST**: 创建新的个人信息
- **PUT**: 更新现有个人信息

## 数据库模型

### Profile 表

```prisma
model Profile {
  id             String   @id @default(cuid())
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  // 基本字段
  name           String
  title          String
  email          String
  // ... 其他字段
  
  // JSON 字段
  skills         Json?
  experiences    Json?
  education      Json?
  projects       Json?
  certifications Json?
  languages      Json?
}
```

JSON 字段存储复杂数组数据，便于扩展和修改。

## 添加新功能

### 示例：添加"获奖经历"功能

#### 1. 更新类型定义

在 `src/types/profile.ts` 添加：

```typescript
export interface Award {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface ProfileData {
  // ... 现有字段
  awards?: Award[];
}
```

#### 2. 更新数据库模型

在 `prisma/schema.prisma` 的 Profile 模型中添加：

```prisma
model Profile {
  // ... 现有字段
  awards Json?
}
```

运行：

```bash
npm run db:generate
npm run db:push
```

#### 3. 更新表单组件

在 `ProfileForm.tsx` 中添加表单字段（参考 certifications 的实现）。

#### 4. 更新展示组件

在 `ProfileDisplay.tsx` 中添加展示逻辑（参考 certifications 的实现）。

## 样式定制

### 修改主题色

在 `src/app/layout.tsx` 中：

```tsx
<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#your-color', // 修改主色
      borderRadius: 8,
    },
  }}
>
```

### 修改头部渐变

在 `ProfileDisplay.tsx` 中：

```tsx
<Card style={{ 
  background: 'linear-gradient(135deg, #color1 0%, #color2 100%)' 
}}>
```

## 测试

### 手动测试清单

- [ ] 创建新的个人信息
- [ ] 编辑现有信息
- [ ] 添加/删除技能
- [ ] 添加/删除工作经历
- [ ] 添加/删除项目经验
- [ ] 导出 PDF
- [ ] 预览 PDF
- [ ] 响应式布局测试（移动端）

### 数据库测试

使用 Prisma Studio：

```bash
npm run db:studio
```

## 性能优化

### 1. 代码分割

Next.js 自动进行代码分割，无需额外配置。

### 2. 图片优化

使用 Next.js Image 组件：

```tsx
import Image from 'next/image';

<Image src={avatar} alt="Avatar" width={120} height={120} />
```

### 3. 数据库查询优化

在 API 路由中只查询需要的字段：

```typescript
const profile = await prisma.profile.findFirst({
  select: {
    id: true,
    name: true,
    // 只选择需要的字段
  }
});
```

## 调试技巧

### 1. 查看 API 响应

在浏览器开发工具的 Network 标签中查看 `/api/profile` 的响应。

### 2. React DevTools

安装 React DevTools 浏览器扩展，查看组件状态和 props。

### 3. Prisma 调试

启用 Prisma 日志：

```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

## 常见问题

### Q: 如何重置数据库？

```bash
npx prisma db push --force-reset
```

### Q: 如何导入示例数据？

```bash
npx tsx prisma/seed.ts
```

### Q: 如何更新依赖？

```bash
npm update --legacy-peer-deps
```

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 资源链接

- [Next.js 文档](https://nextjs.org/docs)
- [Ant Design 文档](https://ant.design/components/overview-cn/)
- [Prisma 文档](https://www.prisma.io/docs)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)

---

Happy coding! 🎉
