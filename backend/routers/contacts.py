from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from utils.deps import get_current_user
import models, csv, io

router = APIRouter()

class ContactCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    group_id: Optional[int] = None

@router.post("/")
def create_contact(req: ContactCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    contact = models.Contact(user_id=user.id, **req.dict())
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return {"id": contact.id, "name": contact.name, "phone": contact.phone}

@router.get("/")
def list_contacts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    contacts = db.query(models.Contact).filter(models.Contact.user_id == user.id).offset(skip).limit(limit).all()
    return [{"id": c.id, "name": c.name, "phone": c.phone, "email": c.email} for c in contacts]

@router.post("/import")
async def import_csv(file: UploadFile = File(...), db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    content = await file.read()
    reader = csv.DictReader(io.StringIO(content.decode()))
    created = 0
    for row in reader:
        c = models.Contact(user_id=user.id, name=row.get("name",""), phone=row.get("phone",""), email=row.get("email",""))
        db.add(c)
        created += 1
    db.commit()
    return {"imported": created}

@router.delete("/{contact_id}")
def delete_contact(contact_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    c = db.query(models.Contact).filter(models.Contact.id == contact_id, models.Contact.user_id == user.id).first()
    if not c:
        raise HTTPException(404, "Not found")
    db.delete(c)
    db.commit()
    return {"deleted": True}
