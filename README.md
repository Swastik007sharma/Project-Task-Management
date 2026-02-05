# Task Management System

## Objective

Build a full-stack Task Management application using the MERN stack. The application allows users to manage projects and tasks with authentication and authorization.

## Core Features

- User authentication (Register, Login, Logout) using JWT
- Password hashing using bcrypt
- Protected routes on both frontend and backend
- User profile management
- Project CRUD operations (Create, Read, Update, Delete)
- Task CRUD operations under projects
- Task status management (Todo, In Progress, Done)
- Task priority management (Low, Medium, High)
- Dashboard showing project list and task statistics

## Tech Stack Requirements

- Frontend: React, React Router, Hooks, Axios/Fetch
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT
- Basic UI using CSS, Tailwind, or Material UI

## Database Models

- User: `name`, `email`, `password`, `role`
- Project: `title`, `description`, `owner`, `createdAt`
- Task: `title`, `description`, `status`, `priority`, `dueDate`, `project`, `assignedTo`, `createdAt`

## API Documentation

See `API.md` for endpoints and request/response details.

## Live Demo

- Frontend: `https://project-task-management-hazel.vercel.app`

### Demo Credentials

- Admin
  - Email: `Admin@gmail.com`
  - Password: `123456`
- User
  - Create a new account from the Register page.

## Setup Instructions

### Prerequisites

- Node.js (18+ recommended)
- MongoDB instance (local or Atlas)

### Backend Setup

1. Install dependencies:
   `cd backend`
   `npm install`
1. Create environment file:
   - Copy `backend/.env.example` to `backend/.env`
   - Fill in your `MONGO_URI` and `JWT_SECRET`
1. Run the server:
   `npm run dev`

Backend runs at `http://localhost:5000` by default.

### Frontend Setup

1. Install dependencies:
   `cd frontend`
   `npm install`
1. Run the frontend:
   `npm run dev`

Frontend runs on the Vite default port (shown in the terminal).
