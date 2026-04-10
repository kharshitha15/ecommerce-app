# EmoStore - Premium E-Commerce Platform

EmoStore is a professional-grade, full-stack e-commerce application built with modern technologies. It features a robust Spring Boot backend, a sleek React frontend, and secure payment integration with Razorpay.

## 🚀 Tech Stack

### Backend
- **Spring Boot 3.2**: Core framework
- **Spring Security & JWT**: Authentication and Authorization
- **Hibernate / JPA**: ORM and Database Management
- **MySQL**: Production Database
- **H2**: Local Development Database
- **Razorpay SDK**: Payment Gateway Integration
- **Lombok**: Boilerplate code reduction
- **Jakarta Validation**: Data integrity and Bean validation

### Frontend
- **React 19**: Modern UI library
- **Vite**: Ultra-fast build tool
- **Tailwind CSS**: Utility-first styling
- **React Router Dom**: Client-side routing
- **Axios**: API communication
- **Lucide React**: Premium iconography

---

## 🏗️ Architecture Overview

The project follows a standard N-tier architecture:
- **Presentation Layer**: React.js SPA providing a responsive user experience.
- **Controller Layer**: RESTful APIs exposing backend functionality.
- **Service Layer**: Core business logic, including order processing and stock management.
- **Repository Layer**: Data access using Spring Data JPA.
- **Database Layer**: Persistent storage via MySQL (Prod) or H2 (Dev).

---

## 📋 Prerequisites

- **Java 17+**
- **Node.js 18+**
- **MySQL Server** (for production profile)
- **Maven 3.8+**
- **Razorpay Test Keys** (for payment flow)

---

## 🛠️ Local Setup Instructions

### 1. Backend Setup
1. Navigate to the `backend` directory.
2. Update `application-dev.properties` if you need to change H2 settings.
3. Configure environment variables (see table below).
4. Run the application:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```

### 2. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and set `VITE_API_BASE_URL=http://localhost:8081/api/v1`.
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🔑 Environment Variables

| Variable | Description | Default / Example |
|----------|-------------|-------------------|
| `DB_PASSWORD` | MySQL Root Password | `your_mysql_password` |
| `RAZORPAY_KEY` | Razorpay API Key | `rzp_test_...` |
| `RAZORPAY_SECRET` | Razorpay API Secret | `...` |
| `JWT_SECRET` | Secret key for JWT signing | `404E6352...` |
| `JWT_EXPIRATION` | JWT Expiration (ms) | `86400000` (24h) |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | `http://localhost:5173` |

---

## 🔌 API Endpoints Summary

### Auth
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

### Products
- `GET /api/v1/products` - List products (Paginated: `?page=0&size=20`)
- `GET /api/v1/products/{id}` - Get product details
- `GET /api/v1/products/search?query=...` - Search products

### Orders
- `POST /api/v1/orders` - Place a new order
- `GET /api/v1/orders` - Get logged-in user's orders

### Admin
- `GET /api/v1/admin/dashboard/stats` - Dashboard statistics
- `POST /api/v1/admin/products` - Create new product
- `PUT /api/v1/admin/products/{id}` - Update product

---

## 📸 Screenshots Section
*(Placeholders for UI demonstration)*
- [Homepage Mockup]
- [Product Grid - Premium Dark/Light Modes]
- [Admin Dashboard - Real-time Stats]

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

&copy; 2026 EmoStore. All rights reserved.
