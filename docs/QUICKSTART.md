# 快速开始指南

欢迎使用个人简历管理系统！这是一个 5 分钟快速上手指南。

## 🚀 立即开始

### 步骤 1: 安装依赖（1分钟）

```bash
npm install --legacy-peer-deps
```

### 步骤 2: 配置数据库（2分钟）

#### 选项 A: 使用 Neon（推荐，免费）

1. 访问 https://neon.tech
2. 注册并创建项目
3. 复制连接字符串

#### 选项 B: 使用本地 PostgreSQL

如果已安装 PostgreSQL：

```bash
# 默认本地连接
DATABASE_URL="postgresql://postgres:password@localhost:5432/profile"
```

### 步骤 3: 配置环境变量（30秒）

```bash
# 编辑 .env 文件
DATABASE_URL="你的数据库连接字符串"
```

### 步骤 4: 初始化数据库（1分钟）

```bash
npm run db:generate
npm run db:push
```

### 步骤 5: 启动应用（30秒）

```bash
npm run dev
```

访问 http://localhost:3000 🎉

## ✨ 首次使用

1. **创建个人信息**
   - 打开应用后，点击"创建个人信息"
   - 填写基本信息（姓名、职位、邮箱等）

2. **添加工作经历**
   - 点击"添加工作经历"
   - 填写公司、职位、时间等信息
   - 添加技术栈和成就

3. **添加技能**
   - 点击"添加技能"
   - 选择分类（前端/后端/数据库等）
   - 设置熟练度（1-5）

4. **保存**
   - 点击"保存"按钮
   - 查看精美的简历展示

5. **导出PDF**
   - 点击"导出PDF"或"预览PDF"
   - 下载你的专业简历

## 📝 示例数据（可选）

想要快速查看效果？导入示例数据：

```bash
npx tsx prisma/seed.ts
```

这将创建一个完整的示例简历，包含：
- 基本信息
- 技能（10+）
- 工作经历（2个）
- 项目经验（2个）
- 教育背景
- 证书
- 语言能力

## 🎨 自定义主题

在 `src/app/layout.tsx` 中修改：

```tsx
<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#1890ff', // 改成你喜欢的颜色
      borderRadius: 8,
    },
  }}
>
```

## 🔧 常用命令

```bash
# 开发服务器
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm start

# 数据库管理界面
npm run db:studio

# 更新数据库结构
npm run db:push
```

## 📱 功能预览

### 个人信息展示
- ✅ 渐变色头部
- ✅ 头像展示
- ✅ 社交链接（GitHub、LinkedIn等）
- ✅ 技能进度条
- ✅ 时间线展示经历
- ✅ 响应式布局

### 编辑功能
- ✅ 动态表单
- ✅ 日期选择器
- ✅ 标签输入
- ✅ 实时保存
- ✅ 表单验证

### PDF导出
- ✅ 一键导出
- ✅ PDF预览
- ✅ 多页支持
- ✅ 专业排版

## 🚨 遇到问题？

### 依赖安装失败
```bash
npm install --legacy-peer-deps --force
```

### 数据库连接失败
检查 `.env` 文件中的 `DATABASE_URL` 是否正确。

### 端口被占用
```bash
# 使用其他端口
npm run dev -- -p 3001
```

### Prisma 错误
```bash
# 重新生成客户端
npm run db:generate
```

## 📚 更多资源

- 📖 [开发指南](./DEVELOPMENT.md) - 详细的开发文档
- 🚀 [部署指南](./DEPLOYMENT.md) - Cloudflare Pages 部署教程
- 💡 [README](./README.md) - 项目概述

## 🎯 下一步

- [ ] 填写完整的个人信息
- [ ] 自定义主题颜色
- [ ] 导出第一份PDF简历
- [ ] 部署到 Cloudflare Pages
- [ ] 绑定自定义域名

---

享受使用吧！如有问题，欢迎提 Issue。💪
