# 本地开发配置完成 ✅

## 已完成的修改

### 1. 创建了 API 工具函数
**文件**: `src/lib/api.ts`

统一管理所有 API 调用，支持通过环境变量切换本地/生产环境：
- 自动添加 `Content-Type: application/json` 请求头
- 支持环境变量 `NEXT_PUBLIC_API_BASE_URL` 配置
- 提供 `fetchAPI`, `apiGet`, `apiPost`, `apiPut`, `apiDelete` 等便捷方法

### 2. 更新了所有页面
**文件**: 
- `src/app/page.tsx` - 首页
- `src/app/edit/page.tsx` - 创建简历页
- `src/app/edit/[id]/page.tsx` - 编辑简历页
- `src/app/profile/[id]/page.tsx` - 简历详情页

**改动**:
- 使用 `fetchAPI` 替代原生 `fetch`
- 使用 `App.useApp()` hook 获取 message API，避免静态方法警告

### 3. 更新了 Layout
**文件**: `src/app/layout.tsx`

添加了 `<App>` 组件包装，解决 Antd 静态方法无法获取 context 的警告。

### 4. 配置环境变量
**文件**: 
- `.env.local` - 本地开发环境配置（已配置生产 API）
- `.env.example` - 环境变量示例模板

当前配置为直连生产环境 API：
```env
NEXT_PUBLIC_API_BASE_URL=https://velen-profile.pages.dev
```

### 5. 创建了文档
**文件**: `docs/LOCAL_DEV_PRODUCTION_API.md`

详细说明了配置方法和原理。

## 使用方法

### 方式 1: 直连生产环境 API（当前配置）

当前 `.env.local` 已配置为直连生产环境，无需修改，直接运行：

```bash
npm run dev
```

打开 http://localhost:3000，所有 API 请求会发送到 `https://velen-profile.pages.dev`

### 方式 2: 使用本地 API

如果需要使用本地 API（需要本地数据库），编辑 `.env.local`：

```env
# 注释掉这一行
# NEXT_PUBLIC_API_BASE_URL=https://velen-profile.pages.dev
```

然后重启开发服务器。

## 验证配置

打开浏览器控制台，查看网络请求：
- ✅ 请求地址是 `https://velen-profile.pages.dev/api/profile` → 使用生产环境 API
- ℹ️ 请求地址是 `http://localhost:3000/api/profile` → 使用本地 API

控制台日志也会显示：
```
[API] Fetching: https://velen-profile.pages.dev/api/profile
```

## 解决的问题

### ✅ 问题 1: 500 Internal Server Error
**原因**: 本地 API 无法连接数据库  
**解决**: 通过 `NEXT_PUBLIC_API_BASE_URL` 直连生产环境 API

### ✅ 问题 2: Antd 警告 - Static function can not consume context
**原因**: 直接使用 `message.error()` 等静态方法  
**解决**: 
1. Layout 中包装 `<App>` 组件
2. 使用 `App.useApp()` hook 获取 message API

### ✅ 问题 3: Antd 兼容性警告
这个警告是 Antd v5 对 React 19 的兼容性提示，不影响功能，可以忽略。

## 下一步

现在你可以：
1. ✅ 在本地开发时直接使用生产环境数据
2. ✅ 无需在本地配置数据库
3. ✅ 快速测试和调试前端功能

如需切换回本地 API，只需注释 `.env.local` 中的 `NEXT_PUBLIC_API_BASE_URL` 并重启服务器。

---

📚 详细文档请参考: [docs/LOCAL_DEV_PRODUCTION_API.md](./docs/LOCAL_DEV_PRODUCTION_API.md)
