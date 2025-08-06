# SmartRAG Preprocessor 启动指南

## 🚀 快速启动

### 方法1: 使用测试脚本（推荐）
```bash
# 一键启动前后端
./test_start.sh

# 测试API功能
./test_api.sh
```

### 方法2: 手动启动

#### 后端启动
```bash
cd backend
pip install fastapi uvicorn python-multipart pydantic sqlalchemy pydantic-settings
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8090
```

#### 前端启动
```bash
cd frontend
npm install
npm run dev
```

## 📊 服务信息

- **后端API**: http://localhost:8090
- **前端界面**: http://localhost:3001  
- **API文档**: http://localhost:8090/docs
- **数据库**: SQLite (backend/smartrag.db)

## 🧪 测试功能

### 1. 文件上传测试
```bash
curl -X POST "http://localhost:8090/api/v1/upload/file" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@your_file.txt"
```

### 2. 文档处理测试
```bash
curl -X POST "http://localhost:8090/api/v1/processing/chunk?file_id=1" \
     -H "Content-Type: application/json" \
     -d '{"chunk_size": 300, "chunk_overlap": 50, "chunk_method": "paragraph"}'
```

### 3. 预览分块结果
```bash
curl "http://localhost:8090/api/v1/processing/preview/1"
```

### 4. 导出功能测试
```bash
curl -X POST "http://localhost:8090/api/v1/export/json?file_id=1" \
     -H "Content-Type: application/json" \
     -d '{"format": "json", "schema_type": "dify", "include_metadata": true}'
```

## 🔧 主要API端点

### 文件管理
- `GET /api/v1/upload/files` - 获取文件列表
- `POST /api/v1/upload/file` - 上传单个文件
- `POST /api/v1/upload/files` - 批量上传文件
- `DELETE /api/v1/upload/files/{id}` - 删除文件

### 文档处理
- `POST /api/v1/processing/chunk` - 启动分块处理
- `GET /api/v1/processing/task/{id}` - 获取任务状态
- `GET /api/v1/processing/tasks` - 获取任务列表
- `GET /api/v1/processing/preview/{file_id}` - 预览分块结果

### 导出功能
- `POST /api/v1/export/json` - 导出为JSON
- `POST /api/v1/export/dify` - 导出到Dify
- `POST /api/v1/export/elasticsearch` - 导出到Elasticsearch
- `GET /api/v1/export/schemas` - 获取导出模式

### WebSocket
- `ws://localhost:8090/api/v1/ws/ws` - 实时通信
- `GET /api/v1/ws/connections` - 连接统计

## 📁 项目结构

```
SmartRAG-Preprocessor/
├── backend/                 # FastAPI后端
│   ├── app/
│   │   ├── api/            # API路由
│   │   ├── core/           # 核心配置
│   │   ├── models/         # 数据模型
│   │   └── main.py         # 主应用
│   └── smartrag.db         # SQLite数据库
│
├── frontend/               # React前端
│   ├── src/
│   │   ├── components/     # 组件
│   │   ├── pages/          # 页面
│   │   ├── utils/          # 工具函数
│   │   └── main.tsx        # 入口文件
│   └── package.json
│
├── test_start.sh           # 启动脚本
├── test_api.sh            # API测试脚本
└── STARTUP_GUIDE.md       # 本文件
```

## 🔍 故障排除

### 端口冲突
如果端口被占用，可以修改配置：
- 后端: 修改uvicorn命令中的--port参数
- 前端: 修改vite.config.ts中的server.port

### 依赖问题
确保安装了所有必要的依赖：
```bash
# 后端
pip install -r requirements.txt  # 如果有的话
pip install fastapi uvicorn python-multipart pydantic sqlalchemy pydantic-settings

# 前端  
npm install
```

### 数据库问题
数据库会自动创建，如果有问题可以删除backend/smartrag.db重新启动

## ✨ 已实现功能

- ✅ FastAPI后端框架
- ✅ React前端框架  
- ✅ SQLite数据库集成
- ✅ 文件上传功能
- ✅ 文档分块处理（模拟）
- ✅ 多种导出格式（JSON、Dify、Elasticsearch）
- ✅ WebSocket实时通信
- ✅ 任务进度跟踪
- ✅ API文档自动生成
- ✅ CORS跨域支持

## 🚧 待实现功能

- 🔲 真实的文档解析（PDF、Word等）
- 🔲 智能分块算法
- 🔲 可视化编辑器
- 🔲 用户认证
- 🔲 文件存储优化
- 🔲 性能监控

---

**说明**: 当前版本为测试框架，包含完整的API结构和模拟数据，可以用于前端开发和功能测试。