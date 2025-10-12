# 系统架构文档

## 📐 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户界面层                             │
│  ┌───────────────────┐         ┌──────────────────────┐    │
│  │  灵感输入页面      │         │  文章优化页面         │    │
│  │  (25% + 75%)      │  ───>  │  (30% + 70%)         │    │
│  │  - 输入框          │         │  - 标题生成           │    │
│  │  - 生成按钮        │         │  - 一键排版           │    │
│  │  - 预览区         │         │  - 发布公众号         │    │
│  └───────────────────┘         └──────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        应用服务层                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Express.js REST API                    │    │
│  │  ┌────────────┐  ┌────────────┐  ┌─────────────┐  │    │
│  │  │ 文章生成    │  │ 标题生成    │  │ 文章排版     │  │    │
│  │  │ Endpoint   │  │ Endpoint   │  │ Endpoint    │  │    │
│  │  └────────────┘  └────────────┘  └─────────────┘  │    │
│  │  ┌────────────────────────────────────────────┐    │    │
│  │  │          微信发布 Endpoint                  │    │    │
│  │  └────────────────────────────────────────────┘    │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        外部服务层                             │
│  ┌─────────────────────┐      ┌──────────────────────┐     │
│  │   Google Gemini AI   │      │  WeChat Official      │     │
│  │   - 文章生成         │      │  Accounts API        │     │
│  │   - 标题生成         │      │  (待实现)            │     │
│  │   - HTML 排版        │      │                      │     │
│  └─────────────────────┘      └──────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 数据流图

### 完整用户流程

```
用户输入灵感
    │
    ▼
[POST /api/generate/article]
    │
    ├─> Gemini API (Article Generation Prompt)
    │
    ▼
生成完整文章
    │
    ▼
导航到优化页面
    │
    ▼
[POST /api/generate/titles]
    │
    ├─> Gemini API (Title Generation Prompt)
    │
    ▼
显示 10 个标题选项
    │
    ▼
用户选择标题
    │
    ▼
[POST /api/format/article]
    │
    ├─> Gemini API (Formatting Prompt)
    │
    ▼
生成格式化的 HTML
    │
    ▼
预览区显示排版后文章
    │
    ▼
[POST /api/wechat/publish]
    │
    ├─> WeChat API (待实现)
    │
    ▼
返回发布 URL
    │
    ▼
新标签页打开公众号
```

## 🎯 核心组件

### 前端组件树

```
App (Router)
│
├─ InspirationPage
│  ├─ InputSection (Left 25%)
│  │  ├─ Textarea
│  │  ├─ GenerateButton
│  │  └─ Tips
│  │
│  └─ PreviewSection (Right 75%)
│     ├─ EmptyState
│     └─ LoadingState
│
└─ OptimizePage
   ├─ Toolbar (Left 30%)
   │  ├─ Step1: GenerateTitles
   │  │  ├─ GenerateButton
   │  │  └─ TitleCards []
   │  │
   │  ├─ Step2: FormatArticle
   │  │  ├─ PreviousNumberInput
   │  │  └─ FormatButton
   │  │
   │  └─ Step3: Publish
   │     └─ PublishButton
   │
   └─ PreviewSection (Right 70%)
      ├─ TextPreview
      └─ HtmlPreview
```

### 后端服务架构

```
server.js
│
├─ Middleware
│  ├─ cors()
│  ├─ express.json()
│  └─ Error Handler
│
├─ AI Prompt Templates
│  ├─ ARTICLE_GENERATION_PROMPT
│  ├─ TITLE_GENERATION_PROMPT
│  └─ FORMATTING_PROMPT
│
├─ API Routes
│  ├─ POST /api/generate/article
│  │  └─> callGeminiAPI()
│  │
│  ├─ POST /api/generate/titles
│  │  └─> callGeminiAPI()
│  │       └─> parseTitles()
│  │
│  ├─ POST /api/format/article
│  │  └─> callGeminiAPI()
│  │       └─> cleanHtml()
│  │
│  └─ POST /api/wechat/publish
│     └─> callWeChatAPI() [TODO]
│
└─ Helper Functions
   ├─ parseTitles()
   └─ cleanHtml()
```

## 🔌 API 契约

### 1. 生成文章 API

**请求:**
```typescript
POST /api/generate/article
{
  inspiration: string  // 用户灵感（必填）
}
```

**响应:**
```typescript
{
  status: "success" | "error",
  article?: string,    // 生成的文章
  message?: string     // 错误信息
}
```

**处理时间:** 20-60 秒

### 2. 生成标题 API

**请求:**
```typescript
POST /api/generate/titles
{
  articleSummary: string  // 文章摘要（必填）
}
```

**响应:**
```typescript
{
  status: "success" | "error",
  titles?: string[],      // 标题数组 (10个)
  rawResponse?: string,   // 完整响应
  message?: string
}
```

**处理时间:** 10-30 秒

### 3. 格式化文章 API

**请求:**
```typescript
POST /api/format/article
{
  title: string,           // 文章标题（必填）
  content: string,         // 文章内容（必填）
  previousNumber?: string  // 上一篇编号（默认 "000"）
}
```

**响应:**
```typescript
{
  status: "success" | "error",
  formattedHtml?: string,  // 格式化的 HTML
  message?: string
}
```

**处理时间:** 15-45 秒

### 4. 发布公众号 API

**请求:**
```typescript
POST /api/wechat/publish
{
  title: string,        // 文章标题（必填）
  content_html: string, // HTML 内容（必填）
  author?: string,      // 作者（默认 "徐子叶"）
  access_token?: string // 微信 token
}
```

**响应:**
```typescript
{
  status: "success" | "error",
  publishUrl?: string,  // 发布后的 URL
  message?: string
}
```

**处理时间:** 2-5 秒

## 🎨 UI/UX 设计原则

### 布局策略

#### 灵感输入页（比例 25:75）
- **左侧 25%**: 输入和控制区域
  - 保持简洁，专注于输入
  - 固定宽度，避免过宽影响可读性
  - 垂直滚动，保持所有控制可见

- **右侧 75%**: 预览和展示区域
  - 宽敞的阅读空间
  - 清晰的空态和加载态
  - 足够的留白提升体验

#### 优化页（比例 30:70）
- **左侧 30%**: 多步骤工具栏
  - 步骤清晰（1️⃣2️⃣3️⃣）
  - 渐进式启用按钮
  - 紧凑但不拥挤

- **右侧 70%**: 文章预览
  - 接近真实公众号阅读体验
  - 支持文本和 HTML 两种模式
  - 响应式字体和间距

### 交互状态管理

```typescript
// 按钮状态流转
INITIAL (可点击)
   ↓ 点击
LOADING (禁用 + 加载动画)
   ↓ 成功
SUCCESS (启用 + 结果展示)
   ↓ 或失败
ERROR (启用 + 错误提示)
```

### 颜色语义

| 颜色 | 用途 | 示例 |
|------|------|------|
| `#FF6827` | 主要操作 | 生成按钮、选中状态 |
| `#4CAF50` | 成功/发布 | 发布按钮 |
| `#E53E3E` | 错误/警告 | 错误提示 |
| `#666666` | 次要文本 | 提示信息 |
| `#F2F2F2` | 背景色 | 页面背景 |
| `#FFFFFF` | 表面色 | 卡片背景 |

## 🔐 安全性设计

### 环境变量隔离

```
开发环境: .env (本地)
  ├─ GEMINI_API_KEY (不提交)
  └─ PORT=5000

生产环境: 云平台环境变量
  ├─ GEMINI_API_KEY (加密存储)
  ├─ ALLOWED_ORIGINS (CORS 白名单)
  └─ NODE_ENV=production
```

### API 安全措施

1. **输入验证**
   ```javascript
   if (!inspiration || inspiration.trim().length === 0) {
     return res.status(400).json({ error: "Invalid input" });
   }
   ```

2. **CORS 配置**
   ```javascript
   app.use(cors({
     origin: process.env.ALLOWED_ORIGINS || '*',
     methods: ['GET', 'POST'],
     credentials: true
   }));
   ```

3. **速率限制** (建议实现)
   ```javascript
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15分钟
     max: 100 // 最多100个请求
   });
   app.use('/api/', limiter);
   ```

4. **错误处理**
   - 不暴露内部错误细节
   - 统一错误格式
   - 日志记录所有异常

## 📊 性能优化策略

### 前端优化

1. **代码分割**
   ```typescript
   const InspirationPage = React.lazy(() => 
     import('./pages/InspirationPage')
   );
   ```

2. **CSS Modules**
   - 避免全局样式污染
   - 自动生成唯一类名
   - 按需加载样式

3. **状态管理**
   - 使用 React Router state 传递数据
   - 避免不必要的全局状态
   - 本地状态优先

### 后端优化

1. **连接复用**
   ```javascript
   // 复用 Gemini AI 客户端
   const genAI = new GoogleGenerativeAI(apiKey);
   const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
   ```

2. **响应压缩**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

3. **缓存策略** (建议实现)
   ```javascript
   // Redis 缓存相似请求
   const cacheKey = `article:${hash(inspiration)}`;
   const cached = await redis.get(cacheKey);
   if (cached) return cached;
   ```

## 🚀 扩展性设计

### 未来功能规划

1. **用户系统**
   ```
   - JWT 认证
   - 用户配置
   - 文章历史
   - 收藏功能
   ```

2. **数据持久化**
   ```
   MongoDB/PostgreSQL
   ├─ users (用户表)
   ├─ articles (文章表)
   ├─ templates (模板表)
   └─ settings (配置表)
   ```

3. **多风格支持**
   ```javascript
   const WRITING_STYLES = {
     liurun: ARTICLE_GENERATION_PROMPT,
     casual: CASUAL_WRITING_PROMPT,
     professional: PROFESSIONAL_WRITING_PROMPT,
     // ...
   };
   ```

4. **图片管理**
   ```
   - 图片上传
   - 压缩优化
   - CDN 集成
   - AI 图片生成
   ```

## 📱 响应式设计

### 断点定义

```css
/* 桌面端 (默认) */
@media (min-width: 1025px) {
  .leftColumn { width: 25%; }
  .rightColumn { width: 75%; }
}

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

## 🔧 开发工具链

### 推荐扩展

**VSCode:**
- ESLint - 代码检查
- Prettier - 代码格式化
- TypeScript - 类型支持
- CSS Modules - 样式智能提示

**Chrome DevTools:**
- React Developer Tools
- Network 性能分析
- Lighthouse 审计

### Git 工作流

```bash
main (生产)
  ├─ develop (开发)
  │   ├─ feature/title-generation
  │   ├─ feature/wechat-integration
  │   └─ fix/api-timeout
  └─ hotfix/critical-bug
```

## 📚 技术栈依赖图

```
前端依赖
├─ React 18 (UI 框架)
├─ React Router v6 (路由)
├─ TypeScript (类型检查)
└─ CSS Modules (样式方案)

后端依赖
├─ Express 4 (Web 框架)
├─ @google/generative-ai (AI SDK)
├─ cors (跨域支持)
└─ dotenv (环境变量)

开发依赖
├─ nodemon (热重载)
├─ react-scripts (构建工具)
└─ TypeScript Compiler (类型编译)
```

---

**文档版本:** 1.0.0  
**最后更新:** 2025-10-12  
**维护者:** 徐子叶

