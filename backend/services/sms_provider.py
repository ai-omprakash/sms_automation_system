import httpx
from config import settings

class SMSProvider:
    """Abstract SMS provider interface."""

    @staticmethod
    def send(to: str, body: str, provider: str = "twilio") -> dict:
        if provider == "twilio":
            return SMSProvider._send_twilio(to, body)
        elif provider == "vonage":
            return SMSProvider._send_vonage(to, body)
        elif provider == "fast2sms":
            return SMSProvider._send_fast2sms(to, body)
        else:
            return SMSProvider._send_mock(to, body)

    @staticmethod
    def _send_twilio(to: str, body: str) -> dict:
        if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN:
            return SMSProvider._send_mock(to, body)
        try:
            from twilio.rest import Client
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            msg = client.messages.create(body=body, from_=settings.TWILIO_FROM_NUMBER, to=to)
            return {"success": True, "sid": msg.sid, "provider": "twilio"}
        except Exception as e:
            return {"success": False, "error": str(e), "provider": "twilio"}

    @staticmethod
    def _send_vonage(to: str, body: str) -> dict:
        if not settings.VONAGE_API_KEY:
            return SMSProvider._send_mock(to, body)
        try:
            import vonage
            client = vonage.Client(key=settings.VONAGE_API_KEY, secret=settings.VONAGE_API_SECRET)
            sms = vonage.Sms(client)
            res = sms.send_message({"from": settings.VONAGE_FROM, "to": to, "text": body})
            return {"success": True, "sid": res["messages"][0]["message-id"], "provider": "vonage"}
        except Exception as e:
            return {"success": False, "error": str(e), "provider": "vonage"}

    @staticmethod
    def _send_fast2sms(to: str, body: str) -> dict:
        if not settings.FAST2SMS_API_KEY:
            return SMSProvider._send_mock(to, body)
        try:
            resp = httpx.post(
                "https://www.fast2sms.com/dev/bulkV2",
                headers={"authorization": settings.FAST2SMS_API_KEY},
                json={"route": "q", "message": body, "numbers": to}
            )
            data = resp.json()
            return {"success": data.get("return", False), "sid": str(data.get("request_id", "")), "provider": "fast2sms"}
        except Exception as e:
            return {"success": False, "error": str(e), "provider": "fast2sms"}

    @staticmethod
    def _send_mock(to: str, body: str) -> dict:
        """Simulated send — for testing without a real provider."""
        print(f"[MOCK SMS] To: {to} | Message: {body}")
        return {"success": True, "sid": f"MOCK_{to[-4:]}", "provider": "mock"}
