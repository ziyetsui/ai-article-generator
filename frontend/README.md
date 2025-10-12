# 前端应用

基于 React + TypeScript 的现代化单页应用，提供直观的文章创作和优化体验。

## ✨ 功能特性

### 页面 1: 灵感输入页 (`/`)
- **布局**: 25% 左侧输入区 + 75% 右侧预览区
- **功能**: 
  - 多行文本输入
  - 实时输入验证
  - Loading 状态显示
  - 自动导航到下一页

### 页面 2: 文章优化页 (`/optimize`)
- **布局**: 30% 左侧工具栏 + 70% 右侧预览区
- **三步优化流程**:
  1. 生成标题 - 10个爆款标题可选
  2. 一键排版 - 按徐子叶风格格式化
  3. 发布公众号 - 一键发布（模拟）

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

应用将在 `http://localhost:3000` 启动

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `build/` 目录

## 📁 项目结构

```
src/
├── pages/
│   ├── InspirationPage/
│   │   ├── InspirationPage.tsx        # 灵感输入页组件
│   │   └── InspirationPage.module.css # 页面样式
│   └── OptimizePage/
│       ├── OptimizePage.tsx           # 文章优化页组件
│       └── OptimizePage.module.css    # 页面样式
├── services/
│   └── api.ts                         # API 服务封装
├── App.tsx                            # 根组件（路由配置）
├── index.tsx                          # 应用入口
└── index.css                          # 全局样式
```

## 🎨 设计系统

### 色彩方案

```css
/* 主色调 */
--primary: #FF6827;      /* 橙色 - 主要按钮和强调 */
--primary-hover: #E55A1F; /* 橙色悬停态 */
--success: #4CAF50;      /* 绿色 - 发布按钮 */

/* 中性色 */
--background: #F2F2F2;   /* 页面背景 */
--surface: #FFFFFF;      /* 卡片/面板背景 */
--text-primary: #1A1A1A; /* 主要文本 */
--text-secondary: #666666; /* 次要文本 */
--border: #E0E0E0;       /* 边框颜色 */

/* 状态色 */
--error: #E53E3E;        /* 错误提示 */
--warning: #FFF8F0;      /* 警告背景 */
```

### 布局规范

#### 灵感输入页
```
┌─────────────────────────────────────────┐
│ [25% 左侧输入]  │  [75% 右侧预览]      │
│                 │                        │
│  标题           │   预览区域            │
│  文本框         │   (空态/加载态)       │
│  生成按钮       │                        │
│  使用提示       │                        │
└─────────────────────────────────────────┘
```

#### 文章优化页
```
┌─────────────────────────────────────────┐
│ [30% 工具栏]    │  [70% 预览]          │
│                 │                        │
│  1⃣ 生成标题    │   文章标题            │
│  2⃣ 一键排版    │   文章内容预览        │
│  3⃣ 发布公众号  │   (文本/HTML)         │
└─────────────────────────────────────────┘
```

## 🔌 API 集成

### API 服务 (`services/api.ts`)

所有 API 调用都通过统一的服务层：

```typescript
import { api } from './services/api';

// 生成文章
const response = await api.generateArticle(inspiration);

// 生成标题
const response = await api.generateTitles(articleSummary);

// 格式化文章
const response = await api.formatArticle(title, content, previousNumber);

// 发布至微信
const response = await api.publishToWeChat(title, content_html, author);
```

### 环境变量配置

创建 `.env` 文件：

```env
REACT_APP_API_URL=http://localhost:5000
```

生产环境：

```env
REACT_APP_API_URL=https://your-api-domain.com
```

## 🎯 核心组件说明

### InspirationPage

**状态管理:**
- `inspiration` - 用户输入的灵感文本
- `isLoading` - 生成中状态
- `error` - 错误信息

**关键功能:**
- 输入验证
- API 调用
- 状态转场导航

**代码示例:**
```typescript
const handleGenerate = async () => {
  const response = await api.generateArticle(inspiration);
  navigate('/optimize', { 
    state: { 
      article: response.article,
      originalInspiration: inspiration 
    } 
  });
};
```

### OptimizePage

**状态管理:**
- `article` - 文章内容
- `selectedTitle` - 选中的标题
- `titles` - 标题列表
- `formattedHtml` - 格式化后的 HTML
- 各种 loading 状态

**交互流程:**
```
生成标题 → 选择标题 → 一键排版 → 发布公众号
   ↓           ↓          ↓          ↓
 启用      启用排版   启用发布   打开新窗口
```

## 🎭 样式架构

### CSS Modules

每个页面使用独立的 CSS Module，避免样式冲突：

```tsx
import styles from './InspirationPage.module.css';

<div className={styles.container}>
  <button className={styles.generateButton}>
    生成
  </button>
</div>
```

### 响应式设计

```css
/* 桌面 (默认) */
.leftColumn { width: 25%; }
.rightColumn { width: 75%; }

/* 平板 */
@media (max-width: 1024px) {
  .leftColumn { width: 35%; }
  .rightColumn { width: 65%; }
}

/* 手机 */
@media (max-width: 768px) {
  .container { flex-direction: column; }
  .leftColumn, .rightColumn { width: 100%; }
}
```

## 🔍 状态管理模式

使用 React Router 的 `location.state` 在页面间传递数据：

```typescript
// 发送页面
navigate('/optimize', { 
  state: { 
    article: generatedArticle,
    originalInspiration: userInput 
  } 
});

// 接收页面
const location = useLocation();
const { article, originalInspiration } = location.state;
```

## ⚡ 性能优化

1. **代码分割**: React.lazy 和 Suspense 实现路由级代码分割
2. **图片优化**: 使用 WebP 格式和懒加载
3. **避免重渲染**: 使用 React.memo 和 useMemo
4. **API 去抖动**: 防止频繁调用 API

示例：

```typescript
const debouncedSearch = useMemo(
  () => debounce(handleSearch, 500),
  []
);
```

## 🧪 测试

```bash
# 运行测试
npm test

# 测试覆盖率
npm test -- --coverage
```

## 🚀 部署

### Vercel 部署

```bash
npm install -g vercel
vercel --prod
```

### Netlify 部署

1. 构建项目: `npm run build`
2. 将 `build/` 目录拖到 Netlify
3. 配置环境变量

### Nginx 部署

```nginx
server {
  listen 80;
  server_name your-domain.com;
  root /path/to/build;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## 📱 浏览器支持

- Chrome (最新 2 个版本)
- Firefox (最新 2 个版本)
- Safari (最新 2 个版本)
- Edge (最新 2 个版本)

## 🐛 常见问题

### API 请求失败

**问题**: 无法连接到后端 API

**解决**:
1. 确保后端服务已启动
2. 检查 `.env` 中的 `REACT_APP_API_URL`
3. 检查 CORS 配置

### 路由刷新 404

**问题**: 刷新页面时出现 404

**解决**: 配置服务器重定向所有请求到 `index.html`

### 样式不生效

**问题**: CSS 样式未正确应用

**解决**:
1. 确认使用 `.module.css` 后缀
2. 检查 import 语句
3. 清除构建缓存: `rm -rf node_modules/.cache`

## 🔧 开发工具

推荐使用的 VSCode 扩展:
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- CSS Modules

## 📝 代码规范

- 使用 TypeScript 严格模式
- 遵循 Airbnb React 代码规范
- 组件名使用 PascalCase
- 函数使用 camelCase
- 常量使用 UPPER_CASE

## 🤝 贡献

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

ISC

