# SmartRAG Preprocessor

[![Version](https://img.shields.io/badge/version-0.0.3-blue.svg)](https://github.com/your-username/SmartRAG-Preprocessor/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.12+-blue.svg)](https://python.org)
[![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/docker-supported-blue.svg)](https://docker.com)

🚀 支持多格式文档自动分块、可视化编辑、结构化导出及一键入库的RAG专用预处理工具

[日本語 README](README_JP.md)

## ✨ 功能特性

### 🆕 v1.0.1 新功能
- 📁 **2层文件夹管理** - 项目/子文件夹结构化组织
- 🔧 **父子块设置** - 两层级块结构，提升检索精度
- 📝 **全文对照编辑** - 左侧全文右侧块列表同步编辑
- 🏷️ **元数据管理** - 文档和块级别的详细信息管理
- 📊 **处理监控增强** - 实时统计和批量操作支持

### 🎯 核心功能
- 📄 **多格式文档支持** - PDF, Word, Excel, PowerPoint, TXT, HTML, CSV
- 🔄 **智能分块处理** - 按段落、页面、标题等多种方式分块
- ✏️ **可视化编辑器** - HTML/Markdown双模式编辑
- 📊 **实时进度监控** - 任务队列和处理状态实时更新
- 🎯 **一键导出入库** - 支持JSON、Dify、Elasticsearch格式
- 🎨 **现代化界面** - 日语界面，响应式设计
- 🐳 **一键部署** - Docker Compose 一命令启动

## 🏗️ 架构设计

```
SmartRAG-Preprocessor/
├── backend/          # Python FastAPI 后端
│   ├── app/
│   │   ├── api/      # API 路由
│   │   ├── core/     # 核心配置
│   │   ├── models/   # 数据模型
│   │   └── services/ # 业务逻辑
│   └── pyproject.toml
├── frontend/         # React TypeScript 前端
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── utils/
│   └── package.json
├── docker/          # Docker 配置
└── README.md
```

## 🚀 快速开始

### 环境要求

- **Python 3.12+** 
- **Node.js 18+**
- **Poetry** (Python 包管理器)
- **Docker** (可选，用于容器化部署)

### 安装依赖

```bash
# 后端依赖
cd backend
poetry install

# 前端依赖
cd frontend
npm install
```

### 启动开发环境

**方法1: 使用启动脚本 (推荐)**
```bash
# Linux/Mac
./start.sh

# Windows
start.bat
```

**方法2: 手动启动**
```bash
# 启动后端 (终端1)
cd backend
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8090

# 启动前端 (终端2)  
cd frontend
npm run dev
```

### 访问应用

- 🌐 **前端界面**: http://localhost:3001
- 🔧 **后端API**: http://localhost:8090
- 📚 **API文档**: http://localhost:8090/docs

## 📖 使用指南

### 1. 文件上传
- 支持拖拽上传或点击选择
- 自动验证文件格式和大小
- 实时显示上传进度

### 2. 文档处理
- 配置分块参数（大小、重叠度、方法）
- 选择分块方式：段落/页面/标题/句子
- 实时监控处理进度

### 3. 可视化编辑
- HTML/Markdown 双模式编辑
- 分块合并、拆分、内容调整
- 所见即所得预览

### 4. 导出与入库
- **JSON导出** - 标准格式，自定义Schema
- **Dify集成** - 一键导入知识库
- **Elasticsearch** - 直接索引到ES集群

## 🔧 配置说明

### 后端配置

环境变量配置 (`.env`):
```bash
# 数据库
DATABASE_URL=sqlite:///./smartrag.db

# Redis (任务队列)
REDIS_URL=redis://localhost:6379

# 文件上传
MAX_FILE_SIZE=104857600  # 100MB
UPLOAD_DIR=uploads

# 处理设置
MAX_CHUNK_SIZE=1000
DEFAULT_CHUNK_SIZE=500
```

### 前端配置

环境变量配置 (`.env.local`):
```bash
VITE_API_URL=http://localhost:8090
VITE_WS_URL=ws://localhost:8090/ws
```

## 🐳 Docker 部署

```bash
# 构建并启动所有服务
docker-compose up --build

# 后台运行
docker-compose up -d

# 停止服务
docker-compose down
```

## 🛠️ 开发指南

### 版本管理

统一版本管理，一个命令同步所有文件版本：

```bash
# 自动升级版本（推荐）
npm run version:patch  # 0.0.2 → 0.0.3 (补丁版本)
npm run version:minor  # 0.0.2 → 0.1.0 (小版本)
npm run version:major  # 0.0.2 → 1.0.0 (大版本)

# 手动指定版本
npm run version:update 0.0.3

# 当前版本：0.0.2
```

**自动更新的文件：**
- `package.json` (根目录)
- `frontend/package.json`
- `backend/pyproject.toml`
- `VERSION` 文件
- `README.md` 版本徽章
- UI界面版本显示

### 后端开发

```bash
cd backend

# 安装开发依赖
poetry install

# 代码格式化
poetry run black .

# 代码检查
poetry run flake8

# 运行测试
poetry run pytest
```

### 前端开发

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint
```

## 📋 API 文档

### 核心端点

#### 文件上传
- `POST /api/v1/upload/file` - 单文件上传
- `POST /api/v1/upload/files` - 批量上传
- `GET /api/v1/upload/files` - 获取文件列表

#### 文档处理
- `POST /api/v1/processing/chunk` - 启动分块处理
- `GET /api/v1/processing/task/{task_id}` - 获取任务状态
- `POST /api/v1/processing/preview` - 预览分块结果

#### 导出功能
- `POST /api/v1/export/json` - JSON 格式导出
- `POST /api/v1/export/dify` - Dify 知识库导入
- `POST /api/v1/export/elasticsearch` - Elasticsearch 索引

详细API文档: http://localhost:8090/docs

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request
