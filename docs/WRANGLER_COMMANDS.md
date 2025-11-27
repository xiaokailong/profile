# Wrangler 命令快捷方式 - 忽略 SSL 证书

## 问题
在企业网络或某些环境下，wrangler 会遇到 SSL 证书验证错误：
```
Error: unable to get local issuer certificate
UNABLE_TO_GET_ISSUER_CERT_LOCALLY
```

## 解决方案

### PowerShell (Windows)
在命令前添加环境变量设置：
```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"; npx wrangler [your-command]
```

### Bash/Zsh (Linux/Mac)
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npx wrangler [your-command]
```

## 常用命令

### 1. 执行数据库迁移
```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"; npx wrangler d1 execute profile-db --remote --file=./migrations/xxxx.sql
```

### 2. 执行 SQL 查询
```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"; npx wrangler d1 execute profile-db --remote --command="SELECT * FROM Profile LIMIT 5;"
```

### 3. 查看表结构
```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"; npx wrangler d1 execute profile-db --remote --command="PRAGMA table_info(Profile);"
```

### 4. 列出所有 D1 数据库
```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"; npx wrangler d1 list
```

### 5. 部署 Pages
```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"; npx wrangler pages deploy .next
```

### 6. 查看实时日志
```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"; npx wrangler pages deployment tail
```

## 永久设置（不推荐）

如果经常使用，可以在 PowerShell 配置文件中永久设置：

```powershell
# 编辑配置文件
notepad $PROFILE

# 添加以下内容
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"
```

**注意**：这会降低安全性，只在必要时使用。

## 别名设置（推荐）

在 PowerShell 配置文件中创建别名：

```powershell
# 编辑配置文件
notepad $PROFILE

# 添加函数别名
function wrangler-ssl {
    $env:NODE_TLS_REJECT_UNAUTHORIZED="0"
    npx wrangler $args
}

# 使用别名
wrangler-ssl d1 execute profile-db --remote --command="SELECT * FROM Profile;"
```

## 安全说明

⚠️ **警告**：设置 `NODE_TLS_REJECT_UNAUTHORIZED=0` 会禁用 SSL 证书验证，这会使连接不安全。

**仅在以下情况使用**：
- 企业内网环境
- 自签名证书环境
- 开发和测试环境

**不要在以下情况使用**：
- 生产环境
- 处理敏感数据时
- 公共网络

## 替代方案

### 1. 安装企业证书
联系 IT 部门获取并安装企业根证书。

### 2. 配置代理
```powershell
$env:HTTP_PROXY="http://proxy:port"
$env:HTTPS_PROXY="http://proxy:port"
```

### 3. 使用 VPN
连接到公司 VPN 可能会解决证书问题。

## 已验证命令记录

### 成功执行的迁移（2025-11-27）
```powershell
# 迁移：添加 userId 字段
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"; npx wrangler d1 execute profile-db --remote --file=./migrations/0002_add_user_id.sql
# ✅ 成功：5 queries executed, 51 rows read, 17 rows written

# 验证数据
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"; npx wrangler d1 execute profile-db --remote --command="SELECT id, userId, name, email FROM Profile LIMIT 5;"
# ✅ 成功：显示了迁移后的数据结构

# 查看表结构
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"; npx wrangler d1 execute profile-db --remote --command="PRAGMA table_info(Profile);"
# ✅ 成功：确认 id 为 INTEGER AUTOINCREMENT，userId 为 TEXT UNIQUE
```

## 快速参考

**数据库相关：**
```powershell
# 前缀
$prefix = '$env:NODE_TLS_REJECT_UNAUTHORIZED="0"; npx wrangler d1 execute profile-db --remote'

# 执行文件
$prefix --file=./migrations/xxxx.sql

# 执行命令
$prefix --command="YOUR SQL HERE"
```

保存此文档到项目根目录，以便快速查找命令！
