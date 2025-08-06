# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SmartRAG-Preprocessor is a comprehensive preprocessing tool for RAG (Retrieval-Augmented Generation) systems that supports:
- Multi-format document processing (PDF, Word, Excel, PowerPoint, HTML, CSV, TXT)
- Intelligent document chunking with visual editing capabilities
- Export to JSON format compatible with RAG/Dify/Elasticsearch
- One-click deployment with Docker

## Architecture

**Monorepo Structure:**
- `backend/` - FastAPI Python backend with document processing
- `frontend/` - React frontend with Vite + Ant Design
- `docker/` - Docker configuration and deployment files

**Key Components:**
- Document Parser: Handles multiple file formats using specialized libraries
- Chunking Engine: Intelligent text segmentation with configurable rules
- Task Queue: Async processing with progress tracking
- Export System: JSON export with configurable schemas
- WYSIWYG Editor: Visual chunk editing and preview

## Development Setup

```bash
# 方法1: 一键启动 (推荐)
./start.sh                    # Linux/Mac
start.bat                     # Windows
npm run start                 # 或者用npm

# 方法2: 使用npm并行启动
npm install                   # 安装concurrently
npm run dev                   # 同时启动前后端

# 方法3: 手动分别启动
npm run install:all           # 安装所有依赖
npm run dev:backend           # 启动后端 (port 8090)
npm run dev:frontend          # 启动前端 (port 3001)
```

## Common Commands

**Backend:**
- `uvicorn main:app --reload` - Start development server
- `pytest` - Run tests
- `black .` - Format code
- `flake8` - Lint code

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Lint code

**Docker:**
- `docker-compose up` - Start full stack
- `docker-compose up --build` - Rebuild and start
- `docker-compose down` - Stop services

## Key Libraries

**Backend:**
- FastAPI - Web framework
- pdfplumber - PDF processing
- python-docx - Word document processing
- python-pptx - PowerPoint processing
- pandas - Excel/CSV processing
- BeautifulSoup4 - HTML processing
- celery - Task queue (optional)

**Frontend:**
- React + Vite - Frontend framework
- Ant Design - UI components
- Monaco Editor - Code editing
- Axios - HTTP client

## File Processing Flow

1. Upload → Validation → Queue
2. Parse → Extract structure → Chunk
3. Preview → Edit → Export
4. One-click import to target systems

## Frontend Architecture

**Pages:**
- `Dashboard` - システム概要とファイル統計
- `FileUpload` - ファイルアップロード管理
- `Processing` - 文書処理と分割設定
- `Editor` - ビジュアルエディタ (HTML/Markdown)
- `Export` - エクスポート設定と履歴
- `Tasks` - タスクキューと履歴
- `Settings` - システム設定

**Key Features:**
- 日本語UI - 全インターフェース日本語対応
- リアルタイム更新 - WebSocketによる進捗更新
- レスポンシブデザイン - モバイル対応
- 状態管理 - Zustand + React Query
- ファイル管理 - 拖拽上传、进度显示
- 分块编辑 - 可视化编辑器、HTML/Markdown切换

**API Integration:**
- `/api/v1/upload/*` - ファイルアップロード
- `/api/v1/processing/*` - 文書処理
- `/api/v1/export/*` - エクスポート機能
- WebSocket - リアルタイム状態更新

## Configuration

- Chunking rules configurable via UI and config files
- Export schemas adaptable for different RAG systems
- Environment variables for deployment settings
- Frontend settings persisted in localStorage