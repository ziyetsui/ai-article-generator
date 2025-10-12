@echo off
REM AI公众号文章生成器 - Windows 启动脚本
REM 此脚本会同时启动后端和前端服务

echo ==========================================
echo   AI公众号文章生成器 - 启动中...
echo ==========================================
echo.

REM 检查是否在正确的目录
if not exist "backend" (
    echo ❌ 错误: 请在项目根目录运行此脚本
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ❌ 错误: 请在项目根目录运行此脚本
    pause
    exit /b 1
)

REM 检查 Node.js 是否安装
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 错误: 未检测到 Node.js，请先安装 Node.js
    echo    下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js 已安装
echo ✓ npm 已安装
echo.

REM 检查后端 .env 文件
if not exist "backend\.env" (
    echo ⚠️  警告: 未找到 backend\.env 文件
    echo.
    echo 请执行以下步骤：
    echo 1. 复制环境变量模板: copy backend\env-template.txt backend\.env
    echo 2. 编辑 backend\.env 文件，填入您的 GEMINI_API_KEY
    echo 3. 重新运行此脚本
    echo.
    echo 获取 API Key: https://makersuite.google.com/app/apikey
    pause
    exit /b 1
)

REM 检查依赖是否已安装
echo 正在检查依赖...
if not exist "backend\node_modules" (
    echo 安装后端依赖...
    cd backend
    call npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo 安装前端依赖...
    cd frontend
    call npm install
    cd ..
)

echo.
echo ==========================================
echo   启动服务...
echo ==========================================
echo.
echo 后端服务: http://localhost:5000
echo 前端应用: http://localhost:3000
echo.
echo 按 Ctrl+C 停止所有服务
echo.

REM 启动后端服务（新窗口）
echo ▶️  启动后端服务...
start "AI Article Generator - Backend" cmd /k "cd backend && npm start"

REM 等待后端启动
timeout /t 3 /nobreak >nul

REM 启动前端服务（新窗口）
echo ▶️  启动前端应用...
start "AI Article Generator - Frontend" cmd /k "cd frontend && npm start"

echo.
echo ✓ 所有服务已启动！
echo.
echo 两个新窗口已打开：
echo   - 后端服务窗口
echo   - 前端应用窗口
echo.
echo 浏览器将自动打开 http://localhost:3000
echo.
pause

