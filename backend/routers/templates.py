from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from utils.deps import get_current_user
import models

router = APIRouter()

class TemplateCreate(BaseModel):
    name: str
    body: str

@router.post("/")
def create_template(req: TemplateCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    t = models.SMSTemplate(user_id=user.id, name=req.name, body=req.body)
    db.add(t)
    db.commit()
    db.refresh(t)
    return {"id": t.id, "name": t.name}

@router.get("/")
def list_templates(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    templates = db.query(models.SMSTemplate).filter(models.SMSTemplate.user_id == user.id).all()
    return [{"id": t.id, "name": t.name, "body": t.body, "created_at": t.created_at} for t in templates]

@router.delete("/{template_id}")
def delete_template(template_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    t = db.query(models.SMSTemplate).filter(models.SMSTemplate.id == template_id, models.SMSTemplate.user_id == user.id).first()
    if not t:
        raise HTTPException(404, "Not found")
    db.delete(t)
    db.commit()
    return {"deleted": True}
