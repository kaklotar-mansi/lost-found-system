# Smart Lost & Found System

A full-stack MERN application for reporting, searching, and managing lost and found items.

## Tech Stack
- Frontend: React.js (Vite) + React Router + Axios + Font Awesome icons
- Backend: Node.js + Express.js
- Database: MongoDB (MongoDB Atlas or local)
- Auth: JWT

## Folder Structure
```
lost-found-system/
├── backend/
│   ├── config/db.js
│   ├── controllers/       # auth, item, claim, dashboard logic
│   ├── middleware/        # JWT auth, multer upload, error handler
│   ├── models/            # User, Item, Claim (Mongoose schemas)
│   ├── routes/
│   ├── uploads/           # uploaded item images
│   ├── .env.example
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── context/AuthContext.jsx
    │   ├── components/    # Navbar, ItemCard, ProtectedRoute
    │   ├── pages/          # Home, Login, Register, ReportItem, ItemDetail, MyReports, Dashboard
    │   ├── styles/index.css
    │   ├── App.jsx
    │   └── main.jsx
    └── .env.example
```

## Setup Instructions

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
```
Edit `.env` and set your `MONGO_URI` (from MongoDB Atlas or local MongoDB) and a strong `JWT_SECRET`.

Run it:
```bash
npm run dev
```
Server runs on http://localhost:5000

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
App runs on http://localhost:3000 (proxies `/api` calls to the backend).

## Database
No manual database creation is required. MongoDB creates the database and its
collections (`users`, `items`, `claims`) automatically the first time your app
writes data — e.g. the moment you register your first user.

## API Overview
| Method | Route                    | Access  | Description                     |
|--------|---------------------------|---------|----------------------------------|
| POST   | /api/auth/register        | Public  | Register a new user             |
| POST   | /api/auth/login           | Public  | Login, returns JWT               |
| GET    | /api/auth/me               | Private | Get logged-in user               |
| GET    | /api/items                 | Public  | List items (search/filter)      |
| POST   | /api/items                 | Private | Report a lost/found item        |
| GET    | /api/items/:id              | Public  | Get single item                 |
| PUT    | /api/items/:id               | Private | Update item (owner only)        |
| DELETE | /api/items/:id                | Private | Delete item (owner only)        |
| GET    | /api/items/mine/reports        | Private | Items reported by current user  |
| POST   | /api/claims                     | Private | Submit a claim on an item       |
| GET    | /api/claims/mine                  | Private | Claims you submitted            |
| GET    | /api/claims/received                | Private | Claims received on your items   |
| PUT    | /api/claims/:id                       | Private | Approve/reject a claim          |
| GET    | /api/dashboard/stats                    | Public  | Dashboard statistics            |
