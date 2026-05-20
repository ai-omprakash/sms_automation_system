from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Enum, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class RoleEnum(str, enum.Enum):
    admin   = "admin"
    manager = "manager"
    user    = "user"

class SMSStatusEnum(str, enum.Enum):
    pending   = "pending"
    sent      = "sent"
    delivered = "delivered"
    failed    = "failed"
    scheduled = "scheduled"

class User(Base):
    __tablename__ = "users"
    id               = Column(Integer, primary_key=True, index=True)
    email            = Column(String(255), unique=True, index=True, nullable=False)
    username         = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password  = Column(String(255), nullable=False)
    full_name        = Column(String(255))
    role             = Column(Enum(RoleEnum), default=RoleEnum.user)
    is_active        = Column(Boolean, default=True)
    is_verified      = Column(Boolean, default=False)
    created_at       = Column(DateTime(timezone=True), server_default=func.now())
    updated_at       = Column(DateTime(timezone=True), onupdate=func.now())

    sms_logs  = relationship("SMSLog",   back_populates="user")
    campaigns = relationship("Campaign", back_populates="user")
    api_keys  = relationship("APIKey",   back_populates="user")
    contacts  = relationship("Contact",  back_populates="user")

class Contact(Base):
    __tablename__ = "contacts"
    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    name       = Column(String(255))
    phone      = Column(String(20), nullable=False)
    email      = Column(String(255))
    group_id   = Column(Integer, ForeignKey("contact_groups.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user  = relationship("User",         back_populates="contacts")
    group = relationship("ContactGroup", back_populates="contacts")

class ContactGroup(Base):
    __tablename__ = "contact_groups"
    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String(255), nullable=False)
    user_id    = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    contacts = relationship("Contact", back_populates="group")

class SMSTemplate(Base):
    __tablename__ = "templates"
    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    name       = Column(String(255), nullable=False)
    body       = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SMSLog(Base):
    __tablename__ = "sms_logs"
    id           = Column(Integer, primary_key=True, index=True)
    user_id      = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    campaign_id  = Column(Integer, ForeignKey("campaigns.id", ondelete="SET NULL"), nullable=True)
    to_number    = Column(String(20), nullable=False)
    from_number  = Column(String(20))
    body         = Column(Text, nullable=False)
    status       = Column(Enum(SMSStatusEnum), default=SMSStatusEnum.pending)
    provider     = Column(String(50), default="mock")
    provider_sid = Column(String(255), nullable=True)
    error_msg    = Column(Text, nullable=True)
    sent_at      = Column(DateTime(timezone=True), nullable=True)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())

    user     = relationship("User",     back_populates="sms_logs")
    campaign = relationship("Campaign", back_populates="sms_logs")

class Campaign(Base):
    __tablename__ = "campaigns"
    id           = Column(Integer, primary_key=True, index=True)
    user_id      = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    name         = Column(String(255), nullable=False)
    message      = Column(Text, nullable=False)
    status       = Column(String(50), default="draft")
    total        = Column(Integer, default=0)
    sent         = Column(Integer, default=0)
    delivered    = Column(Integer, default=0)
    failed       = Column(Integer, default=0)
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())

    user     = relationship("User",   back_populates="campaigns")
    sms_logs = relationship("SMSLog", back_populates="campaign")

class Schedule(Base):
    __tablename__ = "schedules"
    id           = Column(Integer, primary_key=True, index=True)
    user_id      = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    name         = Column(String(255))
    message      = Column(Text, nullable=False)
    to_number    = Column(String(20), nullable=False)
    cron_expr    = Column(String(100), nullable=True)
    run_at       = Column(DateTime(timezone=True), nullable=True)
    is_recurring = Column(Boolean, default=False)
    is_active    = Column(Boolean, default=True)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())

class APIKey(Base):
    __tablename__ = "api_keys"
    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    name       = Column(String(255), nullable=False)
    key        = Column(String(100), unique=True, nullable=False)
    is_active  = Column(Boolean, default=True)
    usage      = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="api_keys")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action     = Column(String(255), nullable=False)
    detail     = Column(Text)
    ip_address = Column(String(45))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
