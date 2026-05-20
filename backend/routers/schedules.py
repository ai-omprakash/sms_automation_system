from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from database import get_db
from utils.deps import get_current_user
import models

router = APIRouter()

class ScheduleCreate(BaseModel):
    name: str
    message: str
    to_number: str
    run_at: datetime
    is_recurring: bool = False
    cron_expr: Optional[str] = None

@router.post("/")
def create_schedule(req: ScheduleCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    s = models.Schedule(user_id=user.id, **req.dict())
    db.add(s)
    db.commit()
    db.refresh(s)
    return {"id": s.id, "name": s.name, "run_at": s.run_at}

@router.get("/")
def list_schedules(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    schedules = db.query(models.Schedule).filter(models.Schedule.user_id == user.id).all()
    return [{"id": s.id, "name": s.name, "to": s.to_number, "run_at": s.run_at, "is_active": s.is_active} for s in schedules]

@router.delete("/{schedule_id}")
def delete_schedule(schedule_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    s = db.query(models.Schedule).filter(models.Schedule.id == schedule_id, models.Schedule.user_id == user.id).first()
    if not s:
        raise HTTPException(404, "Not found")
    db.delete(s)
    db.commit()
    return {"deleted": True}
