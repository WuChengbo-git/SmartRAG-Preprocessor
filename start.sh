#!/bin/bash

# SmartRAG Preprocessor 一键启动脚本
echo "🚀 Starting SmartRAG Preprocessor..."

# 检查是否安装了必要的依赖
if ! command -v poetry &> /dev/null; then
    echo "❌ Poetry not found. Please install poetry first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js first."
    exit 1
fi

# 创建日志目录
mkdir -p logs

# 后端启动函数
start_backend() {
    echo "📦 Starting backend..."
    cd backend
    
    # 检查并安装依赖
    if [ ! -f "poetry.lock" ]; then
        echo "Installing backend dependencies..."
        poetry install
    fi
    
    # 启动后端服务 - 支持远程访问
    poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8090 > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    echo "Backend started with PID: $BACKEND_PID"
    cd ..
}

# 前端启动函数
start_frontend() {
    echo "🎨 Starting frontend..."
    cd frontend
    
    # 检查并安装依赖
    if [ ! -d "node_modules" ]; then
        echo "Installing frontend dependencies..."
        npm install
    fi
    
    # 修改端口为3001
    export VITE_PORT=3001
    
    # 启动前端服务 - 支持远程访问
    npm run dev -- --host 0.0.0.0 --port 3001 > ../logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo "Frontend started with PID: $FRONTEND_PID"
    cd ..
}

# 清理函数
cleanup() {
    echo "🛑 Stopping services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "Backend stopped"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "Frontend stopped"
    fi
    exit 0
}

# 设置信号处理
trap cleanup SIGINT SIGTERM

# 启动服务
start_backend
start_frontend

# 等待服务启动
echo "⏳ Waiting for services to start..."
sleep 5

# 检查服务状态
echo "🔍 Checking service status..."
if curl -s http://localhost:8090/health > /dev/null; then
    echo "✅ Backend is running at http://localhost:8090"
else
    echo "❌ Backend failed to start"
fi

if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Frontend is running at http://localhost:3001"
else
    echo "❌ Frontend failed to start"
fi

echo "📋 Service URLs:"
echo "   Frontend: http://localhost:3001"
echo "   Backend:  http://localhost:8090"
echo "   API Docs: http://localhost:8090/docs"
echo ""
echo "📝 Logs are available in the logs/ directory"
echo "🛑 Press Ctrl+C to stop all services"

# 保持脚本运行
wait