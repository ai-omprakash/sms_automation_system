from fastapi import APIRouter, Request
router = APIRouter()

@router.post("/twilio")
async def twilio_webhook(request: Request):
    """Twilio delivery status callback."""
    form = await request.form()
    sid = form.get("MessageSid")
    status = form.get("MessageStatus")
    print(f"[Webhook] Twilio SID={sid} Status={status}")
    # Update DB status here if needed
    return {"received": True}

@router.post("/vonage")
async def vonage_webhook(request: Request):
    """Vonage delivery receipt callback."""
    data = await request.json()
    print(f"[Webhook] Vonage: {data}")
    return {"received": True}
