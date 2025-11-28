# 本地开发直连生产环境 API 配置说明

## 问题描述

在本地开发时，如果想直接连接生产环境的 API 而不是使用本地 API，可以通过环境变量配置实现。

## 解决方案

### 1. 环境变量配置

在项目根目录创建 `.env.local` 文件（已包含在 `.gitignore` 中，不会被提交到 Git）：

```env
# 生产环境 API URL
NEXT_PUBLIC_API_BASE_URL=https://your-production-domain.pages.dev
```

**重要提示：**
- 将 `https://your-production-domain.pages.dev` 替换为你的实际生产环境域名
- 不要包含末尾的斜杠 `/`
- 如果想切换回本地 API，只需注释掉这一行或删除 `.env.local` 文件

### 2. 代码实现

#### API 工具函数 (`src/lib/api.ts`)

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`[API] Fetching: ${url}`);
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
}
```

#### 页面中使用

```typescript
import { fetchAPI } from '@/lib/api';

// 使用 fetchAPI 替代 fetch
const response = await fetchAPI('/api/profile');
```

### 3. 修复的问题

#### 问题 1: 500 Internal Server Error
- **原因**: 本地 API 路由尝试连接数据库失败
- **解决**: 通过设置 `NEXT_PUBLIC_API_BASE_URL`，所有 API 请求会直接发送到生产环境

#### 问题 2: Antd 警告 - Static function can not consume context
- **原因**: 直接使用 `message.error()` 等静态方法无法获取 context
- **解决**: 
  1. 在 `layout.tsx` 中包装 `<App>` 组件
  2. 在页面中使用 `App.useApp()` hook 获取 message API

```typescript
import { App } from 'antd';

export default function MyPage() {
  const { message } = App.useApp();
  
  // 使用 message API
  message.error('错误信息');
}
```

### 4. 使用方法

#### 本地开发 - 连接生产环境 API

1. 创建 `.env.local` 文件：
```bash
echo "NEXT_PUBLIC_API_BASE_URL=https://your-production-domain.pages.dev" > .env.local
```

2. 重启开发服务器：
```bash
npm run dev
```

3. 现在所有 API 请求都会发送到生产环境

#### 本地开发 - 使用本地 API

1. 删除或注释 `.env.local` 中的 `NEXT_PUBLIC_API_BASE_URL`

2. 确保本地 API 可以连接到数据库

3. 重启开发服务器

### 5. 验证配置

在浏览器控制台中查看日志：
```
[API] Fetching: https://your-production-domain.pages.dev/api/profile
```

如果看到完整的 URL（包含域名），说明正在使用生产环境 API。
如果只看到 `/api/profile`，说明正在使用本地 API。

### 6. 注意事项

1. **环境变量必须以 `NEXT_PUBLIC_` 开头**才能在客户端代码中访问
2. **修改环境变量后必须重启开发服务器**才能生效
3. **`.env.local` 文件不应提交到 Git**，已包含在 `.gitignore` 中
4. **生产环境部署时不需要设置此变量**，会自动使用相对路径

### 7. 相关文件

- `src/lib/api.ts` - API 工具函数
- `src/app/layout.tsx` - 包装 App 组件
- `src/app/page.tsx` - 首页，使用 fetchAPI 和 useApp
- `src/app/edit/page.tsx` - 创建页面
- `src/app/edit/[id]/page.tsx` - 编辑页面
- `src/app/profile/[id]/page.tsx` - 详情页面
- `.env.local` - 本地环境变量（需手动创建）
- `.env.example` - 环境变量示例

## 快速开始

```bash
# 1. 创建本地环境变量文件
cp .env.example .env.local

# 2. 编辑 .env.local，添加生产环境 API URL
# NEXT_PUBLIC_API_BASE_URL=https://your-production-domain.pages.dev

# 3. 重启开发服务器
npm run dev
```

现在你的本地开发环境会直连生产环境的 API！
