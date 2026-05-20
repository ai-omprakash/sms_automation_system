from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from database import get_db
from utils.deps import get_current_user
import models
from services.tasks import send_sms_task

router = APIRouter()

class SMSSendRequest(BaseModel):
    to: str
    body: str
    provider: str = "mock"

class BulkSMSRequest(BaseModel):
    numbers: List[str]
    body: str
    provider: str = "mock"

@router.post("/send")
def send_sms(req: SMSSendRequest, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    log = models.SMSLog(
        user_id=user.id,
        to_number=req.to,
        body=req.body,
        provider=req.provider
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    send_sms_task.delay(log.id, req.to, req.body, req.provider)
    return {"message": "SMS queued", "log_id": log.id}

@router.post("/bulk")
def bulk_send(req: BulkSMSRequest, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    log_ids = []
    for number in req.numbers:
        log = models.SMSLog(user_id=user.id, to_number=number, body=req.body, provider=req.provider)
        db.add(log)
        db.commit()
        db.refresh(log)
        send_sms_task.delay(log.id, number, req.body, req.provider)
        log_ids.append(log.id)
    return {"message": f"{len(req.numbers)} SMS queued", "log_ids": log_ids}

@router.get("/logs")
def get_logs(skip: int = 0, limit: int = 50, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    logs = db.query(models.SMSLog).filter(models.SMSLog.user_id == user.id).offset(skip).limit(limit).all()
    return [{"id": l.id, "to": l.to_number, "body": l.body, "status": l.status, "created_at": l.created_at} for l in logs]

@router.get("/logs/{log_id}")
def get_log(log_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    log = db.query(models.SMSLog).filter(models.SMSLog.id == log_id, models.SMSLog.user_id == user.id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    return log
