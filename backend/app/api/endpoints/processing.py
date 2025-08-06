from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
import json
import asyncio
import random
import time

from app.core.database import get_db
from app.models import UploadedFile, ProcessingTask, DocumentChunk

router = APIRouter()

class ChunkConfig(BaseModel):
    chunk_size: int = 500
    chunk_overlap: int = 50
    chunk_method: str = "paragraph"  # paragraph, page, heading

# 模拟处理任务的后台函数
async def simulate_processing_task(task_id: int, file_id: int, config: ChunkConfig, db: Session):
    """
    模拟文档处理任务
    """
    from app.api.endpoints.websocket import send_task_update
    
    # 更新任务状态为running
    task = db.query(ProcessingTask).filter(ProcessingTask.id == task_id).first()
    if task:
        task.status = "running"
        task.progress = 0.0
        db.commit()
        
        # Send WebSocket update
        await send_task_update(task_id, "running", 0.0, "処理を開始しています...")
    
    # 模拟处理过程
    total_chunks = random.randint(15, 30)
    
    for i in range(total_chunks):
        if task:
            # 更新进度
            progress = (i + 1) / total_chunks * 100
            task.progress = progress
            db.commit()
            
            # Send WebSocket update
            await send_task_update(
                task_id, 
                "running", 
                progress, 
                f"チャンク {i+1}/{total_chunks} を処理中..."
            )
            
            # 创建模拟的分块
            chunk = DocumentChunk(
                file_id=file_id,
                chunk_index=i,
                content=f"这是第 {i+1} 个分块的内容。本分块包含了文档的重要信息，使用 {config.chunk_method} 方法进行分割，大小限制为 {config.chunk_size} 字符。",
                html_content=f"<p>这是第 {i+1} 个分块的内容。</p><p>本分块包含了文档的重要信息。</p>",
                markdown_content=f"## 分块 {i+1}\n\n这是第 {i+1} 个分块的内容。\n\n本分块包含了文档的重要信息。",
                chunk_metadata=json.dumps({
                    "page": (i // 5) + 1,
                    "type": "paragraph",
                    "tokens": random.randint(30, 80),
                    "method": config.chunk_method
                })
            )
            db.add(chunk)
            db.commit()
        
        # 模拟处理时间
        await asyncio.sleep(0.1)
    
    # 完成任务
    if task:
        task.status = "completed"
        task.progress = 100.0
        db.commit()
        
        # Send WebSocket update
        await send_task_update(task_id, "completed", 100.0, "処理が完了しました！")
        
        # 更新文件状态
        file = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
        if file:
            file.status = "completed"
            file.chunks_count = total_chunks
            db.commit()

@router.post("/chunk")
async def process_document(
    file_id: int,
    config: ChunkConfig,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    处理文档分块
    """
    # 检查文件是否存在
    file = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    # 更新文件状态
    file.status = "processing"
    db.commit()
    
    # 创建处理任务
    task = ProcessingTask(
        file_id=file_id,
        task_type="chunk",
        status="pending",
        config=json.dumps(config.dict())
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    
    # 启动后台任务
    background_tasks.add_task(simulate_processing_task, task.id, file_id, config, db)
    
    return {
        "task_id": task.id,
        "file_id": file_id,
        "config": config.dict(),
        "status": "processing",
        "message": "Processing started"
    }

@router.get("/task/{task_id}")
async def get_task_status(task_id: int, db: Session = Depends(get_db)):
    """
    获取任务状态
    """
    task = db.query(ProcessingTask).filter(ProcessingTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return {
        "task_id": task.id,
        "file_id": task.file_id,
        "status": task.status,
        "progress": task.progress,
        "task_type": task.task_type,
        "created_at": task.created_at.isoformat(),
        "started_at": task.started_at.isoformat() if task.started_at else None,
        "completed_at": task.completed_at.isoformat() if task.completed_at else None
    }

@router.get("/tasks")
async def list_tasks(db: Session = Depends(get_db)):
    """
    获取任务列表
    """
    tasks = db.query(ProcessingTask).order_by(ProcessingTask.created_at.desc()).all()
    
    return {
        "tasks": [
            {
                "id": task.id,
                "file_id": task.file_id,
                "task_type": task.task_type,
                "status": task.status,
                "progress": task.progress,
                "created_at": task.created_at.isoformat()
            }
            for task in tasks
        ]
    }

@router.get("/preview/{file_id}")
async def preview_chunks(file_id: int, db: Session = Depends(get_db)):
    """
    预览分块结果
    """
    # 检查文件是否存在
    file = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    # 获取分块
    chunks = db.query(DocumentChunk).filter(DocumentChunk.file_id == file_id).order_by(DocumentChunk.chunk_index).all()
    
    return {
        "file_id": file_id,
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

@router.delete("/task/{task_id}")
async def cancel_task(task_id: int, db: Session = Depends(get_db)):
    """
    取消任务
    """
    task = db.query(ProcessingTask).filter(ProcessingTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    if task.status in ["completed", "failed"]:
        raise HTTPException(status_code=400, detail="Cannot cancel completed or failed task")
    
    task.status = "cancelled"
    db.commit()
    
    return {"message": "Task cancelled successfully"}