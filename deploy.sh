#!/bin/bash

# ========================================
# Vercel 快速部署脚本
# ========================================

echo "🚀 开始部署到 Vercel..."
echo ""

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI 未安装"
    echo "📦 正在安装 Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI 安装完成"
    echo ""
fi

# 检查是否已登录
echo "🔐 检查 Vercel 登录状态..."
if ! vercel whoami &> /dev/null
then
    echo "请先登录 Vercel..."
    vercel login
fi

echo ""
echo "✅ 已登录 Vercel"
echo ""

# 提示用户配置环境变量
echo "⚠️  重要提示：部署前请确保已配置以下环境变量："
echo ""
echo "必需的环境变量："
echo "  • DEEPSEEK_API_KEY - 您的 DeepSeek API 密钥"
echo "  • DEEPSEEK_BASE_URL - DeepSeek API 基础URL (默认: https://api.deepseek.com)"
echo "  • DEEPSEEK_MODEL_NAME - 使用的模型名称 (默认: deepseek-chat)"
echo ""
echo "可选的环境变量："
echo "  • PORT - API 服务端口 (默认: 5000)"
echo "  • REACT_APP_API_URL - 自定义 API URL"
echo ""
echo "环境变量可以通过以下方式添加："
echo "  1. Vercel Dashboard → Settings → Environment Variables"
echo "  2. 使用命令: vercel env add VARIABLE_NAME"
echo ""

read -p "是否已配置好环境变量？(y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ 请先配置环境变量，然后再运行此脚本"
    echo "📖 详细说明请查看 VERCEL_DEPLOYMENT.md"
    exit 1
fi

echo ""
echo "🏗️  开始部署..."
echo ""

# 部署到生产环境
vercel --prod

echo ""
echo "✅ 部署完成！"
echo ""
echo "📖 更多信息请查看 VERCEL_DEPLOYMENT.md"
echo ""

