# Emostore - Professional E-commerce Backend

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.4-brightgreen)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-orange)](https://www.oracle.com/java/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Emostore is a robust, production-ready e-commerce backend platform built with Java Spring Boot. It follows Clean Architecture principles and implements state-of-the-art security practices to deliver a scalable and secure shopping experience.

---

## ✨ Features

### 🔐 Authentication & Security
- **JWT Authentication**: Secure stateless authentication using JSON Web Tokens.
- **RBAC (Role-Based Access Control)**: Fine-grained permissions for Admin and User roles.
- **Spring Security**: Modern filter-chain-based security configuration.

### 📦 Product Management
- **Full CRUD**: Admin endpoints for product creation, updates, and deletion.
- **Image Uploads**: Integrated local storage for product images with UUID-based unique naming.
- **Public Catalog**: Optimized endpoints for product discovery and search.

### 🛒 Cart & Order Modules
- **Persistent Shopping Cart**: User-specific cart management persisted in the database.
- **Secure Checkout**: Streamlined order placement with support for multiple payment methods.
- **Razorpay Integration**: Built-in support for secure online payments.

### 🛠️ Professional Standards
- **Global Exception Handling**: Centralized error management with user-friendly messages.
- **Data Transfer Objects (DTOs)**: Complete separation of database entities from API responses.
- **Input Validation**: Robust validation of request bodies using Spring Validation.
- **Logging**: Detailed logging for auditing and debugging.

---

## 🛠️ Tech Stack
- **Backend**: Java 17, Spring Boot 3.x
- **Security**: Spring Security, JJWT
- **Database**: H2 (In-memory/File-demo), MySQL (Production-ready)
- **Data Access**: Spring Data JPA (Hibernate)
- **Documentation**: Swagger/OpenAPI 3
- **Build Tool**: Maven
- **Lombok**: Reduced boilerplate code

---

## 🚀 Getting Started

### Prerequisites
- JDK 17 or higher
- Maven 3.8+

### Database Configuration
By default, the application uses a file-based H2 database for zero-setup demonstration. To switch to MySQL, update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/emostoredb
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Running the Application
1. Clone the repository and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Build and run:
   ```bash
   mvn spring-boot:run
   ```
3. The server will start at `http://localhost:8081`.

---

## 📑 API Documentation
Explore and test the APIs interactively using Swagger UI:
- **Swagger URL**: `http://localhost:8081/swagger-ui/index.html`

### Key Endpoints:
- `POST /api/v1/auth/register` - User Registration
- `POST /api/v1/auth/login` - User Login
- `GET /api/v1/user/cart` - View User Cart
- `POST /api/v1/user/orders` - Place Order
- `GET /api/v1/admin/dashboard/stats` - Admin Analytics

---

## 👤 Author
Developed as a showcase of modern Spring Boot capabilities for professional recruitment.
