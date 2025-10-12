# AI公众号文章生成器

一个基于 AI 的多页面公众号文章生成应用，模拟刘润老师的写作风格，帮助用户快速创作高质量的公众号文章。

## ✨ 功能特性

- 🎯 **灵感输入页面** - 输入零散的灵感或想法，AI 自动生成完整文章
- 📝 **文章优化页面** - 提供标题生成、一键排版、一键发布等功能
- 🤖 **AI 驱动** - 集成 Google Gemini API，模拟刘润写作风格
- 🎨 **现代化 UI** - 简洁优雅的界面设计，极致的用户体验
- 📱 **响应式设计** - 完美适配桌面端和移动端

## 🛠 技术栈

### 前端
- React 18 + TypeScript
- React Router v6
- CSS Modules
- Fetch API

### 后端
- Node.js + Express
- Google Generative AI (Gemini)
- CORS
- dotenv

## 📦 项目结构

```
.
├── backend/                 # 后端服务
│   ├── server.js           # Express 服务器主文件
│   ├── package.json        # 后端依赖配置
│   └── .env.example        # 环境变量示例
│
└── frontend/               # 前端应用
    ├── public/            # 静态资源
    ├── src/
    │   ├── pages/         # 页面组件
    │   │   ├── InspirationPage/    # 灵感输入页
    │   │   └── OptimizePage/       # 文章优化页
    │   ├── services/      # API 服务
    │   ├── App.tsx        # 根组件
    │   └── index.tsx      # 入口文件
    ├── package.json       # 前端依赖配置
    └── tsconfig.json      # TypeScript 配置

```

## 🚀 快速开始

### 前置要求

- Node.js >= 14.x
- npm 或 yarn
- Google Gemini API Key

### 1. 克隆项目

```bash
cd your-project-folder
```

### 2. 安装后端依赖

```bash
cd backend
npm install
```

### 3. 配置环境变量

在 `backend` 目录下创建 `.env` 文件：

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

**获取 Gemini API Key:**
1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 登录您的 Google 账号
3. 创建并复制 API Key

### 4. 启动后端服务

```bash
npm start
# 或使用 nodemon 进行开发
npm run dev
```

后端服务将在 `http://localhost:5000` 启动

### 5. 安装前端依赖

打开新的终端窗口：

```bash
cd frontend
npm install
```

### 6. 启动前端应用

```bash
npm start
```

前端应用将在 `http://localhost:3000` 启动

## 📖 使用指南

### 用户流程

#### 第一步：灵感输入
1. 在左侧输入框输入您的灵感或想法
2. 点击"生成"按钮
3. AI 将根据您的输入生成完整的文章

#### 第二步：生成标题
1. 点击"生成标题"按钮
2. AI 会生成 10 个爆款标题供您选择
3. 点击选择您喜欢的标题

#### 第三步：一键排版
1. 输入上一篇文章编号（例如：001）
2. 点击"一键排版"按钮
3. AI 会按照徐子叶公众号风格格式化文章

#### 第四步：发布至公众号
1. 点击"发布至公众号"按钮
2. 系统会调用微信公众号 API（目前为模拟实现）
3. 发布成功后会在新标签页打开公众号管理页面

## 🔌 API 接口

### 后端 API 端点

#### 1. 生成文章
```http
POST /api/generate/article
Content-Type: application/json

{
  "inspiration": "用户的灵感内容"
}
```

#### 2. 生成标题
```http
POST /api/generate/titles
Content-Type: application/json

{
  "articleSummary": "文章核心主题或摘要"
}
```

#### 3. 格式化文章
```http
POST /api/format/article
Content-Type: application/json

{
  "title": "文章标题",
  "content": "文章正文",
  "previousNumber": "000"
}
```

#### 4. 发布至微信公众号
```http
POST /api/wechat/publish
Content-Type: application/json

{
  "title": "文章标题",
  "content_html": "格式化后的 HTML",
  "author": "徐子叶",
  "access_token": "微信 access_token"
}
```

**注意：** 微信发布接口目前为模拟实现，需要根据[微信公众平台 API 文档](https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Overview.html)进行实际对接。

## ⚙️ 配置说明

### 环境变量

**后端 (.env):**
- `GEMINI_API_KEY` - Google Gemini API 密钥（必需）
- `PORT` - 后端服务端口（默认：5000）

**前端 (.env):**
- `REACT_APP_API_URL` - 后端 API 地址（默认：http://localhost:5000）

### 自定义配置

#### 修改 AI 提示词

在 `backend/server.js` 中可以修改以下提示词：
- `ARTICLE_GENERATION_PROMPT` - 文章生成提示词（刘润风格）
- `TITLE_GENERATION_PROMPT` - 标题生成提示词
- `FORMATTING_PROMPT` - 文章排版提示词（徐子叶风格）

#### 修改样式

前端使用 CSS Modules，样式文件位于：
- `frontend/src/pages/InspirationPage/InspirationPage.module.css`
- `frontend/src/pages/OptimizePage/OptimizePage.module.css`

## 🔧 开发说明

### 构建生产版本

**后端:**
```bash
cd backend
npm start
```

**前端:**
```bash
cd frontend
npm run build
```

构建产物将生成在 `frontend/build` 目录

### 部署建议

1. **后端部署** - 可使用 PM2、Docker 或云服务（如 Heroku、Railway）
2. **前端部署** - 可使用 Vercel、Netlify 或 Nginx
3. **环境变量** - 确保在生产环境中正确配置所有环境变量
4. **CORS** - 在生产环境中配置正确的 CORS 策略

## 📝 待办事项

- [ ] 集成真实的微信公众号 API
- [ ] 添加用户认证和授权
- [ ] 实现文章草稿保存功能
- [ ] 添加文章历史记录
- [ ] 支持图片上传和管理
- [ ] 添加更多 AI 写作风格选项
- [ ] 实现文章数据统计和分析

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

ISC License

## 👤 作者

徐子叶

---

**祝您使用愉快！如有问题，请随时提出 Issue。**

