from fastapi import APIRouter
from app.api.endpoints import upload, processing, export, websocket

router = APIRouter()

router.include_router(upload.router, prefix="/upload", tags=["upload"])
router.include_router(processing.router, prefix="/processing", tags=["processing"])
router.include_router(export.router, prefix="/export", tags=["export"])
router.include_router(websocket.router, prefix="/ws", tags=["websocket"])