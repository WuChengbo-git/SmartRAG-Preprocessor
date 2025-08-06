#!/bin/bash

echo "🚀 Starting SmartRAG Preprocessor (Test Mode)"
echo "============================================="

# 检查端口占用
echo "📡 Checking ports..."
if lsof -Pi :8090 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 8090 is already in use"
else
    echo "✅ Port 8090 is available"
fi

if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3001 is already in use" 
else
    echo "✅ Port 3001 is available"
fi

echo ""
echo "🔧 Starting Backend (FastAPI on :8090)..."
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8090 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
cd ..

# 等待后端启动
sleep 3

echo ""
echo "🎨 Starting Frontend (React on :3001)..."
cd frontend  
npm run dev &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
cd ..

echo ""
echo "⏳ Waiting for services to start..."
sleep 5

echo ""
echo "🔍 Testing Backend Health..."
if curl -s http://localhost:8090/health > /dev/null; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
fi

echo ""
echo "🔍 Testing Frontend..."
if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend is not accessible"
fi

echo ""
echo "🎉 Setup Complete!"
echo "================================"
echo "Backend:  http://localhost:8090"
echo "Frontend: http://localhost:3001"
echo "API Docs: http://localhost:8090/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# 等待中断信号
trap 'echo ""; echo "🛑 Stopping services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT

# 保持脚本运行
wait