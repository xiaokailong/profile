# 富文本编辑器功能

## 更新日期
2025-11-28

## 功能说明
将以下字段升级为富文本编辑器，支持格式化文本输入和显示：

### 已升级字段
1. **个人简介** (summary)
2. **工作描述** (experiences.description)
3. **主要成就** (experiences.achievements) - 从标签数组改为富文本
4. **项目描述** (projects.description)
5. **项目亮点** (projects.highlights)

## 富文本编辑器功能
- **文本格式**：粗体、斜体、下划线
- **列表**：无序列表、有序列表
- **标题**：支持标题和段落格式
- **清除格式**：一键清除所有格式

## 技术实现

### 组件
- `src/components/RichTextEditor.tsx` - 富文本编辑器组件
- `src/components/RichTextEditor.css` - 样式文件

### 特点
- 基于原生 `contentEditable` API
- 轻量级，无需外部依赖
- 与 Ant Design 表单完美集成
- 支持 HTML 格式存储和显示

### 显示样式
使用 `.rich-text-display` CSS 类来渲染富文本内容，确保格式一致。

## 数据迁移

### 类型变更
- `Experience.achievements`: `string[]` → `string` (HTML)

### 迁移脚本
运行 `migrations/0007_rich_text_fields.sql` 可将现有纯文本数据转换为 HTML 格式：
- 纯文本会被包装在 `<p>` 标签中
- 成就数组会转换为 `<ul><li>` 列表

### 兼容性
- 旧数据（纯文本）会自动兼容显示
- 建议运行迁移脚本以获得最佳显示效果

## 使用示例

### 在表单中
```tsx
<Form.Item name="summary" label="个人简介">
  <RichTextEditor placeholder="简要介绍你的背景、专长和职业目标" />
</Form.Item>
```

### 显示富文本
```tsx
<div 
  className="rich-text-display"
  dangerouslySetInnerHTML={{ __html: profile.summary }}
/>
```

## 安全性
- 使用 `dangerouslySetInnerHTML` 渲染 HTML
- 建议在生产环境添加 HTML 清理（如使用 DOMPurify）
- 当前实现适用于受信任的用户输入

## 后续优化建议
1. 添加 HTML 清理库（DOMPurify）防止 XSS
2. 添加图片上传功能
3. 添加链接插入功能
4. 添加代码块支持
5. 添加撤销/重做功能
