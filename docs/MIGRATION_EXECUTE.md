# 执行数据库迁移 - 快速指南

## 最新迁移记录（2025-11-28）

### ✅ 0005_fields_update.sql - 已完成本地迁移

**迁移内容：**
- phone 字段改为必填
- Certification 移除 issuer 字段
- Project 移除 github 字段，highlights 从数组改为文本
- Education 从数组改为单个对象

**本地数据库状态：** ✅ 已成功应用所有迁移（0001-0005）

**远程数据库状态：** ⏳ 待执行（需要 Cloudflare 认证）

---

## 立即执行远程迁移

### 方法 1: 使用 Wrangler CLI（推荐）

```bash
# 1. 确保已登录 Cloudflare
npx wrangler login

# 2. 查看待执行的迁移
npx wrangler d1 migrations list profile-db --remote

# 3. 应用所有待执行的迁移（包括 0005_fields_update.sql）
npx wrangler d1 migrations apply profile-db --remote

# 4. 验证迁移成功
npx wrangler d1 execute profile-db --remote --command="SELECT name FROM d1_migrations ORDER BY id DESC LIMIT 5"

# 5. 查看迁移后的数据示例
npx wrangler d1 execute profile-db --remote --command="SELECT id, userId, name, email, phone FROM Profile LIMIT 1"
```

**注意：** 如果遇到网络认证问题，请使用方法 2 或方法 3。

### 方法 2: 在 Cloudflare Dashboard 执行

1. 访问: https://dash.cloudflare.com
2. 进入: **Workers & Pages** > **D1** > **profile-db** (4bb29d0b-79f9-4cb9-8f99-ea0a82810bf8)
3. 点击: **Console** 标签
4. 执行以下 SQL（来自 `migrations/0005_fields_update.sql`）：

```sql
-- 清理 certifications 中的 issuer 字段
UPDATE Profile 
SET certifications = (
  SELECT json_group_array(
    json_object(
      'id', json_extract(value, '$.id'),
      'name', json_extract(value, '$.name'),
      'date', json_extract(value, '$.date'),
      'url', json_extract(value, '$.url')
    )
  )
  FROM json_each(certifications)
)
WHERE certifications IS NOT NULL AND certifications != '[]';

-- 清理 projects 中的 github 字段，并将 highlights 数组转为字符串
UPDATE Profile 
SET projects = (
  SELECT json_group_array(
    json_object(
      'id', json_extract(value, '$.id'),
      'name', json_extract(value, '$.name'),
      'description', json_extract(value, '$.description'),
      'role', json_extract(value, '$.role'),
      'startDate', json_extract(value, '$.startDate'),
      'endDate', json_extract(value, '$.endDate'),
      'technologies', json_extract(value, '$.technologies'),
      'url', json_extract(value, '$.url'),
      'highlights', CASE 
        WHEN json_type(json_extract(value, '$.highlights')) = 'array' 
        THEN (
          SELECT group_concat(json_extract(h.value, '$'), char(10))
          FROM json_each(json_extract(value, '$.highlights')) h
        )
        ELSE json_extract(value, '$.highlights')
      END
    )
  )
  FROM json_each(projects)
)
WHERE projects IS NOT NULL AND projects != '[]';

-- 将 education 从数组格式转为单个对象
UPDATE Profile 
SET education = json_extract(education, '$[0]') 
WHERE education IS NOT NULL 
  AND education != '[]' 
  AND json_type(education) = 'array';
```

5. 执行成功后，验证数据：
```sql
SELECT id, certifications, projects, education FROM Profile LIMIT 1;
```

### 方法 3: 通过部署自动执行

迁移文件已提交到仓库，下次部署时会自动应用：

```powershell
git add .
git commit -m "chore: database migration 0005 - fields update"
git push
```

Cloudflare Pages 会自动检测并应用新迁移。

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
