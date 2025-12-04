---
description: How to deploy the MERN stack application
---

# Deployment Guide

To make your project accessible via a single link, you need to deploy both the **Frontend (React)** and the **Backend (Node.js/Express)**, and use a cloud database (**MongoDB Atlas**).

## Prerequisite: GitHub
1.  Create a new repository on GitHub.
2.  Push your code to this repository.

## Step 1: Database (MongoDB Atlas)
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a free cluster.
3.  Create a database user (username/password).
4.  In "Network Access", allow access from anywhere (`0.0.0.0/0`).
5.  Get your connection string (e.g., `mongodb+srv://<user>:<password>@cluster0.mongodb.net/...`).

## Step 2: Backend (Render.com)
1.  Sign up at [Render.com](https://render.com).
2.  Click "New +" -> "Web Service".
3.  Connect your GitHub repository.
4.  **Root Directory**: `server`
5.  **Build Command**: `npm install`
6.  **Start Command**: `node index.js`
7.  **Environment Variables**:
    *   `MONGODB_URI`: (Paste your connection string from Step 1)
    *   `PORT`: `10000` (Render uses this port internally)
8.  Deploy. You will get a URL like `https://antigravity-api.onrender.com`.

## Step 3: Frontend (Vercel)
1.  Sign up at [Vercel.com](https://vercel.com).
2.  Click "Add New..." -> "Project".
3.  Import your GitHub repository.
4.  **Framework Preset**: Vite
5.  **Root Directory**: `.` (default)
6.  **Environment Variables**:
    *   `VITE_API_URL`: (Paste your Backend URL from Step 2, e.g., `https://antigravity-api.onrender.com/api`)
    *   **Note**: You need to update your `src/lib/api.ts` to use this variable!

## Step 4: Update Code for Deployment
Before deploying, we need to make a small change to `src/lib/api.ts` to use the environment variable.

### Update `src/lib/api.ts`
```typescript
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});
```
