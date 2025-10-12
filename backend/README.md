# 后端 API 服务

基于 Node.js + Express 的后端服务，集成 Google Gemini AI，提供文章生成、标题生成、文章排版和公众号发布功能。

## 🚀 快速启动

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建 `.env` 文件：

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

### 启动服务

```bash
# 生产模式
npm start

# 开发模式（使用 nodemon）
npm run dev
```

服务将在 `http://localhost:5001` 启动

## 📚 API 文档

### 健康检查

```http
GET /health
```

**响应示例:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### 1. 生成文章 (刘润风格)

```http
POST /api/generate/article
```

**请求体:**
```json
{
  "inspiration": "关于产品思维的一些想法..."
}
```

**响应示例:**
```json
{
  "status": "success",
  "article": "生成的文章内容..."
}
```

### 2. 生成爆款标题

```http
POST /api/generate/titles
```

**请求体:**
```json
{
  "articleSummary": "文章核心主题或前500字摘要"
}
```

**响应示例:**
```json
{
  "status": "success",
  "titles": [
    "标题1",
    "标题2",
    "..."
  ],
  "rawResponse": "AI 返回的完整文本..."
}
```

### 3. 文章排版 (徐子叶风格)

```http
POST /api/format/article
```

**请求体:**
```json
{
  "title": "文章标题",
  "content": "文章正文内容",
  "previousNumber": "001"
}
```

**响应示例:**
```json
{
  "status": "success",
  "formattedHtml": "<html>格式化后的 HTML 代码...</html>"
}
```

### 4. 发布至微信公众号

```http
POST /api/wechat/publish
```

**请求体:**
```json
{
  "title": "文章标题",
  "content_html": "格式化后的 HTML",
  "author": "徐子叶",
  "access_token": "微信 access_token"
}
```

**响应示例 (模拟):**
```json
{
  "status": "success",
  "publishUrl": "https://mp.weixin.qq.com/s/mock-article-url-...",
  "message": "发布成功（模拟）"
}
```

**注意:** 此接口目前为模拟实现，需要集成真实的微信公众平台 API。

## 🔑 获取 Gemini API Key

1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 使用 Google 账号登录
3. 点击 "Create API Key"
4. 复制生成的 API Key 到 `.env` 文件

## 🛠 技术实现

### AI 提示词架构

#### 1. 文章生成提示词
- **风格:** 模拟刘润老师的商业写作风格
- **特点:** 逻辑势能、结构清晰、可读性强
- **方法:** 使用"5商派"模型等结构化写作框架

#### 2. 标题生成提示词
- **公式:** 关注率 = 价值 × 预期 × 稀缺性
- **分类:** 
  - 痛点前置型
  - 好奇心驱动型
  - 价值承诺型
  - 稀缺性/颠覆认知型
- **输出:** 10个标题 + 解析 + 综合推荐

#### 3. 排版提示词
- **风格:** 徐子叶公众号排版风格
- **功能:** 
  - 自动计算文章编号
  - 应用预设 CSS 样式
  - 生成完整 HTML 代码

### 错误处理

所有 API 接口都包含完善的错误处理：

```javascript
try {
  // API 逻辑
} catch (error) {
  res.status(500).json({
    status: 'error',
    message: '错误信息'
  });
}
```

### CORS 配置

默认允许所有来源的跨域请求。生产环境建议配置具体的允许来源：

```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```

## 📦 依赖说明

- `express` - Web 框架
- `@google/generative-ai` - Google Gemini AI SDK
- `cors` - 跨域资源共享
- `dotenv` - 环境变量管理
- `nodemon` (dev) - 开发时自动重启

## 🔐 安全建议

1. **保护 API Key**: 永远不要将 `.env` 文件提交到版本控制
2. **添加速率限制**: 使用 `express-rate-limit` 防止 API 滥用
3. **输入验证**: 对所有用户输入进行验证和清理
4. **HTTPS**: 生产环境必须使用 HTTPS
5. **认证授权**: 添加用户认证和 API 密钥验证

## 🚀 生产部署

### 使用 PM2

```bash
npm install -g pm2
pm2 start server.js --name "ai-article-api"
pm2 save
pm2 startup
```

### 使用 Docker

创建 `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

构建和运行:

```bash
docker build -t ai-article-backend .
docker run -p 5000:5000 --env-file .env ai-article-backend
```

## 📊 性能优化

- 使用连接池管理 Gemini API 调用
- 实现请求缓存减少 API 调用次数
- 添加日志记录用于监控和调试
- 实现优雅关闭处理

## 🐛 调试

启用详细日志：

```javascript
// 在 server.js 中添加
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

## 📝 待实现功能

- [ ] 集成真实的微信公众号 API
- [ ] 添加 Redis 缓存层
- [ ] 实现 JWT 认证
- [ ] 添加请求速率限制
- [ ] 实现日志系统
- [ ] 添加数据库存储文章历史
- [ ] 实现 WebSocket 实时通知

## 🤝 贡献

欢迎提交 Pull Request 改进此服务！

## 📄 许可证

ISC

