from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import ChatRequest
from app.ai.agent import chat_stream

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("")
async def handle_chat_message(
    req: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    Realtime Server-Sent Events endpoint for SETU AI Assistant.
    """
    history = [{"role": m.role, "content": m.content} for m in req.conversation_history or []]
    
    return StreamingResponse(
        chat_stream(
            message=req.message,
            language=req.language or "en",
            conversation_history=history,
            user_profile=req.user_profile or {},
            db=db
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
