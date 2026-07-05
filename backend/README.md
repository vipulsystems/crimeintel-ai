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
XQUIK_API_KEY=your_xquik_api_key
XQUIK_API_BASE_URL=https://xquik.com
XQUIK_SEARCH_QUERY=crime OR police OR robbery OR theft OR accident
XQUIK_SEARCH_LIMIT=25
```

`XQUIK_API_KEY` is optional. When it is configured, the Twitter worker uses
Xquik's `/api/v1/x/tweets/search` endpoint and maps results into the existing
post schema.

---

## 📌 Notes

* Uses service layer for business logic
* Workers handle background ingestion tasks
* Designed to evolve into event-driven architecture
