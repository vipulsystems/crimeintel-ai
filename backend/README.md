# ⚙️ CrimeIntel AI (Backend)

This is the backend service for **CrimeIntel AI**, responsible for data ingestion, processing, and API delivery.

---

## 🚀 Overview

The backend system:

* Aggregates data from social media and news sources
* Processes and stores intelligence data
* Provides REST APIs for frontend consumption
* Handles real time updates using Socket.IO

---

## ⚙️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Socket.IO

---

## 📂 Folder Structure

```bash
src/
├── config/        # Database and environment configs
├── modules/       # Feature modules (auth, crime, post, social, etc.)
├── scripts/       # Utility and data scripts
├── shared/        # Middleware, utils, services
├── app.js         # Express app setup
├── server.js      # Server entry point
```

---

## 🔑 Key Features

* Modular architecture (auth, crime, posts, social ingestion)
* Social media data ingestion (Reddit, Twitter, Instagram)
* News scraping services
* Role-based authentication (JWT)
* Real-time updates via Socket.IO

---

## 🧪 Setup & Run

```bash
npm install
npm run dev
```

---

## 🌐 Environment Variables

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

---

## 📌 Notes

* Uses service layer for business logic
* Workers handle background ingestion tasks
* Designed to evolve into event-driven architecture
