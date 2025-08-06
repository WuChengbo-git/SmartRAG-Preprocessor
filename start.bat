@echo off
rem SmartRAG Preprocessor 一键启动脚本 (Windows)

echo 🚀 Starting SmartRAG Preprocessor...

rem 检查是否安装了必要的依赖
poetry --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Poetry not found. Please install poetry first.
    pause
    exit /b 1
)

npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm not found. Please install Node.js first.
    pause
    exit /b 1
)

rem 创建日志目录
if not exist logs mkdir logs

rem 启动后端
echo 📦 Starting backend...
cd backend
if not exist poetry.lock (
    echo Installing backend dependencies...
    poetry install
)
start /b cmd /c "poetry run uvicorn app.main:app --reload --port 8090 > ../logs/backend.log 2>&1"
cd ..

rem 启动前端
echo 🎨 Starting frontend...
cd frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    npm install
)
start /b cmd /c "npm run dev -- --port 3001 > ../logs/frontend.log 2>&1"
cd ..

rem 等待服务启动
echo ⏳ Waiting for services to start...
timeout /t 5 /nobreak >nul

echo 📋 Service URLs:
echo    Frontend: http://localhost:3001
echo    Backend:  http://localhost:8090
echo    API Docs: http://localhost:8090/docs
echo.
echo 📝 Logs are available in the logs/ directory
echo 🛑 Press any key to stop all services
pause

rem 停止服务
taskkill /f /im uvicorn.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1
echo Services stopped.