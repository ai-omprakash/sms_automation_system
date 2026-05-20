-- ============================================================
--  SMS Automation System — MySQL Setup Script
--  Run this ONCE before starting the backend.
--  Usage:  mysql -u root -p < sms_system.sql
-- ============================================================

-- 1. Create database
CREATE DATABASE IF NOT EXISTS sms_system
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE sms_system;

-- ============================================================
-- 2. Tables
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    email            VARCHAR(255) NOT NULL UNIQUE,
    username         VARCHAR(100) NOT NULL UNIQUE,
    hashed_password  VARCHAR(255) NOT NULL,
    full_name        VARCHAR(255),
    role             ENUM('admin','manager','user') DEFAULT 'user',
    is_active        TINYINT(1) DEFAULT 1,
    is_verified      TINYINT(1) DEFAULT 0,
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email    (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS contact_groups (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    user_id    INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS contacts (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT,
    name       VARCHAR(255),
    phone      VARCHAR(20) NOT NULL,
    email      VARCHAR(255),
    group_id   INT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)  REFERENCES users(id)          ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES contact_groups(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS templates (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT,
    name       VARCHAR(255) NOT NULL,
    body       TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS campaigns (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT,
    name         VARCHAR(255) NOT NULL,
    message      TEXT NOT NULL,
    status       VARCHAR(50) DEFAULT 'draft',
    total        INT DEFAULT 0,
    sent         INT DEFAULT 0,
    delivered    INT DEFAULT 0,
    failed       INT DEFAULT 0,
    scheduled_at DATETIME DEFAULT NULL,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS sms_logs (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT,
    campaign_id  INT DEFAULT NULL,
    to_number    VARCHAR(20) NOT NULL,
    from_number  VARCHAR(20),
    body         TEXT NOT NULL,
    status       ENUM('pending','sent','delivered','failed','scheduled') DEFAULT 'pending',
    provider     VARCHAR(50) DEFAULT 'mock',
    provider_sid VARCHAR(255),
    error_msg    TEXT,
    sent_at      DATETIME DEFAULT NULL,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)     REFERENCES users(id)     ON DELETE CASCADE,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL,
    INDEX idx_user_id    (user_id),
    INDEX idx_campaign   (campaign_id),
    INDEX idx_status     (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS schedules (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT,
    name         VARCHAR(255),
    message      TEXT NOT NULL,
    to_number    VARCHAR(20) NOT NULL,
    cron_expr    VARCHAR(100),
    run_at       DATETIME DEFAULT NULL,
    is_recurring TINYINT(1) DEFAULT 0,
    is_active    TINYINT(1) DEFAULT 1,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS api_keys (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT,
    name       VARCHAR(255) NOT NULL,
    `key`      VARCHAR(100) NOT NULL UNIQUE,
    is_active  TINYINT(1) DEFAULT 1,
    usage      INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_key (key(20))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS audit_logs (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT DEFAULT NULL,
    action     VARCHAR(255) NOT NULL,
    detail     TEXT,
    ip_address VARCHAR(45),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 3. Seed: default admin user
--    username : omprakash
--    password : Om@1234   (bcrypt hash below)
-- ============================================================
INSERT IGNORE INTO users
    (email, username, hashed_password, full_name, role, is_active, is_verified)
VALUES
    (
        'omprakash@sms.com',
        'omprakash',
        '$2b$12$rV9XeLazzOhkwXB.K4OyQuIi5G1jWZNl8NyH8euU7jp9JPKG1dqsu',
        'Om Prakash',
        'admin',
        1,
        1
    );

-- ============================================================
-- Done! The FastAPI backend will auto-sync any future schema
-- changes via Base.metadata.create_all() on startup.
-- ============================================================
SELECT 'sms_system database ready!' AS status;
