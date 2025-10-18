# 快速安装指南

按照以下步骤快速启动您的 AI 公众号文章生成器。

## 📋 前置要求

确保您已安装：
- **Node.js** 14.x 或更高版本
- **npm** 或 **yarn**
- **Google Gemini API Key** ([获取教程](#获取-gemini-api-key))

## 🚀 5分钟快速启动

### 步骤 1: 安装后端依赖

```bash
cd backend
npm install
```

### 步骤 2: 配置后端环境变量

在 `backend/` 目录创建 `.env` 文件：

```bash
# 方式 1: 手动创建
touch .env

# 方式 2: 复制模板
cp env-template.txt .env
```

编辑 `.env` 文件，填入您的 Gemini API Key：

```env
GEMINI_API_KEY=你的_gemini_api_密钥
PORT=5000
```

### 步骤 3: 启动后端服务

```bash
npm start
```

✅ 看到 "Backend server running on http://localhost:5000" 表示成功！

### 步骤 4: 安装前端依赖（新终端窗口）

```bash
cd frontend
npm install
```

### 步骤 5: 启动前端应用

```bash
npm start
```

✅ 浏览器会自动打开 `http://localhost:3000`

## 🎉 开始使用

1. 在左侧输入框输入您的灵感
2. 点击"生成"按钮
3. 等待 AI 创作完成（30-60秒）
4. 在新页面优化标题和排版
5. 一键发布到公众号！

---

## 📖 详细说明

### 获取 Gemini API Key

#### 方法一：通过 Google AI Studio（推荐）

1. 访问 [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. 使用您的 Google 账号登录
3. 点击 **"Create API Key"** 按钮
4. 选择或创建一个 Google Cloud 项目
5. 复制生成的 API Key
6. 粘贴到 `backend/.env` 文件中

#### 方法二：通过 Google Cloud Console

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 **"Generative Language API"**
4. 转到 **"凭据"** → **"创建凭据"** → **"API 密钥"**
5. 复制 API 密钥

> ⚠️ **重要提示**: 
> - 请妥善保管您的 API Key，不要泄露给他人
> - 不要将包含 API Key 的 `.env` 文件提交到 Git
> - 建议设置 API 使用配额和限制

### 目录结构说明

```
未命名文件夹/
├── backend/              # 后端服务
│   ├── server.js        # Express 服务器
│   ├── package.json     # 依赖配置
│   ├── .env             # 环境变量（需创建）
│   └── env-template.txt # 环境变量模板
│
├── frontend/            # 前端应用
│   ├── src/
│   │   ├── pages/      # 页面组件
│   │   ├── services/   # API 服务
│   │   └── App.tsx     # 根组件
│   ├── public/
│   ├── package.json
│   └── .env.example    # 环境变量示例
│
└── README.md           # 项目文档
```

### 端口说明

- **后端 API**: `http://localhost:5000`
- **前端应用**: `http://localhost:3000`

如果端口被占用，可以修改：
- 后端：修改 `backend/.env` 中的 `PORT`
- 前端：React 会自动提示使用其他端口

### 开发模式 vs 生产模式

#### 开发模式（当前）

```bash
# 后端
cd backend
npm run dev  # 使用 nodemon 自动重启

# 前端
cd frontend
npm start    # 热重载开发服务器
```

#### 生产模式

```bash
# 后端
cd backend
npm start

# 前端
cd frontend
npm run build  # 构建生产版本
# 然后使用 nginx 或其他服务器托管 build/ 目录
```

## ⚠️ 常见问题排查

### 问题 1: 后端启动失败

**错误**: `Error: GEMINI_API_KEY is not defined`

**解决**:
1. 确认 `backend/.env` 文件存在
2. 确认文件中包含 `GEMINI_API_KEY=你的密钥`
3. 重启后端服务

### 问题 2: 前端无法连接后端

**错误**: `Failed to fetch` 或 `Network Error`

**解决**:
1. 确认后端服务正在运行（访问 http://localhost:5000/health）
2. 检查前端 `.env` 中的 `REACT_APP_API_URL`
3. 检查防火墙或代理设置

### 问题 3: 端口被占用

**错误**: `Error: listen EADDRINUSE: address already in use :::5000`

**解决**:
```bash
# 查找占用端口的进程
lsof -ti:5000

# 终止进程（macOS/Linux）
kill -9 $(lsof -ti:5000)

# 或者修改 backend/.env 中的端口号
PORT=5001
```

### 问题 4: npm install 失败

**解决**:
```bash
# 清除 npm 缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 问题 5: Gemini API 调用失败

**错误**: `API key not valid`

**解决**:
1. 确认 API Key 正确无误（无多余空格）
2. 确认已启用 Generative Language API
3. 检查 API 配额是否用尽
4. 确认网络可以访问 Google 服务

## 🔧 高级配置

### 自定义 AI 提示词

编辑 `backend/server.js` 中的提示词常量：
- `ARTICLE_GENERATION_PROMPT` - 文章生成风格
- `TITLE_GENERATION_PROMPT` - 标题生成规则
- `FORMATTING_PROMPT` - 排版样式定义

### 修改样式主题

编辑前端 CSS Module 文件：
- `frontend/src/pages/InspirationPage/InspirationPage.module.css`
- `frontend/src/pages/OptimizePage/OptimizePage.module.css`

主色调定义在 CSS 变量中，可统一修改。

### 添加日志记录

在 `backend/server.js` 中添加 morgan 或 winston：

```bash
npm install morgan
```

```javascript
const morgan = require('morgan');
app.use(morgan('combined'));
```

## 📚 下一步

- 阅读完整 [README.md](./README.md) 了解所有功能
- 查看 [backend/README.md](./backend/README.md) 了解 API 详情
- 查看 [frontend/README.md](./frontend/README.md) 了解前端架构
- 实现真实的微信公众号 API 集成
- 部署到生产环境（Vercel + Railway）

## 🆘 获取帮助

如遇到其他问题：
1. 查看项目 README 文档
2. 检查终端错误信息
3. 访问 [Google Gemini API 文档](https://ai.google.dev/docs)
4. 提交 GitHub Issue（如果是开源项目）

---

祝您使用愉快！🎉






