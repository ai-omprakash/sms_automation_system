from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from utils.deps import get_current_user
import models, secrets

router = APIRouter()

class APIKeyCreate(BaseModel):
    name: str

@router.post("/")
def create_key(req: APIKeyCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    key = "sms_" + secrets.token_hex(24)
    api_key = models.APIKey(user_id=user.id, name=req.name, key=key)
    db.add(api_key)
    db.commit()
    db.refresh(api_key)
    return {"id": api_key.id, "name": api_key.name, "key": key, "message": "Save this key — it won't be shown again."}

@router.get("/")
def list_keys(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    keys = db.query(models.APIKey).filter(models.APIKey.user_id == user.id).all()
    return [{"id": k.id, "name": k.name, "key": k.key[:12] + "...", "usage": k.usage, "is_active": k.is_active} for k in keys]

@router.delete("/{key_id}")
def revoke_key(key_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    k = db.query(models.APIKey).filter(models.APIKey.id == key_id, models.APIKey.user_id == user.id).first()
    if not k:
        raise HTTPException(404, "Key not found")
    k.is_active = False
    db.commit()
    return {"revoked": True}
