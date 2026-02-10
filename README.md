# 🚀 Node.js Blog API (Backend Capstone)

A production-ready RESTful API for a blogging platform, built with **Node.js**, **Express**, and **PostgreSQL**.

This project demonstrates a professional backend architecture using the **MVC Pattern**, **Service Layer**, and **Repository Pattern**. It focuses on security, scalability, and clean code principles.

---

## 🛠️ Tech Stack

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** PostgreSQL (Raw SQL - No ORM)
*   **Authentication:** JWT (JSON Web Tokens)
*   **Security:** Bcrypt (Hashing), Helmet (Headers), Joi (Validation)
*   **Logging:** Morgan

---

## ✨ Key Features

*   **Authentication & Authorization:**
    *   User Registration & Login with secure password hashing (`bcrypt`).
    *   JWT-based stateless authentication.
    *   Role-based access control (User vs Owner).
*   **Advanced Database Operations:**
    *   **Raw SQL Queries:** All interactions using `node-postgres` (pg) for maximum control.
    *   **Transactions:** Ensures data integrity.
    *   **Pagination & Filtering:** Optimized fetching with `LIMIT`, `OFFSET`, and `ILIKE`.
*   **Architecture:**
    *   **Separation of Concerns:** Routes → Controllers → Services → Repositories.
    *   **Repository Pattern:** Decoupled database logic from business logic.
*   **Security Best Practices:**
    *   SQL Injection protection (Parameterized Queries).
    *   Centralized Error Handling.
    *   Input Validation using `Joi`.

---

## 📂 Project Structure

```text
src/
 ├── config/         # Database connection & Env variables
 ├── controllers/    # Handles HTTP Requests & Responses
 ├── middlewares/    # Auth check, Validation, Error Handling
 ├── repositories/   # Raw SQL queries (Data Access Layer)
 ├── routes/         # API Endpoint definitions
 ├── services/       # Business Logic & complex operations
 ├── utils/          # Helpers (JWT generation, Password hashing)
 └── app.js          # Entry point

 ---

# 🚀 Getting Started

## 1️⃣ Prerequisites
- Node.js **v14+**
- PostgreSQL installed locally

---

## 2️⃣ Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/blog-api.git
cd blog-api
npm install
3️⃣ Environment Variables
Create a .env file in the root directory:

PORT=3000
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blog_db
JWT_SECRET=super_secret_key_change_this
4️⃣ Database Setup
Run in PostgreSQL terminal (psql):

CREATE DATABASE blog_db;
\c blog_db

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);
5️⃣ Run the Server
npm start
📖 API Documentation
🔐 Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login and receive JWT
📝 Posts
Method	Endpoint	Description
GET	/api/posts	Get all posts (Pagination + Search supported)
POST	/api/posts	Create a new post (Auth required)
PUT	/api/posts/:id	Update a post (Owner only)
DELETE	/api/posts/:id	Delete a post (Owner only)
Query Parameters
?page=1       Default: 1
?limit=10     Default: 10
?search=text  Filter by title
💬 Comments
Method	Endpoint	Description
GET	/api/posts/:postId/comments	Get comments for a post
POST	/api/posts/:postId/comments	Add a comment (Auth required)
DELETE	/api/comments/:id	Delete a comment (Owner only)
🛡️ Security Features
🔒 Password Hashing — passwords never stored in plain text

🧠 JWT Protected Routes — middleware verification

👤 Ownership Authorization — users cannot modify others' content