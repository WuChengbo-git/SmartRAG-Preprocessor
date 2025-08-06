from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, Any, Optional
import json
import os
import tempfile
from datetime import datetime

from app.core.database import get_db
from app.models import UploadedFile, DocumentChunk

router = APIRouter()

class ExportConfig(BaseModel):
    format: str = "json"  # json, dify, elasticsearch
    schema_type: str = "standard"
    include_metadata: bool = True

@router.post("/json")
async def export_to_json(
    file_id: int,
    config: ExportConfig,
    db: Session = Depends(get_db)
):
    """
    导出为JSON格式
    """
    # 检查文件是否存在
    file = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    # 获取分块数据
    chunks = db.query(DocumentChunk).filter(DocumentChunk.file_id == file_id).order_by(DocumentChunk.chunk_index).all()
    
    # 根据schema类型生成不同格式
    if config.schema_type == "dify":
        export_data = {
            "file_info": {
                "filename": file.original_filename,
                "source": file.original_filename,
                "created_at": file.upload_time.isoformat()
            },
            "chunks": [
                {
                    "text": chunk.content,
                    "metadata": json.loads(chunk.chunk_metadata) if chunk.chunk_metadata else {},
                    "source": file.original_filename
                }
                for chunk in chunks
            ]
        }
    elif config.schema_type == "elasticsearch":
        export_data = {
            "index_name": "smartrag_docs",
            "documents": [
                {
                    "content": chunk.content,
                    "title": f"{file.original_filename} - Chunk {chunk.chunk_index + 1}",
                    "metadata": json.loads(chunk.chunk_metadata) if chunk.chunk_metadata else {},
                    "timestamp": chunk.created_at.isoformat(),
                    "source_file": file.original_filename
                }
                for chunk in chunks
            ]
        }
    else:  # standard
        export_data = {
            "file_id": file_id,
            "filename": file.original_filename,
            "total_chunks": len(chunks),
            "export_time": datetime.now().isoformat(),
            "chunks": [
                {
                    "id": chunk.id,
                    "chunk_index": chunk.chunk_index,
                    "content": chunk.content,
                    "html_content": chunk.html_content,
                    "markdown_content": chunk.markdown_content,
                    "metadata": json.loads(chunk.chunk_metadata) if chunk.chunk_metadata else {}
                }
                for chunk in chunks
            ]
        }
    
    return {
        "file_id": file_id,
        "export_data": export_data,
        "config": config.dict(),
        "status": "ready",
        "total_chunks": len(chunks)
    }

@router.post("/dify")
async def export_to_dify(
    file_id: int,
    dify_config: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """
    一键导入到Dify知识库
    """
    # 检查文件是否存在
    file = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    # 获取分块数据
    chunks = db.query(DocumentChunk).filter(DocumentChunk.file_id == file_id).all()
    
    # 模拟Dify导入过程
    import time
    time.sleep(1)  # 模拟API调用延迟
    
    return {
        "file_id": file_id,
        "dify_status": "imported",
        "knowledge_base_id": dify_config.get("knowledge_base_id", "kb_123456"),
        "imported_chunks": len(chunks),
        "api_endpoint": dify_config.get("api_endpoint", "https://api.dify.ai/v1/knowledge"),
        "import_time": datetime.now().isoformat()
    }

@router.post("/elasticsearch")
async def export_to_elasticsearch(
    file_id: int,
    es_config: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """
    一键导入到Elasticsearch
    """
    # 检查文件是否存在
    file = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    # 获取分块数据
    chunks = db.query(DocumentChunk).filter(DocumentChunk.file_id == file_id).all()
    
    # 模拟Elasticsearch导入过程
    import time
    time.sleep(1)  # 模拟索引创建延迟
    
    return {
        "file_id": file_id,
        "elasticsearch_status": "indexed",
        "index_name": es_config.get("index_name", "smartrag_docs"),
        "indexed_chunks": len(chunks),
        "es_url": es_config.get("es_url", "http://localhost:9200"),
        "index_time": datetime.now().isoformat()
    }

@router.get("/download/{file_id}")
async def download_json(file_id: int, db: Session = Depends(get_db)):
    """
    下载JSON文件
    """
    # 检查文件是否存在
    file = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    # 获取分块数据
    chunks = db.query(DocumentChunk).filter(DocumentChunk.file_id == file_id).order_by(DocumentChunk.chunk_index).all()
    
    # 生成下载数据
    download_data = {
        "file_id": file_id,
        "filename": file.original_filename,
        "total_chunks": len(chunks),
        "export_time": datetime.now().isoformat(),
        "chunks": [
            {
                "id": chunk.id,
                "chunk_index": chunk.chunk_index,
                "content": chunk.content,
                "html_content": chunk.html_content,
                "markdown_content": chunk.markdown_content,
                "metadata": json.loads(chunk.chunk_metadata) if chunk.chunk_metadata else {}
            }
            for chunk in chunks
        ]
    }
    
    return JSONResponse(
        content=download_data,
        headers={
            "Content-Disposition": f"attachment; filename={file.original_filename}_chunks.json"
        }
    )

@router.get("/schemas")
async def get_export_schemas():
    """
    获取可用的导出模式
    """
    return {
        "schemas": [
            {
                "name": "standard",
                "description": "标准JSON格式",
                "fields": ["id", "content", "html_content", "markdown_content", "metadata"]
            },
            {
                "name": "dify",
                "description": "Dify知识库格式",
                "fields": ["text", "metadata", "source"]
            },
            {
                "name": "elasticsearch",
                "description": "Elasticsearch索引格式",
                "fields": ["content", "title", "metadata", "timestamp", "source_file"]
            }
        ]
    }