# ⚡ 快速开始指南

> 5分钟启动您的 AI 公众号文章生成器

## 🚀 最快启动方式

### 第一步：获取 Gemini API Key

1. 访问：https://makersuite.google.com/app/apikey
2. 登录 Google 账号
3. 点击 "Create API Key"
4. 复制生成的密钥

### 第二步：配置环境

```bash
# 1. 进入后端目录
cd backend

# 2. 创建环境变量文件
cp env-template.txt .env

# 3. 编辑 .env 文件（用文本编辑器打开）
# 将 your_gemini_api_key_here 替换为你的真实 API Key
```

`.env` 文件内容示例：
```env
GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=5000
```

### 第三步：一键启动

**macOS / Linux:**
```bash
cd ..  # 返回项目根目录
chmod +x start.sh  # 赋予执行权限（首次需要）
./start.sh
```

**Windows:**
```bash
cd ..  # 返回项目根目录
start.bat
```

**手动启动（如果脚本不工作）:**
```bash
# 终端 1 - 启动后端
cd backend
npm install  # 首次需要
npm start

# 终端 2 - 启动前端
cd frontend
npm install  # 首次需要
npm start
```

### 第四步：开始使用

1. 浏览器自动打开 `http://localhost:3000`
2. 在左侧输入框输入您的灵感
3. 点击"生成"按钮
4. 等待 AI 创作（30-60秒）
5. 在新页面优化标题、排版、发布！

---

## 📝 使用流程

### 页面 1: 灵感输入
```
输入灵感 → 点击"生成" → 等待 AI 创作 → 自动跳转
```

### 页面 2: 文章优化
```
1️⃣ 生成标题 → 选择一个标题
         ↓
2️⃣ 一键排版 → 输入编号 → 预览效果
         ↓
3️⃣ 发布公众号 → 打开新窗口
```

---

## ⚠️ 常见问题

### Q1: 后端启动失败？
**检查清单：**
- ✅ Node.js 已安装？运行 `node -v` 检查
- ✅ `backend/.env` 文件存在？
- ✅ `GEMINI_API_KEY` 已正确填写？
- ✅ 端口 5000 未被占用？

### Q2: 前端无法连接后端？
**解决方案：**
1. 访问 http://localhost:5000/health
2. 如果无法访问，重启后端服务
3. 检查防火墙设置

### Q3: API 调用失败？
**可能原因：**
- ❌ API Key 无效
- ❌ 网络无法访问 Google 服务
- ❌ API 配额用尽

**解决方法：**
1. 重新生成 API Key
2. 检查网络连接
3. 查看 Google Cloud Console 配额

### Q4: npm install 很慢？
**加速方法：**
```bash
# 使用国内镜像源
npm install --registry=https://registry.npmmirror.com
```

---

## 🎯 核心 API 端点

| 端点 | 方法 | 说明 | 耗时 |
|------|------|------|------|
| `/api/generate/article` | POST | 生成文章 | 20-60s |
| `/api/generate/titles` | POST | 生成标题 | 10-30s |
| `/api/format/article` | POST | 文章排版 | 15-45s |
| `/api/wechat/publish` | POST | 发布公众号 | 2-5s |

---

## 📂 关键文件位置

```
项目根目录/
├── backend/
│   ├── .env                    ← 在这里配置 API Key
│   └── server.js               ← 后端核心逻辑
│
├── frontend/
│   └── src/
│       ├── pages/              ← 页面组件
│       └── services/api.ts     ← API 调用
│
├── README.md                   ← 完整文档
├── SETUP.md                    ← 详细安装指南
└── start.sh / start.bat        ← 启动脚本
```

---

## 💡 快速测试

### 测试后端 API

```bash
# 1. 测试健康检查
curl http://localhost:5000/health

# 2. 测试文章生成
curl -X POST http://localhost:5000/api/generate/article \
  -H "Content-Type: application/json" \
  -d '{"inspiration":"测试灵感"}'
```

### 测试前端

1. 访问 http://localhost:3000
2. 打开浏览器控制台（F12）
3. 查看 Network 标签页
4. 执行操作，观察 API 调用

---

## 🔥 生产部署快速指南

### 后端部署（Railway 示例）

```bash
# 1. 构建后端
cd backend
npm install --production

# 2. 在 Railway 设置环境变量
GEMINI_API_KEY=你的密钥
NODE_ENV=production
PORT=5000

# 3. 部署
railway up
```

### 前端部署（Vercel 示例）

```bash
# 1. 构建前端
cd frontend
npm run build

# 2. 在 Vercel 设置环境变量
REACT_APP_API_URL=https://your-backend.railway.app

# 3. 部署
vercel --prod
```

---

## 📞 获取帮助

- 📖 完整文档：查看 `README.md`
- 🏗️ 架构说明：查看 `ARCHITECTURE.md`
- 🔧 详细安装：查看 `SETUP.md`
- 📝 功能清单：查看 `FEATURES.md`

---

## ✅ 启动检查清单

使用前请确认：

- [ ] Node.js 已安装（v14+）
- [ ] 已获取 Gemini API Key
- [ ] 已创建 `backend/.env` 文件
- [ ] 已填写正确的 API Key
- [ ] 后端服务成功启动（http://localhost:5000/health 可访问）
- [ ] 前端应用成功启动（http://localhost:3000 可访问）
- [ ] 可以正常输入和生成文章

---

## 🎉 开始创作吧！

现在您已经准备好了！开始输入您的灵感，让 AI 帮您创作爆款文章吧！

**记住：**
- 💡 灵感越详细，文章质量越高
- ⏱️ 第一次生成可能需要 30-60 秒
- 🔄 可以多次生成直到满意
- 📝 标题可以自由选择和切换
- 🎨 排版后可以直接复制 HTML 到公众号编辑器

---

**祝您创作愉快！** 🚀






