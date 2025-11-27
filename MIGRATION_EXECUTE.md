# 执行数据库迁移 - 快速指南

## 立即执行迁移

### 方法 1: 使用 Wrangler CLI（推荐）

```bash
# 1. 确保已登录 Cloudflare
wrangler login

# 2. 执行迁移脚本
wrangler d1 execute profile-db --remote --file=./migrations/0002_add_user_id.sql

# 3. 验证迁移成功
wrangler d1 execute profile-db --remote --command="PRAGMA table_info(Profile);"

# 4. 查看迁移后的数据
wrangler d1 execute profile-db --remote --command="SELECT id, userId, name, email FROM Profile;"
```

### 方法 2: 在 Cloudflare Dashboard 执行

1. 访问: https://dash.cloudflare.com
2. 进入: **Workers & Pages** > **D1** > **profile-db**
3. 点击: **Console** 标签
4. 复制 `migrations/0002_add_user_id.sql` 的内容
5. 粘贴到控制台并执行

## 迁移后测试

### 1. 测试 API

```bash
# 测试默认获取
curl https://velen-profile.pages.dev/api/profile

# 测试通过 userId 获取（假设数据库中有 userId='test'）
curl https://velen-profile.pages.dev/api/profile?userId=test

# 测试通过 id 获取
curl https://velen-profile.pages.dev/api/profile?id=1
```

### 2. 测试前端

1. 访问首页: https://velen-profile.pages.dev
2. 点击"创建个人信息"
3. 填写表单（包括新的"简历 ID"字段）
4. 保存后检查 URL 是否使用了您输入的 userId
5. 点击"编辑信息"，检查编辑页面 URL 是否使用数字 ID

## 预期结果

### 数据库表结构
```
id          | INTEGER | PRIMARY KEY AUTOINCREMENT
userId      | TEXT    | NOT NULL UNIQUE
createdAt   | DATETIME
updatedAt   | DATETIME
name        | TEXT
...
```

### 数据迁移示例
**迁移前:**
```
id: "demo-001"
name: "张三"
```

**迁移后:**
```
id: 1              ← 新的自增 ID
userId: "demo-001" ← 原来的 id 值
name: "张三"
```

### URL 示例
- **公开访问**: `/profile/zhang-san` (使用 userId)
- **编辑页面**: `/edit/1` (使用数字 id)

## 如果遇到问题

### 问题 1: 迁移执行失败
```bash
# 检查数据库是否存在
wrangler d1 list

# 查看当前表结构
wrangler d1 execute profile-db --remote --command="PRAGMA table_info(Profile);"
```

### 问题 2: 数据丢失
不用担心！迁移脚本会保留所有数据，只是改变了字段名称和添加了新的自增 ID。

### 问题 3: URL 访问失败
- 检查 API 是否返回了 `userId` 字段
- 确认前端代码已更新并重新部署
- 检查浏览器控制台的错误信息

## 回滚迁移（紧急情况）

如果迁移后发现严重问题，可以回滚：

```sql
-- 警告：这会丢失迁移后创建的新数据！

CREATE TABLE "Profile_backup" (
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

INSERT INTO "Profile_backup" (
    id, createdAt, updatedAt, name, nameEn, title, email, phone, location,
    avatar, summary, github, linkedin, website, blog, skills, experiences,
    education, projects, certifications, languages
)
SELECT 
    userId, createdAt, updatedAt, name, nameEn, title, email, phone, location,
    avatar, summary, github, linkedin, website, blog, skills, experiences,
    education, projects, certifications, languages
FROM "Profile";

DROP TABLE "Profile";
ALTER TABLE "Profile_backup" RENAME TO "Profile";
```

## 完成后

- [x] 执行迁移
- [x] 验证数据完整性
- [x] 测试 API 端点
- [x] 测试前端功能
- [x] 推送代码到 Git
- [ ] 触发 Cloudflare Pages 重新部署

```bash
# 推送更新
git add .
git commit -m "feat: add userId field for user-friendly URLs"
git push origin main
```

等待 Cloudflare Pages 自动部署完成后，您的应用就可以使用新的 userId 功能了！
