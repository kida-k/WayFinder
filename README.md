# WayFinder — Smart Road Trip Planner

AI-powered road trip planner that generates optimal routes with curated stops for gas, food, and attractions.

## 📁 Project Structure

- **`/frontend`**: Vite + React web application with glassmorphism UI
- **`/backend`**: Node.js Express server integrating Google Maps and AI for route suggestions

## 🚀 Getting Started

### 1. Backend (API Server)
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend (Web App)
```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend at `http://localhost:3001`.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, React Router, Lucide Icons, Vanilla CSS
- **Backend**: Node.js, Express, Google Maps API, OpenRouter AI

## 📱 App Flow
1. **Plan Your Drive** — Enter origin, destination, and start time
2. **Stop Options** — Toggle preferences for gas, food, attractions
3. **Select Route** — Choose fastest, cheapest, or custom itinerary
4. **Customize** — Approve or remove individual stops
5. **Trip Ready** — View summary with stats and start navigation
