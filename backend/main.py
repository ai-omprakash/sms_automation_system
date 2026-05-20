from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from database import engine, Base, SessionLocal
from routers import auth, sms, campaigns, contacts, templates, analytics, api_keys, schedules, webhooks

# ── Create all DB tables on startup ──────────────────────────
Base.metadata.create_all(bind=engine)

# ── Seed default admin if not present ────────────────────────
def seed_admin():
    import models
    from utils.auth import hash_password
    db = SessionLocal()
    try:
        exists = db.query(models.User).filter(models.User.username == "omprakash").first()
        if not exists:
            admin = models.User(
                email="omprakash@sms.com",
                username="omprakash",
                hashed_password=hash_password("Om@1234"),
                full_name="Om Prakash",
                role=models.RoleEnum.admin,
                is_active=True,
                is_verified=True,
            )
            db.add(admin)
            db.commit()
            print("[startup] Default admin user created: omprakash / Om@1234")
        else:
            print("[startup] Admin user already exists.")
    except Exception as e:
        print(f"[startup] Seed skipped: {e}")
    finally:
        db.close()

seed_admin()

# ── App setup ─────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="SMS Automation System",
    description="Enterprise-grade SMS platform for bulk messaging, campaigns, analytics and automation.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,      prefix="/api/auth",      tags=["Authentication"])
app.include_router(sms.router,       prefix="/api/sms",       tags=["SMS"])
app.include_router(campaigns.router, prefix="/api/campaigns", tags=["Campaigns"])
app.include_router(contacts.router,  prefix="/api/contacts",  tags=["Contacts"])
app.include_router(templates.router, prefix="/api/templates", tags=["Templates"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(api_keys.router,  prefix="/api/keys",      tags=["API Keys"])
app.include_router(schedules.router, prefix="/api/schedules", tags=["Schedules"])
app.include_router(webhooks.router,  prefix="/api/webhooks",  tags=["Webhooks"])

@app.get("/", tags=["Health"])
def root():
    return {"service": "SMS Automation System", "status": "running", "docs": "/docs", "version": "1.0.0"}

@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}
