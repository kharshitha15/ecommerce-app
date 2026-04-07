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
- **Global Exception Handling**: Centralized error management with specialized `@ControllerAdvice` and custom `ApiResponse` DTO.
- **Data Transfer Objects (DTOs)**: Complete isolation of database entities from public API responses.
- **Input Validation**: Mandatory request body validation using Jakarta `@Valid` at the controller layer.
- **Clean Architecture**: Strictly enforced package layering: `controller`, `service`, `repository`, `model`, `dto`, `security`, `exception`.

---

## 🛠️ Tech Stack
- **Backend**: Java 17, Spring Boot 3.x
- **Security**: Spring Security, JJWT (JWT)
- **Database**: MySQL (Primary), H2 (Local Demo)
- **Data Access**: Spring Data JPA / Hibernate
- **Deployment**: AWS (EC2 + RDS) ready

---

## 🚀 Getting Started

### Prerequisites
- JDK 17+
- Maven 3.8+
- MySQL Server

### Database Configuration
Update `src/main/resources/application.properties` with your MySQL credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/emostoredb
spring.datasource.username=root
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update
```

### Running the Application
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies and run:
    ```bash
    mvn spring-boot:run
    ```

---

## 📑 API Documentation
Interactive documentation is available via Swagger UI:
- **Swagger URL**: `http://localhost:8081/swagger-ui/index.html`

### Key Endpoints:
| Method | Endpoint | Description | Role |
| :--- | :--- | :--- | :--- |
| POST | `/api/v1/auth/register` | User Registration | Public |
| POST | `/api/v1/auth/login` | User Login | Public |
| GET | `/api/v1/products` | View All Products | Public |
| USER | `/api/v1/user/cart` | Cart Management | USER |
| ADMIN | `/api/v1/admin/products` | CRUD Products | ADMIN |

---

## ☁️ Deployment Guide (AWS)

### 1. Database (Amazon RDS)
- Create a MySQL instance in Amazon RDS.
- Update `application.properties` with the RDS endpoint, username, and password.

### 2. Computing (Amazon EC2)
- Launch a Linux EC2 instance.
- Install Java 17 on the instance:
    ```bash
    sudo yum install java-17-amazon-corretto
    ```
- Upload the JAR file (generated via `mvn clean package`) to the EC2 instance.
- Run the JAR:
    ```bash
    java -jar emostore-backend.jar
    ```

### 3. Security Groups
- Ensure port 8081 (or your custom port) is open in the EC2 security group.
- Allow the EC2 security group to access the RDS instance on port 3306.

---

## 👤 Author
Developed as a production-grade e-commerce backend showcase.
