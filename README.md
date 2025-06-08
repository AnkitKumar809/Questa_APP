# 🎯 Questa - Quiz App with Public Sharing and Responses

**Questa** is a full-stack quiz application built with **Next.js 15 App Router**, **MongoDB**, and **Tailwind CSS**. Authenticated users can create quizzes with multiple questions and share them via a public link. Respondents can submit answers without logging in. Creators can view all responses and export them as CSV files.

---

## 🚀 Features

- ✅ Authenticated quiz creation (single choice & short text support)
- 🌐 Public quiz access via URL (no login required to answer)
- 📄 Responses stored in MongoDB
- 📊 Admin can view all submissions
- ⬇️ CSV export of all responses
- 🧪 Full-stack with secure API routes and MongoDB models

---

## 🛠 Tech Stack

| Layer        | Technology                             |
|--------------|-----------------------------------------|
| Frontend     | Next.js 15 (App Router), TypeScript     |
| UI Styling   | Tailwind CSS v4, `shadcn/ui`            |
| Backend      | API Routes (`app/api`), Mongoose        |
| Database     | MongoDB Atlas                           |
| Auth         | Supabase Auth / Custom JWT              |


---

## Setup Environment Variables
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

## Run Locally
npm run dev

