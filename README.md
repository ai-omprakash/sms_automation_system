# 📱 SMS Pro — Automation Platform

A professional SMS automation system built with FastAPI + React + MySQL.

---

## 🚀 HOW TO RUN (Step by Step)

### STEP 1 — Start XAMPP
Open XAMPP Control Panel and click **Start** next to:
- ✅ Apache
- ✅ MySQL

---

### STEP 2 — Import Database
1. Open http://localhost/phpmyadmin
2. Click **New** in left sidebar
3. Database name: `sms_system` → Collation: `utf8mb4_unicode_ci` → **Create**
4. Click the `sms_system` database
5. Click **Import** tab
6. Choose file: `sms_system.sql` (in this folder)
7. Click **Go**

---

### STEP 3 — Configure .env
Open `backend/.env` and make sure this line is correct:
```
DATABASE_URL=mysql+pymysql://root:@localhost:3306/sms_system
```
If you have a MySQL password, change it to:
```
DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/sms_system
```

---

### STEP 4 — Start Backend
Double-click **START_BACKEND.bat**

Wait until you see:
```
INFO: Uvicorn running on http://127.0.0.1:8000
[startup] Default admin user created: omprakash / Om@1234
```

---

### STEP 5 — Start Frontend
Double-click **START_FRONTEND.bat**

Wait until you see:
```
VITE ready on http://localhost:5173
```

---

### STEP 6 — Open Browser
Go to: **http://localhost:5173**

---

## 🔐 Default Login
| Field    | Value         |
|----------|---------------|
| Username | `omprakash`   |
| Password | `Om@1234`     |

You can also **Register** a new account from the Register page.

---

## 📁 Project Structure
```
sms_pro/
├── sms_system.sql          ← Import this in phpMyAdmin FIRST
├── START_BACKEND.bat       ← Double-click to start backend
├── START_FRONTEND.bat      ← Double-click to start frontend
├── backend/
│   ├── .env                ← Set your DB password here
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── config.py
│   ├── requirements.txt
│   ├── routers/
│   ├── services/
│   └── utils/
└── frontend/
    ├── package.json
    └── src/
        ├── pages/          ← All pages
        ├── components/     ← Sidebar, etc.
        ├── context/        ← Auth
        └── api/            ← API helper
```

---

## ✅ Features
- 🔐 Login & Register system (JWT)
- 📊 Dashboard with live charts
- 📤 Send single SMS
- 📢 Bulk campaigns
- 👥 Contact management
- 📝 SMS Templates
- ⏰ Message Scheduler
- 📈 Analytics & reports
- 🔑 API Key management
- 🎨 Professional dark sidebar UI

---

## ⚙️ Requirements
- Python 3.9+
- Node.js 18+
- XAMPP (MySQL + Apache)
