# Hotel Booking System Setup & Deployment Guide

## Overview
This is a full-stack hotel booking system built with React (Vite), Tailwind CSS, Node.js, Express, and MongoDB. 

## Features
- **Authentication**: JWT-based login and registration with role-based access (Admin/Customer).
- **Room Management**: Search, filter, and view hotel rooms.
- **Booking System**: Select dates, calculate price, avoid double bookings.
- **Admin Dashboard**: View statistics, manage rooms (CRUD), and monitor bookings.
- **Customer Dashboard**: View upcoming stays and booking history, cancel active bookings.

---

## Local Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (Running locally or MongoDB Atlas URI)

### 1. Database Setup
Ensure MongoDB is running locally on `mongodb://localhost:27017` or have an Atlas URI ready.

### 2. Backend Setup
1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd "c:\Hotel Booking System\server"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` if it doesn't exist, and verify your `MONGODB_URI` and `JWT_SECRET`.
4. Seed the database with sample rooms and users:
   ```bash
   npm run seed
   ```
   *(This will create an admin account `admin@hotel.com/admin123` and customer accounts)*
5. Start the backend server:
   ```bash
   npm run dev
   ```
   *(Server will run on http://localhost:5000)*

### 3. Frontend Setup
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd "c:\Hotel Booking System\client"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and go to `http://localhost:5173`

---

## Deployment Instructions

### Backend (Render / Railway)
1. Push your code to GitHub.
2. Connect your repository to Render/Railway.
3. Set the root directory to `server` (or configure the build command if deployed from root).
4. Environment Variables to set in the deployment dashboard:
   - `PORT`: (Render/Railway sets this automatically, but ensure your code uses `process.env.PORT`)
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure random string for signing JWTs.
5. Build Command: `npm install`
6. Start Command: `npm start`

### Frontend (Vercel / Netlify)
1. Connect your repository to Vercel/Netlify.
2. Set the root directory to `client`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. **IMPORTANT**: Because the frontend uses a Vite proxy in development, you must configure API requests for production.
   - Update `client/src/api/axios.js` to point to your deployed backend URL.
   - Example: 
     ```javascript
     const api = axios.create({
       baseURL: import.meta.env.PROD ? 'https://your-backend-url.onrender.com/api' : '/api',
       // ...
     });
     ```

## Project Structure
- `/client`: React frontend with Vite + Tailwind CSS.
- `/server`: Node.js + Express backend with Mongoose models.
