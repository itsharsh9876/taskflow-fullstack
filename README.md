# 🚀 TaskFlow – Full Stack Task Management App

A full-stack **Task Management Web Application** built using the MERN stack.
Users can create projects, assign tasks, manage team members, and track progress efficiently.

---

## 🔗 Live Links

* 🌐 **Frontend (Vercel):**
  https://taskflow-fullstack-fawn.vercel.app

* ⚙️ **Backend (Railway):**
  https://taskflow-fullstack-production.up.railway.app

* 📂 **GitHub Repository:**
  https://github.com/itsharsh9876/taskflow-fullstack

---

## 🛠 Tech Stack

### Frontend

* React (Vite + TypeScript)
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Deployment

* Frontend → Vercel
* Backend → Railway

---

## ✨ Features

* 🔐 User Authentication (JWT based)
* 👤 Role-based access (Admin / Member)
* 📁 Project creation and management
* ✅ Task creation, update, delete
* 👥 Assign members to projects
* 📊 Dashboard with task statistics
* 🌐 Fully deployed full-stack app

---

## ⚙️ Local Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/itsharsh9876/taskflow-fullstack.git
cd taskflow-fullstack
```

---

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create `.env` file inside **backend/**:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm start
```

Backend runs on:

```
http://localhost:5000
```

---

### 3️⃣ Setup Frontend

```bash
cd ..
npm install
npm run dev
```

Create `.env` in root:

```env
VITE_API_URL=http://localhost:5000
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🚀 Deployment Steps

### 🔹 Backend (Railway)

1. Push code to GitHub
2. Go to Railway → New Project → Deploy from GitHub
3. Set Root Directory:

```
backend
```

4. Add Environment Variables:

```env
MONGO_URI=your_atlas_url
JWT_SECRET=your_secret
```

5. Start Command:

```
node server.js
```

---

### 🔹 Frontend (Vercel)

1. Import project from GitHub
2. Set Framework:

```
Vite
```

3. Set Root Directory:

```
(frontend or root depending on structure)
```

4. Add Environment Variable:

```env
VITE_API_URL=https://your-railway-backend-url
```

5. Deploy

---

## 📂 Folder Structure

```
taskflow-fullstack/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── src/
│   ├── pages/
│   ├── components/
│   ├── context/
│   └── App.tsx
│
├── .env
├── package.json
```

---

## 🔒 Environment Variables

### Backend

* `MONGO_URI` → MongoDB Atlas connection string
* `JWT_SECRET` → Secret key for authentication

### Frontend

* `VITE_API_URL` → Backend API URL

---

## 🧠 Future Improvements

* 🔔 Notifications system
* 📊 Advanced analytics dashboard
* 🌙 Dark mode
* ⏱ Task time tracking

---

## 👨‍💻 Author

**Harsh Gautam**
GitHub: https://github.com/itsharsh9876

---

## 📌 Conclusion

TaskFlow is a scalable full-stack application demonstrating real-world concepts like authentication, REST APIs, database relationships, and deployment.

---
