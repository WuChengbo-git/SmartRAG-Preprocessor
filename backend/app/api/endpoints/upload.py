from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
import uuid
from datetime import datetime

from app.core.database import get_db
from app.models import UploadedFile

router = APIRouter()

# 确保上传目录存在
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/file")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    上传单个文件
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected")
    
    # 检查文件类型
    allowed_types = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
        "text/html",
        "text/csv",
        "application/vnd.ms-excel"
    ]
    
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail=f"File type {file.content_type} not supported"
        )
    
    # 生成唯一文件名
    file_id = str(uuid.uuid4())
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{file_id}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # 保存文件
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # 保存到数据库
        db_file = UploadedFile(
            filename=unique_filename,
            original_filename=file.filename,
            file_path=file_path,
            file_size=file.size,
            content_type=file.content_type,
            status="uploaded"
        )
        db.add(db_file)
        db.commit()
        db.refresh(db_file)
        
        return {
            "id": db_file.id,
            "filename": file.filename,
            "content_type": file.content_type,
            "size": file.size,
            "status": "uploaded",
            "upload_time": db_file.upload_time.isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

@router.post("/files")
async def upload_files(files: List[UploadFile] = File(...), db: Session = Depends(get_db)):
    """
    批量上传文件
    """
    results = []
    
    for file in files:
        try:
            result = await upload_file(file, db)
            results.append(result)
        except HTTPException as e:
            results.append({
                "filename": file.filename,
                "error": e.detail,
                "status": "failed"
            })
    
    return {"files": results}

@router.get("/files")
async def list_files(db: Session = Depends(get_db)):
    """
    获取已上传文件列表
    """
    files = db.query(UploadedFile).order_by(UploadedFile.upload_time.desc()).all()
    
    return {
        "files": [
            {
                "id": f.id,
                "filename": f.original_filename,
                "content_type": f.content_type,
                "size": f.file_size,
                "status": f.status,
                "upload_time": f.upload_time.isoformat(),
                "chunks_count": f.chunks_count
            }
            for f in files
        ]
    }

@router.delete("/files/{file_id}")
async def delete_file(file_id: int, db: Session = Depends(get_db)):
    """
    删除文件
    """
    db_file = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")
    
    # 删除物理文件
    try:
        if os.path.exists(db_file.file_path):
            os.remove(db_file.file_path)
    except Exception as e:
        print(f"Warning: Could not delete file {db_file.file_path}: {e}")
    
    # 删除数据库记录
    db.delete(db_file)
    db.commit()
    
    return {"message": "File deleted successfully"}