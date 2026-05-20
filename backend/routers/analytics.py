from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from utils.deps import get_current_user
import models

router = APIRouter()

@router.get("/overview")
def overview(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    total = db.query(models.SMSLog).filter(models.SMSLog.user_id == user.id).count()
    sent = db.query(models.SMSLog).filter(models.SMSLog.user_id == user.id, models.SMSLog.status == "sent").count()
    failed = db.query(models.SMSLog).filter(models.SMSLog.user_id == user.id, models.SMSLog.status == "failed").count()
    pending = db.query(models.SMSLog).filter(models.SMSLog.user_id == user.id, models.SMSLog.status == "pending").count()
    campaigns = db.query(models.Campaign).filter(models.Campaign.user_id == user.id).count()
    contacts = db.query(models.Contact).filter(models.Contact.user_id == user.id).count()
    return {
        "total_sms": total,
        "sent": sent,
        "failed": failed,
        "pending": pending,
        "campaigns": campaigns,
        "contacts": contacts,
        "delivery_rate": round(sent / total * 100, 1) if total > 0 else 0
    }

@router.get("/sms-by-status")
def sms_by_status(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    results = db.query(models.SMSLog.status, func.count(models.SMSLog.id))\
        .filter(models.SMSLog.user_id == user.id)\
        .group_by(models.SMSLog.status).all()
    return [{"status": r[0], "count": r[1]} for r in results]

@router.get("/campaign-stats")
def campaign_stats(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    campaigns = db.query(models.Campaign).filter(models.Campaign.user_id == user.id).all()
    return [{"name": c.name, "total": c.total, "sent": c.sent, "delivered": c.delivered, "failed": c.failed} for c in campaigns]
