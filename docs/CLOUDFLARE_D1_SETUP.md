# Cloudflare D1 数据库部署指南

## 1. 创建并初始化 D1 数据库

### 运行迁移脚本
在 Cloudflare 上执行 SQL 迁移：

```bash
# 方式一：使用 wrangler CLI
npx wrangler d1 execute profile-db --remote --file=./migrations/0001_create_profile.sql

# 方式二：在 Cloudflare Dashboard 中手动执行
# 1. 访问 https://dash.cloudflare.com/
# 2. 进入 Workers & Pages > D1 > profile-db
# 3. 点击 "Console" 标签
# 4. 复制并执行 migrations/0001_create_profile.sql 中的 SQL
```

### SQL 迁移内容
```sql
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "title" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "location" TEXT,
    "avatar" TEXT,
    "summary" TEXT,
    "github" TEXT,
    "linkedin" TEXT,
    "website" TEXT,
    "blog" TEXT,
    "skills" TEXT,
    "experiences" TEXT,
    "education" TEXT,
    "projects" TEXT,
    "certifications" TEXT,
    "languages" TEXT
);
```

## 2. 插入初始数据

### 选项 A: 使用 API 创建第一条数据
部署成功后，访问：`https://velen-profile.pages.dev/edit`
填写表单创建您的第一个简历。

### 选项 B: 通过 Cloudflare Console 插入
在 D1 Console 中执行：

```sql
INSERT INTO "Profile" (
    "id",
    "createdAt",
    "updatedAt",
    "name",
    "nameEn",
    "title",
    "email",
    "phone",
    "location",
    "avatar",
    "summary",
    "github",
    "linkedin",
    "website",
    "blog",
    "skills",
    "experiences",
    "education",
    "projects",
    "certifications",
    "languages"
) VALUES (
    'your-custom-id',
    datetime('now'),
    datetime('now'),
    '张三',
    'Zhang San',
    '全栈开发工程师',
    'zhangsan@example.com',
    '+86 138-0000-0000',
    '北京市',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang',
    '5年全栈开发经验',
    'https://github.com/yourusername',
    'https://linkedin.com/in/yourusername',
    'https://yourwebsite.com',
    'https://yourblog.com',
    '[{"name":"React","level":90,"category":"前端框架"}]',
    '[]',
    '[]',
    '[]',
    '[]',
    '[{"name":"中文","level":"母语"}]'
);
```

## 3. 验证部署

### 检查数据库表
```bash
npx wrangler d1 execute profile-db --remote --command="SELECT name FROM sqlite_master WHERE type='table';"
```

### 查询数据
```bash
npx wrangler d1 execute profile-db --remote --command="SELECT id, name, nameEn, email FROM Profile LIMIT 5;"
```

## 4. 本地开发

### 本地 SQLite 数据库
```bash
# 生成 Prisma Client
npx prisma generate

# 推送数据库 schema
npx prisma db push

# 插入示例数据
npx tsx prisma/seed.ts
```

### 本地测试 D1（使用 wrangler）
```bash
# 创建本地 D1 数据库
npx wrangler d1 execute profile-db --local --file=./migrations/0001_create_profile.sql

# 本地开发
npm run dev
```

## 5. 环境变量

### 本地开发 (.env)
```
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Cloudflare Pages 环境变量
在 Cloudflare Dashboard > Pages > profile > Settings > Environment variables 中添加：
```
DATABASE_URL="file:./dev.db"  # Cloudflare Pages 会自动使用 D1 binding
```

## 6. 部署流程

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Update database schema with nameEn field"
   git push
   ```

2. **Cloudflare Pages 自动部署**
   - 代码推送后自动触发构建
   - 构建命令：`npm install --legacy-peer-deps && npm run build`

3. **初始化数据库**（仅首次）
   ```bash
   npx wrangler d1 execute profile-db --remote --file=./migrations/0001_create_profile.sql
   ```

4. **访问应用**
   - 生产环境：https://velen-profile.pages.dev/
   - 创建简历：https://velen-profile.pages.dev/edit

## 7. 故障排查

### 构建失败
- 检查 `package.json` 中的 dependencies
- 确认 `.npmrc` 包含 `legacy-peer-deps=true`
- 查看 Cloudflare Pages 构建日志

### 数据库连接失败
- 确认 D1 binding 配置正确（wrangler.toml）
- 检查数据库表是否已创建
- 验证 database_id 是否匹配

### API 404 错误
- 确认路由配置正确（src/app/api/profile/route.ts）
- 检查 Next.js App Router 配置

## 数据库 ID
- Database Name: `profile-db`
- Database ID: `4bb29d0b-79f9-4cb9-8f99-ea0a82810bf8`
- Production URL: https://velen-profile.pages.dev/
