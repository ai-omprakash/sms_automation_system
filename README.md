# 📱 SMS Pro — Enterprise SMS Automation System

🚀 **SMS Pro** is a full-stack enterprise-level SMS automation platform built with **FastAPI (Python), React (Vite), and MySQL**.  
It is designed to manage **SMS campaigns, contacts, templates, scheduling, analytics, and API-based messaging automation** in one unified system.

---

## 👨‍💻 Developer

**Omprakash Gharti Magar**  
📧 Email: omprakashghartimagar301@gmail.com  
🌐 GitHub: https://github.com/ai-omprakash  

---

## 🎯 Project Purpose

This project was built to simulate a **real-world SaaS SMS platform** similar to Twilio-like systems, allowing:

- Businesses to send bulk SMS
- Manage customer contacts
- Run marketing campaigns
- Schedule automated messages
- Track delivery analytics

It demonstrates full-stack development skills including:

- Backend API development
- Authentication & security
- Database design
- Frontend UI architecture
- REST API integration

---

## ✨ Key Features

### 🔐 Authentication System
- User Registration & Login
- JWT-based secure authentication
- Protected API routes
- Auto token validation

---

### 📤 SMS Management
- Send single SMS instantly
- Bulk SMS sending
- Message status tracking
- Delivery logs history

---

### 📢 Campaign System
- Create marketing campaigns
- Launch bulk messaging campaigns
- Track campaign progress
- Performance analytics

---

### 👥 Contact Management
- Add / Edit / Delete contacts
- Import contacts via CSV
- Organize customer lists
- Search & filter contacts

---

### 📝 Template System
- Create reusable SMS templates
- Dynamic message formatting
- Faster campaign creation

---

### ⏰ Scheduling System
- Schedule SMS for future sending
- Automated background execution
- Time-based delivery system

---

### 📊 Analytics Dashboard
- SMS delivery statistics
- Campaign performance tracking
- Success / failure metrics
- Graph-based reporting (frontend)

---

### 🔑 API Key System
- Generate API keys
- Secure external integrations
- Developer access support

---

### 🌐 Web & API Features
- RESTful API (FastAPI)
- Swagger Documentation (`/docs`)
- CORS enabled frontend integration

---

## 🏗️ System Architecture
Frontend (React + Vite)
│
▼
REST API (FastAPI Backend)
│
▼
JWT Authentication Layer
│
▼
MySQL Database (XAMPP / MariaDB)
│
▼
Optional: Redis + Celery (Background Tasks)


---

## 🛠️ Tech Stack

### 🎨 Frontend
- React (Vite)
- JavaScript (ES6+)
- Axios (API calls)
- Context API (State Management)
- Responsive UI design

---

### ⚙️ Backend
- FastAPI (Python)
- SQLAlchemy ORM
- Pydantic Validation
- JWT Authentication
- Uvicorn ASGI Server

---

### 🗄️ Database
- MySQL (XAMPP / MariaDB)
- Structured relational schema

---

### 🔄 Optional Services
- Redis (Queue system)
- Celery (Background jobs)

---

## 🚀 Installation Guide

### 📌 Step 1: Clone Repository
```bash
git clone https://github.com/ai-omprakash/sms_automation_system.git
cd sms_automation_system
📌 Step 2: Start XAMPP

Start:

Apache
MySQL
📌 Step 3: Create Database

Go to:

http://localhost/phpmyadmin

Create database:

sms_system

Then import:

sms_system.sql
📌 Step 4: Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

Run backend:

uvicorn main:app --reload --port 8000

Backend runs at:

http://localhost:8000

API Docs:

http://localhost:8000/docs
📌 Step 5: Frontend Setup
cd frontend
npm install
npm run dev

Frontend runs at:

http://localhost:5173
⚙️ Environment Variables (.env)
APP_NAME="SMS Automation System"
DEBUG=true
SECRET_KEY=your-secret-key
ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60

DATABASE_URL=mysql+pymysql://root:@localhost:3306/sms_system

REDIS_URL=redis://localhost:6379/0

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=

FRONTEND_URL=http://localhost:5173
🔐 Default Login Credentials
Username: omprakash
Password: Om@1234
📁 Project Structure
sms_automation_system/
│
├── backend/
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models.py
│   ├── routers/
│   ├── services/
│   ├── utils/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   └── routes/
│   └── package.json
│
├── sms_system.sql
└── README.md
📡 API Endpoints
Authentication
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
SMS
POST /api/sms/send
POST /api/sms/bulk
GET /api/sms/logs
Campaigns
POST /api/campaigns/
GET /api/campaigns/
POST /api/campaigns/{id}/launch
Contacts
POST /api/contacts/
GET /api/contacts/
POST /api/contacts/import
Analytics
GET /api/analytics/overview
🧪 Testing

You can test API using:

Swagger UI → /docs
Postman
Frontend UI
🚀 Future Improvements
📱 Mobile App (React Native)
☁️ Cloud SMS Providers (Twilio / Vonage / Fast2SMS)
🤖 AI SMS message generator
📊 Advanced analytics dashboards
🔔 Real-time notifications (WebSockets)
🌍 Multi-language support
⚠️ Known Issues
First run may require database import
Ensure MySQL is running in XAMPP
Node modules must be installed before frontend run
⭐ Project Highlights

✔ Production-style backend architecture
✔ Clean REST API design
✔ Scalable SMS automation system
✔ Real-world SaaS simulation
✔ Full authentication system
✔ Modular code structure

📬 Contact

For any queries, collaboration, or improvements:

📧 Email: omprakashghartimagar301@gmail.com
🌐 GitHub: https://github.com/ai-omprakash

⭐ Support

If you like this project:

👉 Give a ⭐ on GitHub
👉 Fork it
👉 Share with developers