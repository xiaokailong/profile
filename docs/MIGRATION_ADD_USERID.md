# 数据库迁移指南 - 添加 userId 字段

## 迁移说明

此迁移将数据库结构从单一 `id` (TEXT) 改为：
- `id` (INTEGER, 自增主键) - 内部使用
- `userId` (TEXT, 唯一) - 用户友好的 ID，用于 URL

## 执行步骤

### 1. 在 Cloudflare Dashboard 执行迁移

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** > **D1**
3. 选择数据库 `profile-db`
4. 点击 **Console** 标签
5. 复制并执行以下 SQL（来自 `migrations/0002_add_user_id.sql`）：

```sql
-- Step 1: Create new table with improved structure
CREATE TABLE "Profile_new" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL UNIQUE,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

-- Step 2: Migrate existing data (old id becomes userId)
INSERT INTO "Profile_new" (
    userId, createdAt, updatedAt, name, nameEn, title, email, phone, location, 
    avatar, summary, github, linkedin, website, blog, skills, experiences, 
    education, projects, certifications, languages
)
SELECT 
    id, createdAt, updatedAt, name, nameEn, title, email, phone, location,
    avatar, summary, github, linkedin, website, blog, skills, experiences,
    education, projects, certifications, languages
FROM "Profile";

-- Step 3: Drop old table
DROP TABLE "Profile";

-- Step 4: Rename new table
ALTER TABLE "Profile_new" RENAME TO "Profile";

-- Step 5: Create index on userId for fast lookup
CREATE INDEX "Profile_userId_idx" ON "Profile"("userId");
```

### 2. 使用 Wrangler CLI 执行（推荐）

```bash
# 执行迁移
wrangler d1 execute profile-db --remote --file=./migrations/0002_add_user_id.sql

# 验证迁移
wrangler d1 execute profile-db --remote --command="SELECT id, userId, name FROM Profile LIMIT 5;"
```

### 3. 验证迁移结果

执行以下查询确认迁移成功：

```sql
-- 查看表结构
PRAGMA table_info(Profile);

-- 应该看到:
-- id | INTEGER | PRIMARY KEY | AUTOINCREMENT
-- userId | TEXT | NOT NULL | UNIQUE

-- 查看数据
SELECT id, userId, name, email FROM Profile;

-- 检查索引
SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='Profile';
```

## 迁移后的数据结构

### 旧结构
```
Profile
├── id (TEXT, PRIMARY KEY)          ← 用户输入的字符串
├── name, email, etc...
```

### 新结构
```
Profile
├── id (INTEGER, AUTOINCREMENT)     ← 自动生成的数字主键
├── userId (TEXT, UNIQUE)           ← 用户友好的标识符
├── name, email, etc...
```

## URL 路由变化

### 公开访问（使用 userId）
- **旧**: `/profile/{random-id-string}`
- **新**: `/profile/{user-friendly-id}` (例: `/profile/zhang-san`)

### 编辑操作（使用 id）
- **旧**: `/edit/{random-id-string}`
- **新**: `/edit/{numeric-id}` (例: `/edit/1`)

## API 变化

### GET 请求
```javascript
// 通过 userId 获取（公开访问）
GET /api/profile?userId=zhang-san

// 通过 id 获取（内部编辑）
GET /api/profile?id=1

// 获取第一个（默认）
GET /api/profile
```

### POST 请求（创建）
```javascript
{
  "userId": "zhang-san",  // 必需：用户自定义 ID
  "name": "张三",
  "email": "zhang@example.com",
  // ... 其他字段
}
```

### PUT 请求（更新）
```javascript
{
  "id": 1,  // 必需：数字 ID
  "name": "张三",
  "email": "zhang@example.com",
  // ... 其他字段
}
```

## 回滚方案（如果需要）

如果迁移出现问题，可以回滚：

```sql
-- 注意：这会丢失迁移后添加的新数据！

-- 创建旧表结构
CREATE TABLE "Profile_old" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    -- ... 其他字段
);

-- 迁移数据回去（userId 变回 id）
INSERT INTO "Profile_old" SELECT userId as id, * FROM "Profile";

-- 删除新表
DROP TABLE "Profile";

-- 重命名
ALTER TABLE "Profile_old" RENAME TO "Profile";
```

## 常见问题

### Q: 现有数据会丢失吗？
A: 不会。旧的 `id` 字段值会自动变成新的 `userId` 字段，同时系统会生成新的数字 `id`。

### Q: 现有的 URL 还能访问吗？
A: 可以！因为旧的 `id` 值变成了 `userId`，所以原来的 URL `/profile/old-id` 仍然有效。

### Q: userId 有什么限制？
A: 
- 必须唯一
- 只能包含字母、数字、中划线和下划线
- 长度 3-50 个字符
- 推荐格式：`firstname-lastname` 或 `username`

### Q: 如何查看我的数字 ID？
A: 在编辑页面的 URL 中可以看到，例如 `/edit/1` 中的 `1` 就是数字 ID。

## 技术优势

1. **性能提升**: 数字主键比字符串主键更高效
2. **数据完整性**: 自增 ID 保证唯一性
3. **用户体验**: 用户可以自定义好记的 ID
4. **安全性**: 内部使用数字 ID，对外使用字符串 ID
5. **扩展性**: 便于后续添加功能（如批量操作）

## 部署清单

- [x] 更新数据库 schema
- [x] 更新 TypeScript 类型定义
- [x] 更新 API 路由（支持 userId 和 id）
- [x] 更新前端页面
- [x] 更新表单组件
- [x] 执行数据库迁移
- [ ] 测试所有功能
- [ ] 部署到生产环境
