# 🩺 Digital Health Wallet – 2care.ai Assignment

## 📌 Objective
This project is a **Digital Health Wallet** that allows users to securely upload, manage, and visualize their medical reports and vital health data.  
Users can track vitals over time, download and view reports, and share reports via WhatsApp.

The application is designed to be accessible anytime, anywhere, with a focus on usability, security, and clean data handling.

---

## 🛠️ Technology Stack

### Frontend
- ReactJS
- Axios
- Recharts
- Tailwind CSS

### Backend
- Node.js
- Express.js
- SQLite
- Multer (file uploads)
- JWT (authentication)

---

## ✨ Features Implemented

### ✅ User Management
- User registration and login
- JWT-based authentication
- Role-based access (Owner / Viewer)

### ✅ Health Reports
- Upload medical reports (PDF / Images)
- Store metadata:
  - Report Type
  - Date
  - Associated Vital
- View reports (PDF/Image viewer)
- Download reports
- Share reports via WhatsApp

### ✅ Vitals Tracking
- Add vitals:
  - Blood Pressure
  - Sugar
  - Heart Rate
- Store vitals with date
- Visualize trends using charts:
  - Bar chart for BP
  - Line chart for Sugar
  - Area chart for Heart Rate

### ✅ Access Control
- Owners can upload reports
- Viewers have read-only access
- Secure API routes using JWT middleware

---

## 🧱 System Architecture

### Frontend (ReactJS)
- Components:
  - Login / Register
  - Dashboard
  - UploadReport
  - MyReports
  - AddVital
  - VitalsChart
- State Management using React Hooks
- API integration using Axios

### Backend (Node.js + Express)
- REST APIs for:
  - Authentication
  - Reports
  - Vitals
- Middleware:
  - Authentication (JWT)
  - Role-based access
- Business logic handled in route files

### Database (SQLite)
- Tables:
  - users
  - reports
  - vitals
  - shares

---

## 🗂️ Project Structure

