# Vercel 部署指南

本指南将帮助您将 AI 公众号文章生成器部署到 Vercel。

## 📋 前置准备

在开始部署之前，请确保您已经：

1. ✅ 拥有 [Vercel 账号](https://vercel.com/signup)（免费）
2. ✅ 拥有 [DeepSeek API Key](https://platform.deepseek.com/api_keys)
3. ✅ 项目代码已推送到 GitHub/GitLab/Bitbucket

## 🚀 快速部署

### 方法一：使用 Vercel CLI（推荐）

#### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

#### 2. 登录 Vercel

```bash
vercel login
```

#### 3. 部署项目

在项目根目录下运行：

```bash
vercel
```

首次部署时，Vercel CLI 会询问几个问题：
- **Set up and deploy?** → Yes
- **Which scope?** → 选择您的账号或团队
- **Link to existing project?** → No（首次部署选 No）
- **What's your project's name?** → 输入项目名称（如：ai-article-generator）
- **In which directory is your code located?** → ./ （直接回车）

#### 4. 配置环境变量

部署成功后，需要在 Vercel 项目设置中添加环境变量：

```bash
vercel env add DEEPSEEK_API_KEY
```

输入您的 DeepSeek API Key。

或者通过 Vercel Dashboard 添加：
1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择您的项目
3. 点击 **Settings** → **Environment Variables**
4. 添加以下环境变量：

```
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL_NAME=deepseek-chat
```

#### 5. 重新部署

添加环境变量后，重新部署项目：

```bash
vercel --prod
```

---

### 方法二：使用 Vercel Dashboard（可视化）

#### 1. 导入 Git 仓库

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **Add New...** → **Project**
3. 选择您的 Git 提供商（GitHub/GitLab/Bitbucket）
4. 授权 Vercel 访问您的仓库
5. 选择要部署的项目

#### 2. 配置项目设置

在导入项目页面：

**Framework Preset:** 选择 `Other`（因为我们有自定义配置）

**Root Directory:** `./`（默认）

**Build Command:** `cd frontend && npm install && npm run build`

**Output Directory:** `frontend/build`

**Install Command:** `npm install`（默认）

#### 3. 添加环境变量

在 **Environment Variables** 部分添加：

```
DEEPSEEK_API_KEY = your_deepseek_api_key_here
DEEPSEEK_BASE_URL = https://api.deepseek.com
DEEPSEEK_MODEL_NAME = deepseek-chat
```

确保选择 **Production**、**Preview** 和 **Development** 三个环境。

#### 4. 点击 Deploy

点击 **Deploy** 按钮开始部署。部署过程大约需要 2-5 分钟。

---

## 🔧 项目配置说明

### vercel.json 配置

项目根目录的 `vercel.json` 文件已经配置好：

```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/build",
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*\\.(js|css|json|ico|png|jpg|jpeg|svg|gif|woff|woff2|ttf|eot))",
      "headers": { "cache-control": "public, max-age=31536000, immutable" },
      "dest": "/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/index.js"
    }
  ]
}
```

**关键配置说明：**

- `buildCommand`: 指定前端构建命令
- `outputDirectory`: 指定前端构建输出目录
- `functions`: 配置 API 路由使用 Node.js 18 运行时
- `routes`: 配置路由规则，确保 API 请求和静态文件正确处理
- `rewrites`: 确保所有 `/api/*` 请求都路由到后端 API

### API 配置

前端 API 配置位于 `frontend/src/services/api.ts`：

```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5001');
```

这个配置确保：
- **本地开发**：使用 `http://localhost:5001`
- **生产环境**：使用相对路径（同域名），自动路由到 Vercel Serverless Functions

---

## 📊 部署后验证

### 1. 检查部署状态

部署完成后，Vercel 会提供一个预览 URL，例如：
```
https://your-project-name.vercel.app
```

### 2. 测试应用功能

访问部署的应用，测试以下功能：

- [ ] 首页可以正常加载
- [ ] 灵感输入页面可以生成文章
- [ ] 标题生成功能正常
- [ ] 文章排版功能正常
- [ ] 没有控制台错误

### 3. 检查 API 日志

如果遇到问题，可以在 Vercel Dashboard 中查看日志：

1. 进入项目 Dashboard
2. 点击 **Deployments**
3. 选择最新的部署
4. 点击 **Functions** 标签查看 API 日志

---

## 🐛 常见问题排查

### 问题 1：API 请求失败 (500 错误)

**可能原因：** 环境变量未正确设置

**解决方案：**
1. 检查 Vercel Dashboard → Settings → Environment Variables
2. 确认 `DEEPSEEK_API_KEY` 已正确添加
3. 重新部署项目

### 问题 2：页面空白或 404

**可能原因：** 路由配置问题

**解决方案：**
1. 检查 `vercel.json` 配置是否正确
2. 确认前端构建成功（查看部署日志）
3. 检查 `outputDirectory` 是否为 `frontend/build`

### 问题 3：构建失败

**可能原因：** 依赖安装失败或构建命令错误

**解决方案：**
1. 检查构建日志中的错误信息
2. 确认 `package.json` 中的依赖版本正确
3. 本地运行 `cd frontend && npm install && npm run build` 测试

### 问题 4：DeepSeek API 调用失败

**可能原因：** API Key 无效或配额用尽

**解决方案：**
1. 访问 [DeepSeek Platform](https://platform.deepseek.com/) 检查 API Key 状态
2. 检查 API 配额是否用尽
3. 确认 API Key 没有过期

---

## 🔄 更新部署

### 自动部署（推荐）

Vercel 支持自动部署：

1. **生产部署：** 推送到 `main` 分支会自动触发生产部署
2. **预览部署：** 推送到其他分支或创建 Pull Request 会创建预览部署

```bash
git add .
git commit -m "Update: your changes"
git push origin main
```

### 手动部署

使用 Vercel CLI：

```bash
# 部署到预览环境
vercel

# 部署到生产环境
vercel --prod
```

---

## 🔐 环境变量管理

### 必需的环境变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | `sk-xxxxxxxxxxxxx` |
| `DEEPSEEK_BASE_URL` | DeepSeek API 基础URL | `https://api.deepseek.com` |
| `DEEPSEEK_MODEL_NAME` | 使用的模型名称 | `deepseek-chat` |

### 可选的环境变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `PORT` | API 服务端口（本地开发用） | `5000` |
| `REACT_APP_API_URL` | 自定义 API URL | `https://api.example.com` |

### 添加环境变量的方式

#### 方式 1：通过 CLI

```bash
vercel env add VARIABLE_NAME
```

#### 方式 2：通过 Dashboard

1. 进入项目 Settings → Environment Variables
2. 点击 **Add New**
3. 输入变量名和值
4. 选择环境（Production/Preview/Development）
5. 点击 **Save**

#### 方式 3：批量导入

创建 `.env.production` 文件：

```env
DEEPSEEK_API_KEY=your_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL_NAME=deepseek-chat
```

然后运行：

```bash
vercel env pull
```

---

## 📈 性能优化建议

### 1. 启用边缘缓存

在 API 响应中添加缓存头（已在 `vercel.json` 中配置静态资源缓存）。

### 2. 使用环境变量缓存

对于不经常变化的配置，使用环境变量而不是硬编码。

### 3. 监控 API 使用

定期检查 DeepSeek API 使用情况，避免超出配额：
- 访问 [DeepSeek Dashboard](https://platform.deepseek.com/usage)

### 4. 优化前端构建

- 使用代码分割
- 压缩图片资源
- 启用 Tree Shaking

---

## 🔗 相关链接

- [Vercel 官方文档](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [DeepSeek API 文档](https://platform.deepseek.com/docs)
- [项目 GitHub](https://github.com/your-username/your-repo)

---

## 💡 提示

1. **免费套餐限制：** Vercel 免费套餐有以下限制：
   - 每月 100GB 带宽
   - 每月 100 小时 Serverless Functions 执行时间
   - 无限数量的部署

2. **自定义域名：** 可以在 Vercel Dashboard → Settings → Domains 中添加自定义域名

3. **团队协作：** 可以邀请团队成员共同管理项目

4. **分析数据：** Vercel 提供实时分析和性能监控

---

## 🎉 完成！

恭喜！您的 AI 公众号文章生成器已成功部署到 Vercel。

**下一步：**
- 📝 测试所有功能
- 🎨 自定义域名（可选）
- 📊 监控使用情况
- 🚀 分享给用户

如有问题，请查看 [Vercel 文档](https://vercel.com/docs) 或提交 Issue。

