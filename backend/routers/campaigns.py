from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from database import get_db
from utils.deps import get_current_user
import models
from services.tasks import send_campaign_task

router = APIRouter()

class CampaignCreate(BaseModel):
    name: str
    message: str
    numbers: List[str]
    provider: str = "mock"

@router.post("/")
def create_campaign(req: CampaignCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    campaign = models.Campaign(
        user_id=user.id,
        name=req.name,
        message=req.message,
        total=len(req.numbers),
        status="draft"
    )
    db.add(campaign)
    db.commit()
    db.refresh(campaign)

    for number in req.numbers:
        log = models.SMSLog(
            user_id=user.id,
            campaign_id=campaign.id,
            to_number=number,
            body=req.message,
            provider=req.provider
        )
        db.add(log)
    db.commit()
    return {"message": "Campaign created", "campaign_id": campaign.id, "total": len(req.numbers)}

@router.post("/{campaign_id}/launch")
def launch_campaign(campaign_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    campaign = db.query(models.Campaign).filter(models.Campaign.id == campaign_id, models.Campaign.user_id == user.id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    send_campaign_task.delay(campaign_id)
    return {"message": "Campaign launched"}

@router.get("/")
def list_campaigns(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    campaigns = db.query(models.Campaign).filter(models.Campaign.user_id == user.id).all()
    return [{"id": c.id, "name": c.name, "status": c.status, "total": c.total, "sent": c.sent, "created_at": c.created_at} for c in campaigns]

@router.get("/{campaign_id}")
def get_campaign(campaign_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    c = db.query(models.Campaign).filter(models.Campaign.id == campaign_id, models.Campaign.user_id == user.id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Not found")
    return c
