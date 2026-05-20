"""
SMS Task Queue
--------------
Uses Celery + Redis when available.
Falls back to synchronous execution if Redis is not running (dev mode).
"""
import os
from config import settings

# Try to create a real Celery app; if broker is unreachable it falls back to eager mode
try:
    from celery import Celery

    celery_app = Celery(
        "sms_tasks",
        broker=settings.CELERY_BROKER_URL,
        backend=settings.CELERY_RESULT_BACKEND,
    )
    celery_app.conf.update(
        task_serializer="json",
        result_serializer="json",
        accept_content=["json"],
        timezone="UTC",
        enable_utc=True,
        # In dev: run tasks synchronously when broker is unavailable
        task_always_eager=os.getenv("CELERY_ALWAYS_EAGER", "true").lower() == "true",
    )
except Exception:
    celery_app = None


def _run_send_sms(sms_log_id: int, to: str, body: str, provider: str = "mock"):
    """Core SMS send logic — used by both Celery task and sync fallback."""
    from database import SessionLocal
    from services.sms_provider import SMSProvider
    import models
    from datetime import datetime

    db = SessionLocal()
    try:
        log = db.query(models.SMSLog).filter(models.SMSLog.id == sms_log_id).first()
        result = SMSProvider.send(to=to, body=body, provider=provider)

        if log:
            if result["success"]:
                log.status = models.SMSStatusEnum.sent
                log.provider_sid = result.get("sid")
                log.sent_at = datetime.utcnow()
            else:
                log.status = models.SMSStatusEnum.failed
                log.error_msg = result.get("error", "Unknown error")
            db.commit()
        return result
    finally:
        db.close()


if celery_app:
    @celery_app.task(bind=True, max_retries=3)
    def send_sms_task(self, sms_log_id: int, to: str, body: str, provider: str = "mock"):
        try:
            return _run_send_sms(sms_log_id, to, body, provider)
        except Exception as exc:
            raise self.retry(exc=exc, countdown=60)

    @celery_app.task
    def send_campaign_task(campaign_id: int, provider: str = "mock"):
        from database import SessionLocal
        import models

        db = SessionLocal()
        try:
            campaign = db.query(models.Campaign).filter(models.Campaign.id == campaign_id).first()
            if not campaign:
                return {"error": "Campaign not found"}
            campaign.status = "running"
            db.commit()
            logs = db.query(models.SMSLog).filter(models.SMSLog.campaign_id == campaign_id).all()
            for log in logs:
                send_sms_task.delay(log.id, log.to_number, log.body, provider)
            campaign.status = "sent"
            campaign.sent = len(logs)
            db.commit()
            return {"sent": len(logs)}
        finally:
            db.close()

else:
    # Sync stubs when Celery is not available
    class _FakeTask:
        def delay(self, *args, **kwargs):
            return _run_send_sms(*args, **kwargs)

    send_sms_task = _FakeTask()

    class _FakeCampaignTask:
        def delay(self, campaign_id: int, provider: str = "mock"):
            from database import SessionLocal
            import models
            db = SessionLocal()
            try:
                campaign = db.query(models.Campaign).filter(models.Campaign.id == campaign_id).first()
                if not campaign:
                    return
                campaign.status = "running"
                db.commit()
                logs = db.query(models.SMSLog).filter(models.SMSLog.campaign_id == campaign_id).all()
                for log in logs:
                    _run_send_sms(log.id, log.to_number, log.body, provider)
                campaign.status = "sent"
                campaign.sent = len(logs)
                db.commit()
            finally:
                db.close()

    send_campaign_task = _FakeCampaignTask()
