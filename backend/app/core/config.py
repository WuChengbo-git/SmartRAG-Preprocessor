from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "SmartRAG Preprocessor"
    VERSION: str = "1.0.0"
    
    # CORS settings - 添加远程访问支持
    CORS_ORIGINS: List[str] = [
        "http://localhost:3001", 
        "http://127.0.0.1:3001",
        "http://0.0.0.0:3001",
        # 添加你的服务器IP，格式: "http://YOUR_SERVER_IP:3001"
    ]
    
    # File upload settings
    MAX_FILE_SIZE: int = 100 * 1024 * 1024  # 100MB
    UPLOAD_DIR: str = "uploads"
    
    # Database settings
    DATABASE_URL: str = "sqlite:///./smartrag.db"
    
    # Redis settings (for task queue)
    REDIS_URL: str = "redis://localhost:6379"
    
    # Processing settings
    MAX_CHUNK_SIZE: int = 1000
    DEFAULT_CHUNK_SIZE: int = 500
    
    class Config:
        env_file = ".env"

settings = Settings()