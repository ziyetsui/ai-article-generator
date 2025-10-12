# 项目结构说明

## 📂 完整目录树

```
未命名文件夹/                           # 项目根目录
│
├── 📄 README.md                        # 项目主文档
├── 📄 SETUP.md                         # 快速安装指南
├── 📄 FEATURES.md                      # 功能特性清单
├── 📄 ARCHITECTURE.md                  # 系统架构文档
├── 📄 PROJECT_STRUCTURE.md             # 本文件
├── 📄 .gitignore                       # Git 忽略配置
├── 📄 package.json                     # 根目录脚本
├── 🔧 start.sh                         # macOS/Linux 启动脚本
└── 🔧 start.bat                        # Windows 启动脚本
│
├── 📁 backend/                         # 后端服务目录
│   ├── 📄 server.js                   # Express 服务器主文件
│   ├── 📄 package.json                # 后端依赖配置
│   ├── 📄 README.md                   # 后端文档
│   ├── 📄 env-template.txt            # 环境变量模板
│   └── 📄 .env                        # 环境变量文件（需创建）
│
└── 📁 frontend/                        # 前端应用目录
    ├── 📄 package.json                # 前端依赖配置
    ├── 📄 tsconfig.json               # TypeScript 配置
    ├── 📄 README.md                   # 前端文档
    │
    ├── 📁 public/                     # 静态资源目录
    │   └── 📄 index.html              # HTML 模板
    │
    └── 📁 src/                        # 源代码目录
        ├── 📄 index.tsx               # 应用入口
        ├── 📄 index.css               # 全局样式
        ├── 📄 App.tsx                 # 根组件（路由）
        ├── 📄 react-app-env.d.ts      # React 类型定义
        │
        ├── 📁 services/               # 服务层
        │   └── 📄 api.ts              # API 服务封装
        │
        └── 📁 pages/                  # 页面组件
            ├── 📁 InspirationPage/    # 灵感输入页
            │   ├── 📄 InspirationPage.tsx
            │   └── 📄 InspirationPage.module.css
            │
            └── 📁 OptimizePage/       # 文章优化页
                ├── 📄 OptimizePage.tsx
                └── 📄 OptimizePage.module.css
```

---

## 📝 文件说明

### 根目录文件

| 文件名 | 说明 | 用途 |
|--------|------|------|
| `README.md` | 项目主文档 | 项目介绍、功能说明、安装指南 |
| `SETUP.md` | 快速安装指南 | 5分钟快速启动教程 |
| `FEATURES.md` | 功能清单 | 已实现功能和待开发功能列表 |
| `ARCHITECTURE.md` | 架构文档 | 系统设计、数据流、API 契约 |
| `PROJECT_STRUCTURE.md` | 本文件 | 项目结构和文件说明 |
| `.gitignore` | Git 忽略 | 配置不提交的文件（node_modules、.env等） |
| `package.json` | 根配置 | 快捷脚本（一键安装、启动等） |
| `start.sh` | 启动脚本 | macOS/Linux 一键启动 |
| `start.bat` | 启动脚本 | Windows 一键启动 |

### 后端文件

| 文件名 | 说明 | 关键功能 |
|--------|------|----------|
| `server.js` | 主服务器文件 | Express 服务、API 路由、Gemini 集成 |
| `package.json` | 依赖配置 | Express、Gemini AI、CORS 等依赖 |
| `README.md` | 后端文档 | API 文档、部署指南 |
| `env-template.txt` | 环境变量模板 | GEMINI_API_KEY、PORT 等配置 |
| `.env` | 环境变量 | 实际的 API Key（需创建，不提交） |

**后端核心代码:**
```javascript
// server.js 核心部分
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 初始化 Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// API 路由
app.post('/api/generate/article', async (req, res) => { ... });
app.post('/api/generate/titles', async (req, res) => { ... });
app.post('/api/format/article', async (req, res) => { ... });
app.post('/api/wechat/publish', async (req, res) => { ... });
```

### 前端文件

#### 配置文件

| 文件名 | 说明 | 用途 |
|--------|------|------|
| `package.json` | 前端依赖 | React、React Router、TypeScript |
| `tsconfig.json` | TypeScript 配置 | 编译选项、严格模式 |
| `README.md` | 前端文档 | 组件说明、开发指南 |

#### 静态资源

| 文件名 | 说明 | 用途 |
|--------|------|------|
| `public/index.html` | HTML 模板 | SPA 入口、meta 标签 |

#### 源代码

| 文件名 | 说明 | 职责 |
|--------|------|------|
| `index.tsx` | 应用入口 | React 渲染、挂载根组件 |
| `index.css` | 全局样式 | 重置样式、全局变量 |
| `App.tsx` | 根组件 | 路由配置、页面导航 |
| `react-app-env.d.ts` | 类型定义 | React 类型支持 |

**App.tsx 路由配置:**
```typescript
<Router>
  <Routes>
    <Route path="/" element={<InspirationPage />} />
    <Route path="/optimize" element={<OptimizePage />} />
  </Routes>
</Router>
```

#### 服务层

| 文件名 | 说明 | 职责 |
|--------|------|------|
| `services/api.ts` | API 服务 | 封装所有后端 API 调用 |

**API 服务接口:**
```typescript
export const api = {
  generateArticle(inspiration: string): Promise<...>,
  generateTitles(articleSummary: string): Promise<...>,
  formatArticle(title, content, previousNumber): Promise<...>,
  publishToWeChat(title, content_html, author): Promise<...>
};
```

#### 页面组件

##### InspirationPage（灵感输入页）

| 文件名 | 说明 | 行数 | 主要功能 |
|--------|------|------|----------|
| `InspirationPage.tsx` | 组件逻辑 | ~100 | 输入处理、API 调用、导航 |
| `InspirationPage.module.css` | 组件样式 | ~200 | 布局、动画、响应式 |

**组件结构:**
```tsx
<div className={styles.container}>
  {/* 左侧 25% - 输入区 */}
  <div className={styles.leftColumn}>
    <textarea value={inspiration} onChange={...} />
    <button onClick={handleGenerate}>生成</button>
  </div>
  
  {/* 右侧 75% - 预览区 */}
  <div className={styles.rightColumn}>
    {isLoading ? <LoadingState /> : <EmptyState />}
  </div>
</div>
```

**状态管理:**
- `inspiration` - 用户输入
- `isLoading` - 生成状态
- `error` - 错误信息

##### OptimizePage（文章优化页）

| 文件名 | 说明 | 行数 | 主要功能 |
|--------|------|------|----------|
| `OptimizePage.tsx` | 组件逻辑 | ~250 | 标题生成、排版、发布 |
| `OptimizePage.module.css` | 组件样式 | ~350 | 工具栏、预览、交互 |

**组件结构:**
```tsx
<div className={styles.container}>
  {/* 左侧 30% - 工具栏 */}
  <div className={styles.leftColumn}>
    <Step1>生成标题</Step1>
    <Step2>一键排版</Step2>
    <Step3>发布公众号</Step3>
  </div>
  
  {/* 右侧 70% - 预览 */}
  <div className={styles.rightColumn}>
    {isHtmlContent ? 
      <HtmlPreview /> : 
      <TextPreview />
    }
  </div>
</div>
```

**状态管理:**
- `article` - 文章内容
- `selectedTitle` - 选中的标题
- `titles` - 标题列表
- `formattedHtml` - 格式化的 HTML
- 各种 loading 状态

---

## 🔄 数据流向

### 1. 文章生成流程

```
用户输入 (InspirationPage)
  ↓
api.generateArticle()
  ↓
POST /api/generate/article
  ↓
Gemini API (Article Prompt)
  ↓
返回生成的文章
  ↓
navigate('/optimize', { state: { article } })
  ↓
OptimizePage 接收并显示
```

### 2. 标题生成流程

```
点击"生成标题" (OptimizePage)
  ↓
api.generateTitles(articleSummary)
  ↓
POST /api/generate/titles
  ↓
Gemini API (Title Prompt)
  ↓
返回 10 个标题
  ↓
显示标题卡片列表
  ↓
用户点击选择
  ↓
setSelectedTitle(title)
```

### 3. 排版流程

```
点击"一键排版" (OptimizePage)
  ↓
api.formatArticle(title, content, previousNumber)
  ↓
POST /api/format/article
  ↓
Gemini API (Formatting Prompt)
  ↓
返回格式化的 HTML
  ↓
setFormattedHtml(html)
  ↓
预览区显示 HTML
```

### 4. 发布流程

```
点击"发布至公众号" (OptimizePage)
  ↓
api.publishToWeChat(title, content_html, author)
  ↓
POST /api/wechat/publish
  ↓
WeChat API (模拟)
  ↓
返回发布 URL
  ↓
window.open(publishUrl, '_blank')
```

---

## 📦 依赖关系图

### 后端依赖树

```
backend/
├── express@4.21.1                    # Web 框架
├── @google/generative-ai@0.21.0     # Gemini AI SDK
├── cors@2.8.5                        # CORS 中间件
├── dotenv@16.4.5                     # 环境变量
└── nodemon@3.1.7 (dev)              # 开发热重载
```

### 前端依赖树

```
frontend/
├── react@18.3.1                      # UI 框架
├── react-dom@18.3.1                  # DOM 渲染
├── react-router-dom@6.28.0           # 路由管理
├── typescript@4.9.5                  # 类型系统
├── @types/react@18.3.12             # React 类型
├── @types/react-dom@18.3.1          # ReactDOM 类型
└── react-scripts@5.0.1               # 构建工具
    ├── webpack                       # 打包工具
    ├── babel                         # 编译器
    └── eslint                        # 代码检查
```

---

## 🎯 代码统计

### 代码行数统计

| 类型 | 文件数 | 代码行数 | 说明 |
|------|--------|----------|------|
| **后端** | | | |
| JavaScript | 1 | ~500 | server.js |
| **前端** | | | |
| TypeScript | 4 | ~600 | 页面组件 + 服务 |
| CSS Modules | 2 | ~550 | 页面样式 |
| **配置** | | | |
| JSON | 5 | ~150 | package.json, tsconfig.json |
| **文档** | | | |
| Markdown | 7 | ~2000 | README, SETUP, 等 |
| **总计** | 19 | ~3800 | 生产代码 + 文档 |

### 文件大小统计

```
backend/
├── server.js              ~15 KB
├── package.json          ~0.5 KB
└── README.md             ~8 KB

frontend/
├── src/
│   ├── pages/            ~25 KB (TSX)
│   ├── services/         ~3 KB (TS)
│   └── styles/           ~15 KB (CSS)
├── package.json          ~0.6 KB
└── README.md             ~12 KB

docs/
└── *.md                  ~50 KB

总计: ~130 KB (未压缩代码)
```

---

## 🔍 关键文件深度解析

### server.js (后端核心)

**结构:**
```javascript
1. 依赖导入 (Lines 1-5)
2. 环境配置 (Lines 7-15)
3. AI 提示词定义 (Lines 17-150)
4. API 路由实现 (Lines 152-350)
5. 辅助函数 (Lines 352-400)
6. 服务器启动 (Lines 402-408)
```

**核心函数:**
- `POST /api/generate/article` - 文章生成 (~50 lines)
- `POST /api/generate/titles` - 标题生成 (~45 lines)
- `POST /api/format/article` - 文章排版 (~55 lines)
- `POST /api/wechat/publish` - 微信发布 (~40 lines)
- `parseTitles()` - 标题解析 (~25 lines)

### InspirationPage.tsx (灵感输入页)

**结构:**
```typescript
1. 导入和类型定义 (Lines 1-5)
2. 状态初始化 (Lines 8-12)
3. 事件处理函数 (Lines 14-40)
4. JSX 渲染 (Lines 42-90)
```

**关键逻辑:**
- `handleGenerate()` - 调用 API 并导航
- 输入验证和错误处理
- Loading 状态管理

### OptimizePage.tsx (文章优化页)

**结构:**
```typescript
1. 导入和类型定义 (Lines 1-10)
2. 状态初始化 (Lines 14-25)
3. Effect Hook (Lines 27-33)
4. 事件处理函数 (Lines 35-120)
5. JSX 渲染 (Lines 122-250)
```

**关键逻辑:**
- `handleGenerateTitles()` - 标题生成
- `handleTitleSelect()` - 标题选择
- `handleFormatArticle()` - 文章排版
- `handlePublish()` - 发布处理
- 渐进式按钮启用逻辑

---

## 🛠 开发工作流

### 本地开发

```bash
# 1. 安装依赖
npm run install-all    # 或分别 cd backend && npm install

# 2. 配置环境
cp backend/env-template.txt backend/.env
# 编辑 .env 文件，填入 GEMINI_API_KEY

# 3. 启动服务（两种方式）

# 方式 A: 使用启动脚本（推荐）
./start.sh              # macOS/Linux
start.bat               # Windows

# 方式 B: 手动启动
# 终端 1
cd backend && npm run dev

# 终端 2
cd frontend && npm start
```

### 生产构建

```bash
# 后端
cd backend
npm start

# 前端
cd frontend
npm run build
# 输出目录: build/
```

### 代码规范

```bash
# 类型检查
cd frontend
npx tsc --noEmit

# 代码格式化（如安装 Prettier）
npx prettier --write "src/**/*.{ts,tsx,css}"

# 代码检查（如安装 ESLint）
npx eslint src/
```

---

## 📚 学习路径建议

### 新手入门顺序

1. **阅读文档** (30 分钟)
   - `README.md` - 了解项目概况
   - `SETUP.md` - 快速上手

2. **运行项目** (10 分钟)
   - 配置环境变量
   - 启动前后端服务
   - 测试基本功能

3. **理解架构** (1 小时)
   - `ARCHITECTURE.md` - 系统设计
   - `PROJECT_STRUCTURE.md` (本文件) - 代码组织

4. **阅读代码** (2-3 小时)
   - `backend/server.js` - 后端逻辑
   - `frontend/src/App.tsx` - 路由配置
   - `frontend/src/pages/` - 页面组件

5. **修改和实验** (自由探索)
   - 修改 AI 提示词
   - 调整 UI 样式
   - 添加新功能

### 进阶学习

1. **集成真实微信 API**
   - 阅读微信公众平台文档
   - 实现 OAuth 认证
   - 完成发布功能

2. **添加数据持久化**
   - 引入 MongoDB/PostgreSQL
   - 设计数据模型
   - 实现 CRUD 操作

3. **性能优化**
   - 添加 Redis 缓存
   - 实现 API 速率限制
   - 优化前端打包体积

---

## 🎓 最佳实践

### 代码组织
✅ 按功能模块分目录（pages, services）
✅ 使用 CSS Modules 避免样式冲突
✅ TypeScript 提供类型安全
✅ API 服务统一封装在 services 层

### 状态管理
✅ 使用 React Hooks (useState, useEffect)
✅ 通过 Router State 传递页面间数据
✅ 避免不必要的全局状态

### 样式管理
✅ CSS Modules 组件级样式
✅ 响应式设计（移动优先）
✅ CSS 变量统一主题色
✅ 语义化类名

### 错误处理
✅ API 调用包裹 try-catch
✅ 统一错误格式
✅ 用户友好的错误提示
✅ 后端不暴露敏感信息

---

**文档版本:** 1.0.0  
**最后更新:** 2025-10-12  
**维护者:** 徐子叶

