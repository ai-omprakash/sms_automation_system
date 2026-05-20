from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings

# MySQL engine — no check_same_thread needed (that's SQLite only)
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,        # reconnect if MySQL drops idle connection
    pool_recycle=3600,         # recycle connections every hour
    pool_size=10,
    max_overflow=20,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
