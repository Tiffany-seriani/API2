# Mongoose & Express User REST API

A complete RESTful API built with **Node.js**, **Express**, **Mongoose**, and **dotenv** to manage users with full CRUD operations.

---

## 📁 Project Folder Structure

```text
mongoose-express-api/
│
├── config/
│   └── .env                 # Environment variables (PORT, MONGO_URI)
│
├── models/
│   └── User.js              # Mongoose Schema & User Model definition
│
├── package.json             # Project metadata & dependencies
├── server.js                # Express server setup, DB connection & CRUD routes
├── postman_collection.json  # Exported Postman collection for 1-click testing
├── test_api.js              # Verification script for model & schema validation
└── README.md                # Documentation & Postman guide
```

---

## ⚙️ Prerequisites & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables Configuration (`config/.env`)
The application reads its environment configuration from [config/.env](file:///C:/Users/Admin/.gemini/antigravity/scratch/mongoose-express-api/config/.env).

#### Option A: Local MongoDB
Ensure your local MongoDB daemon is running, and set:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/user_database
```

#### Option B: MongoDB Atlas (Cloud)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and whitelist your IP address (or `0.0.0.0/0`).
3. Copy your connection string and paste it into `config/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/user_database?retryWrites=true&w=majority
```

---

## 🚀 Running the Server

### Normal Mode
```bash
npm start
```

### Development Mode (with Nodemon auto-restart)
```bash
npm run dev
```

The server will start listening at: `http://localhost:5000`

---

## 📡 API Endpoints & CRUD Operations

| HTTP Method | Route | Description | Mongoose Method |
| :--- | :--- | :--- | :--- |
| **GET** | `/users` | Return all users | `User.find()` |
| **GET** | `/users/:id` | Return single user by ID | `User.findById(id)` |
| **POST** | `/users` | Add a new user | `new User(req.body).save()` |
| **PUT** | `/users/:id` | Edit a user by ID | `User.findByIdAndUpdate(id, req.body, ...)` |
| **DELETE** | `/users/:id` | Remove a user by ID | `User.findByIdAndDelete(id)` |

---

## 🧪 Postman Step-by-Step Testing Guide

You can import the included [`postman_collection.json`](file:///C:/Users/Admin/.gemini/antigravity/scratch/mongoose-express-api/postman_collection.json) directly into Postman:
1. Open **Postman**.
2. Click **Import** (top left).
3. Select `postman_collection.json` from this project folder.
4. Run each request in order!

### 1. POST: Add a New User
- **Method**: `POST`
- **URL**: `http://localhost:5000/users`
- **Headers**: `Content-Type: application/json`
- **Body (raw JSON)**:
```json
{
  "name": "Sarah Connor",
  "email": "sarah.connor@example.com",
  "age": 29,
  "role": "user"
}
```
- **Expected Status**: `201 Created`
- **Response**:
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "66bc112233445566778899aa",
    "name": "Sarah Connor",
    "email": "sarah.connor@example.com",
    "age": 29,
    "role": "user",
    "createdAt": "2026-08-14T09:45:00.000Z",
    "updatedAt": "2026-08-14T09:45:00.000Z",
    "__v": 0
  }
}
```

---

### 2. GET: Return All Users
- **Method**: `GET`
- **URL**: `http://localhost:5000/users`
- **Expected Status**: `200 OK`
- **Response**:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "66bc112233445566778899aa",
      "name": "Sarah Connor",
      "email": "sarah.connor@example.com",
      "age": 29,
      "role": "user",
      "createdAt": "2026-08-14T09:45:00.000Z",
      "updatedAt": "2026-08-14T09:45:00.000Z"
    }
  ]
}
```

---

### 3. PUT: Edit a User by ID
- **Method**: `PUT`
- **URL**: `http://localhost:5000/users/66bc112233445566778899aa` *(Replace with actual `_id`)*
- **Headers**: `Content-Type: application/json`
- **Body (raw JSON)**:
```json
{
  "name": "Sarah Connor Brewster",
  "age": 30,
  "role": "admin"
}
```
- **Expected Status**: `200 OK`
- **Response**:
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "66bc112233445566778899aa",
    "name": "Sarah Connor Brewster",
    "email": "sarah.connor@example.com",
    "age": 30,
    "role": "admin",
    "updatedAt": "2026-08-14T09:46:12.000Z"
  }
}
```

---

### 4. DELETE: Remove a User by ID
- **Method**: `DELETE`
- **URL**: `http://localhost:5000/users/66bc112233445566778899aa` *(Replace with actual `_id`)*
- **Expected Status**: `200 OK`
- **Response**:
```json
{
  "success": true,
  "message": "User removed successfully",
  "data": {
    "_id": "66bc112233445566778899aa",
    "name": "Sarah Connor Brewster",
    "email": "sarah.connor@example.com"
  }
}

