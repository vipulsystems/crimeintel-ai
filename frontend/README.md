# 🎨 CrimeIntel AI (Frontend)

This is the frontend of **CrimeIntel AI**, a real-time crime intelligence dashboard built with React and modern UI technologies.

---

## 🚀 Overview

The frontend provides an interactive interface to:

* Visualize crime data and trends
* Monitor real time alerts
* View social media intelligence feeds
* Manage admin operations

---

## ⚙️ Tech Stack

* React (Vite)
* Tailwind CSS
* Framer Motion
* Leaflet (Maps)
* Socket.IO Client

---

## 📂 Folder Structure

```bash
src/
├── app/            # App setup, routing
├── features/       # Feature-based modules (auth, dashboard, intelligence, admin)
├── shared/         # Reusable UI components
├── services/       # API & utility services
├── store/          # State management
├── styles/         # Global styles
```

---

## 🔑 Key Features

* Role based authentication UI
* Dashboard with analytics and charts
* Social media feeds (Reddit, Twitter, Instagram)
* Real time updates via Socket.IO
* Responsive layout with sidebar and header

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
VITE_API_URL=http://localhost:5000
```

---

## 📌 Notes

* Uses centralized API service for backend communication
* Socket connection handles live updates
* Designed with feature-based architecture for scalability
