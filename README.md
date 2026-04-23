# EmoStore - Premium E-Commerce Platform

[![Live Demo](https://img.shields.io/badge/demo-live-blueviolet)](https://ecommerce-app-peach.vercel.app)
[![Railway Backend](https://img.shields.io/badge/backend-Railway-blue)](https://ecommerce-app-production-4e24.up.railway.app)

EmoStore is a professional-grade, full-stack e-commerce application built with modern technologies. It features a robust Spring Boot backend, a sleek React frontend, and persistent image management with Cloudinary.

## 🚀 Live Demo
The application is fully deployed and ready for testing:
- **Frontend (Vercel):** [https://ecommerce-app-peach.vercel.app](https://ecommerce-app-peach.vercel.app)
- **Backend API (Railway):** [https://ecommerce-app-production-4e24.up.railway.app](https://ecommerce-app-production-4e24.up.railway.app)

---

## 🛠️ Tech Stack

### Backend (Railway)
- **Spring Boot 3.2**: Core framework
- **Spring Security & JWT**: Authentication and Authorization
- **Bucket4j**: Rate limiting and Brute-force protection
- **Hibernate / JPA**: ORM and Database Management
- **MySQL**: Production Database
- **Cloudinary**: Cloud-based Image Management
- **Razorpay SDK**: Payment Gateway Integration

### Frontend (Vercel)
- **React 19**: Modern UI library
- **Vite**: Ultra-fast build tool
- **Tailwind CSS**: Utility-first styling
- **Context API**: Global state management (Auth & Cart)
- **Axios**: API communication with interceptors

---

## 🏗️ Architecture Overview
The project uses a decoupled architecture for maximum scalability:
- **Frontend SPA**: Hosted on Vercel for high performance and global CDN delivery.
- **RESTful API**: Hosted on Railway, connected to a dedicated MySQL instance.
- **Media Storage**: Product images are served via Cloudinary to ensure fast load times and persistence.

---

## 🔑 Demo Credentials
You can test the platform using these pre-seeded accounts:

### Admin Account
- **Email:** `admin@emostore.com`
- **Password:** `admin123`

### Customer Account
- **Email:** `user@emostore.com`
- **Password:** `user123`

---

## 🛠️ Local Setup

### Environment Variables Required
To run this project locally, ensure you have the following variables configured:

| Variable | Description |
|----------|-------------|
| `MYSQLHOST` | MySQL Server Address |
| `MYSQLDATABASE` | Database Name |
| `MYSQLUSER` | Database Username |
| `MYSQLPASSWORD` | Database Password |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Account Name |
| `CLOUDINARY_API_KEY` | Cloudinary Key |
| `CLOUDINARY_API_SECRET` | Cloudinary Secret |
| `JWT_SECRET` | 256-bit Base64 Secret Key |
| `RAZORPAY_KEY` | Razorpay Key ID |
| `RAZORPAY_SECRET` | Razorpay Secret |

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

&copy; 2026 EmoStore. All rights reserved.
