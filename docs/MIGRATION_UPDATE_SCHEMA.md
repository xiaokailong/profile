# 数据库迁移指南 - Schema 更新

## 变更说明

本次迁移包含以下更改：

1. **添加性别字段（必选）**
   - 字段名：`gender`
   - 类型：TEXT
   - 默认值：'男'
   - 必填字段

2. **移除字段**
   - 移除 `linkedin` 字段
   - 移除 `blog` 字段

3. **技能字段简化**
   - 从对象数组（包含 name, level, category）简化为字符串数组（仅包含 name）
   - 前端使用标签形式展示

## 本地开发环境迁移

### Cloudflare D1（生产环境）

```bash
# 1. 执行数据库迁移
wrangler d1 migrations apply profile-db --remote

# 2. 验证迁移
wrangler d1 execute profile-db --remote --command "SELECT * FROM Profile LIMIT 1"
```

### SQLite（本地开发）

如果你在本地使用 SQLite 进行开发：

```bash
# 1. 备份数据库
cp prisma/dev.db prisma/dev.db.backup

# 2. 执行迁移脚本
sqlite3 prisma/dev.db < migrations/0003_update_schema.sql

# 3. 验证
sqlite3 prisma/dev.db "SELECT name, gender FROM Profile LIMIT 1;"
```

## 迁移文件

迁移脚本位于：`migrations/0003_update_schema.sql`

该脚本会：
1. 创建新表结构（包含 gender 字段，不包含 linkedin 和 blog）
2. 迁移现有数据（gender 默认为 '男'）
3. 删除旧表
4. 重命名新表
5. 重建索引

## 验证迁移

### 检查表结构

```bash
# Cloudflare D1
wrangler d1 execute profile-db --remote --command "PRAGMA table_info(Profile)"

# 本地 SQLite
sqlite3 prisma/dev.db "PRAGMA table_info(Profile);"
```

应该看到：
- ✅ `gender` 字段存在
- ❌ `linkedin` 字段已移除
- ❌ `blog` 字段已移除

### 检查现有数据

```bash
# Cloudflare D1
wrangler d1 execute profile-db --remote --command "SELECT userId, name, gender FROM Profile"

# 本地 SQLite
sqlite3 prisma/dev.db "SELECT userId, name, gender FROM Profile;"
```

所有记录的 `gender` 应该默认为 '男'。

## 数据修复（如果需要）

如果需要更新现有记录的性别：

```sql
-- 更新特定用户的性别
UPDATE Profile SET gender = '女' WHERE userId = 'user-id';

-- 批量更新
UPDATE Profile SET gender = '女' WHERE userId IN ('user1', 'user2');
```

## 前端更新内容

### 1. TypeScript 类型

- `Skill` 接口简化：仅保留 `name` 字段
- `ProfileData` 接口：
  - 添加 `gender: string` （必填）
  - 移除 `linkedin?: string`
  - 移除 `blog?: string`

### 2. 表单组件更新

- 添加性别选择器（必选）
- 移除 LinkedIn 输入框
- 移除博客输入框
- 技能改为标签输入（Select mode="tags"）

### 3. 显示组件更新

- 布局改为全上下结构（移除左右分栏）
- 添加性别图标显示
- 技能以标签形式展示
- 优化 A4 打印布局

## 注意事项

1. **数据备份**：在执行迁移前，请先备份数据库
2. **线上迁移**：建议在低峰期执行线上迁移
3. **回滚计划**：保留备份以便需要时回滚
4. **前后端同步**：确保前端代码和数据库迁移同时部署

## 回滚方案

如果需要回滚，可以：

1. 恢复数据库备份
2. 或者创建反向迁移脚本（添加 linkedin 和 blog，移除 gender）

```sql
-- 回滚脚本示例（需要根据实际情况调整）
ALTER TABLE Profile ADD COLUMN linkedin TEXT;
ALTER TABLE Profile ADD COLUMN blog TEXT;
-- SQLite 不支持直接 DROP COLUMN，需要重建表
```

## 完成检查清单

- [ ] 数据库已备份
- [ ] 迁移脚本已执行
- [ ] 表结构验证通过
- [ ] 现有数据检查正常
- [ ] 前端代码已部署
- [ ] 创建/编辑功能测试通过
- [ ] 显示功能测试通过
- [ ] PDF 导出测试通过

---

**迁移时间：** 2025-11-28  
**迁移文件：** migrations/0003_update_schema.sql  
**影响范围：** Profile 表结构、前端表单、显示组件
