# 🚀 Node.js Blog API (Backend Capstone)

A production-ready RESTful API for a blogging platform, built with **Node.js**, **Express**, and **PostgreSQL**.

This project demonstrates a professional backend architecture using the **MVC Pattern**, **Service Layer**, and **Repository Pattern**. It focuses on security, scalability, and clean code principles.

---

## 🔗 Live Demo & Documentation

| Service | Status | Link |
| :--- | :--- | :--- |
| **Live API** | 🟢 Online | [https://blog-api-bnxm.onrender.com](https://blog-api-bnxm.onrender.com) |
| **Swagger Docs** | 📜 Docs | [**View Interactive API Docs**](https://blog-api-bnxm.onrender.com/api-docs) |

> **Note:** The server is hosted on a free tier (Render). It may take ~60 seconds to wake up on the first request.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL (Raw SQL - No ORM)
* **Authentication:** JWT (JSON Web Tokens)
* **Security:** Bcrypt (Hashing), Helmet (Headers), Joi (Validation), CORS
* **Documentation:** Swagger UI
* **Testing:** Jest & Supertest
* **CI/CD:** GitHub Actions

---

## ✨ Key Features

* **Authentication & Authorization:**
    * User Registration & Login with secure password hashing (`bcrypt`).
    * JWT-based stateless authentication.
    * Role-based access control (User vs Owner).
* **Advanced Database Operations:**
    * **Raw SQL Queries:** All interactions using `node-postgres` (pg) for maximum control.
    * **Transactions:** Ensures data integrity.
    * **Pagination & Filtering:** Optimized fetching with `LIMIT`, `OFFSET`, and `ILIKE`.
* **Architecture:**
    * **Separation of Concerns:** Routes → Controllers → Services → Repositories.
    * **Repository Pattern:** Decoupled database logic from business logic.
* **DevOps:**
    * **Dockerized:** Runs consistently across environments.
    * **CI/CD:** Automated testing pipeline via GitHub Actions.

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