from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from typing import List, Dict
import json
import asyncio

from app.core.database import get_db
from app.models import ProcessingTask

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.task_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        
        # Remove from task connections
        for task_id, connections in self.task_connections.items():
            if websocket in connections:
                connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
        except:
            self.disconnect(websocket)

    async def broadcast(self, message: str):
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                disconnected.append(connection)
        
        # Clean up disconnected connections
        for conn in disconnected:
            self.disconnect(conn)

    async def send_to_task_subscribers(self, task_id: int, message: str):
        if task_id in self.task_connections:
            disconnected = []
            for connection in self.task_connections[task_id]:
                try:
                    await connection.send_text(message)
                except:
                    disconnected.append(connection)
            
            # Clean up disconnected connections
            for conn in disconnected:
                self.task_connections[task_id].remove(conn)

    def subscribe_to_task(self, task_id: int, websocket: WebSocket):
        if task_id not in self.task_connections:
            self.task_connections[task_id] = []
        if websocket not in self.task_connections[task_id]:
            self.task_connections[task_id].append(websocket)

manager = ConnectionManager()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
                
                if message.get("type") == "subscribe_task":
                    task_id = message.get("task_id")
                    if task_id:
                        manager.subscribe_to_task(task_id, websocket)
                        await manager.send_personal_message(
                            json.dumps({
                                "type": "subscription_confirmed",
                                "task_id": task_id
                            }),
                            websocket
                        )
                
                elif message.get("type") == "ping":
                    await manager.send_personal_message(
                        json.dumps({"type": "pong"}),
                        websocket
                    )
                    
            except json.JSONDecodeError:
                await manager.send_personal_message(
                    json.dumps({"type": "error", "message": "Invalid JSON"}),
                    websocket
                )
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)

async def send_task_update(task_id: int, status: str, progress: float = None, message: str = None):
    """
    Send task update to all subscribers
    """
    update_data = {
        "type": "task_update",
        "task_id": task_id,
        "status": status,
        "timestamp": asyncio.get_event_loop().time()
    }
    
    if progress is not None:
        update_data["progress"] = progress
    
    if message:
        update_data["message"] = message
    
    await manager.send_to_task_subscribers(task_id, json.dumps(update_data))

@router.get("/connections")
async def get_connection_stats():
    """
    Get WebSocket connection statistics
    """
    return {
        "total_connections": len(manager.active_connections),
        "task_subscriptions": {
            str(task_id): len(connections) 
            for task_id, connections in manager.task_connections.items()
        }
    }