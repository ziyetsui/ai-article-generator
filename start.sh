#!/bin/bash

# AI公众号文章生成器 - 启动脚本
# 此脚本会同时启动后端和前端服务

echo "=========================================="
echo "  AI公众号文章生成器 - 启动中..."
echo "=========================================="
echo ""

# 检查是否在正确的目录
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未检测到 Node.js，请先安装 Node.js"
    echo "   下载地址: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js 版本: $(node -v)"
echo "✓ npm 版本: $(npm -v)"
echo ""

# 检查后端 .env 文件
if [ ! -f "backend/.env" ]; then
    echo "⚠️  警告: 未找到 backend/.env 文件"
    echo ""
    echo "请执行以下步骤："
    echo "1. 复制环境变量模板: cp backend/env-template.txt backend/.env"
    echo "2. 编辑 backend/.env 文件，填入您的 GEMINI_API_KEY"
    echo "3. 重新运行此脚本"
    echo ""
    echo "获取 API Key: https://makersuite.google.com/app/apikey"
    exit 1
fi

# 检查 GEMINI_API_KEY
if ! grep -q "GEMINI_API_KEY=.*[^_here]" backend/.env; then
    echo "⚠️  警告: GEMINI_API_KEY 未配置"
    echo ""
    echo "请编辑 backend/.env 文件，将 your_gemini_api_key_here 替换为您的真实 API Key"
    echo ""
    read -p "是否继续启动？(y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 检查依赖是否已安装
echo "正在检查依赖..."
if [ ! -d "backend/node_modules" ]; then
    echo "安装后端依赖..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "安装前端依赖..."
    cd frontend && npm install && cd ..
fi

echo ""
echo "=========================================="
echo "  启动服务..."
echo "=========================================="
echo ""
echo "后端服务: http://localhost:5001"
echo "前端应用: http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止所有服务"
echo ""

# 创建临时日志目录
mkdir -p .logs

# 启动后端服务（后台运行）
echo "▶️  启动后端服务..."
cd backend && npm start > ../.logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 3

# 检查后端是否成功启动
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ 后端启动失败，请查看日志: .logs/backend.log"
    exit 1
fi

echo "✓ 后端服务已启动 (PID: $BACKEND_PID)"

# 启动前端服务（前台运行）
echo "▶️  启动前端应用..."
cd frontend

# 清理函数 - 确保退出时关闭所有服务
cleanup() {
    echo ""
    echo "正在关闭服务..."
    kill $BACKEND_PID 2>/dev/null
    echo "✓ 所有服务已关闭"
    exit 0
}

trap cleanup INT TERM

npm start

# 如果前端退出，也关闭后端
cleanup

