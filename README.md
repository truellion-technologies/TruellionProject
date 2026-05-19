# AutoSendEmail Dashboard Documentation

## Overview
This is a full-stack administrative dashboard application built to manage users, authentication workflows, system notifications, and profile details. The application provides robust image management features (cropping and uploading) using Cloudinary and utilizes Nodemailer with Gmail SMTP for secure email capabilities, such as the password recovery flow.

## Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, `react-easy-crop`
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Authentication**: JSON Web Tokens (JWT), `bcryptjs`
- **Media Storage**: Cloudinary, Multer
- **Email Service**: Nodemailer (Gmail SMTP)

## Key Features
- **User Authentication**: Secure login and robust password reset flow (via email tokens).
- **Profile Management**: Profile picture and cover photo uploads (with professional cropping interface for standard dimensions).
- **Dashboard UI**: Professional, responsive administrative dashboard with a fixed sidebar user widget.
- **System Notifications**: Dynamic data management for system notifications.
- **Database**: Cloud-based MongoDB Atlas integration.

---

## Configuration & Environment Variables

### `.env` File Material (Backend)
To run the backend successfully, you must configure the environment variables. The configuration file is located at `backend/.env`.

Below are the exact contents required for your `backend/.env` file:

```env
# Database Connection String
MONGO_URI=mongodb+srv://myselfhamzanasir_db_user:truellionDB123@cluster0.i99ve19.mongodb.net/?appName=Cluster0

# Application Port
PORT=5000

# JSON Web Token Secret (used for signing cookies/tokens)
JWT_SECRET=supersecretjwtkey_12345

# Cloudinary Setup for Profile/Cover Image Uploads
CLOUDINARY_CLOUD_NAME=dzwe1qymu
CLOUDINARY_API_KEY=477224321676124
CLOUDINARY_API_SECRET=VxmkviKkOLlRVw-6j68l88rcA_U

# Frontend Origin for CORS and Email Reset Links
FRONTEND_URL=http://localhost:5173

# Nodemailer SMTP Configuration (Using Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=myselfhamzanasir@gmail.com
SMTP_PASS=gwcmkqatghvyuraa

# Default Sender Address for Automated Emails
FROM_EMAIL=myselfhamzanasir@gmail.com

# Gmail Add-on Installation Link (Used in invitation emails)
ADDON_INSTALL_LINK=https://workspace.google.com/marketplace/app/autosend/DEPLOYMENT_ID
```

> **Note:** The `SMTP_PASS` is typically a 16-character App Password generated from your Google Account security settings, rather than your actual account password. Ensure your `.env` file is added to your `.gitignore` so you do not expose these credentials in version control.

---

## Installation & Running Locally

### 1. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure your `backend/.env` file is created and populated with the variables listed above.
4. Start the backend development server:
   ```bash
   npm start
   ```
   The backend should start running on `http://localhost:5000`.

### 2. Frontend Setup
1. Open a new terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the application in your browser at `http://localhost:5173`.

---

## Project Structure Overview

- **/backend**
  - `server.js`: The main Express server entry point.
  - `routes/`: API endpoints (e.g., `authRoutes.js`, `notificationRoutes.js`).
  - `middleware/`: Custom middleware logic (e.g., `authMiddleware.js`).
  - `.env`: Secret configuration file.
- **/frontend**
  - `src/components/`: Reusable React components (e.g., `Profile.jsx`, `Modals/ResetPasswordModal.jsx`).
  - `index.css`: Global styles and Tailwind imports.
  - `vite.config.js`: Vite build and server configurations.

---

## API Documentation & Workflows

This section outlines the backend structure, data flows, and integrations. Use this documentation to seamlessly connect this system with AI tools or other external platforms.

### 1. Authentication & Admin Workflows (`/api/auth`)
The authentication system uses JSON Web Tokens (JWT) via Bearer Tokens. Passwords are securely hashed using `bcryptjs`.

- **`POST /api/auth/seed`**
  - **Description**: Seeds an initial admin user into the database if none exists.
  - **Payload**: None required.
- **`POST /api/auth/login`**
  - **Description**: Authenticates an admin.
  - **Payload**: `{ "email": "admin@example.com", "password": "password123" }`
  - **Response**: User object with `token` (JWT).
- **`GET /api/auth/profile`**
  - **Description**: Retrieves the authenticated admin's profile.
  - **Headers**: `Authorization: Bearer <token>`
- **`PUT /api/auth/profile`**
  - **Description**: Updates the admin profile, including `avatar` and `cover` image uploads.
  - **Headers**: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
  - **Integration**: Uses `multer` and `multer-storage-cloudinary` to upload directly to Cloudinary.
- **`PUT /api/auth/change-password`**
  - **Description**: Changes the admin's password.
  - **Payload**: `{ "currentPassword": "...", "newPassword": "..." }`
  - **Headers**: `Authorization: Bearer <token>`
- **`POST /api/auth/forgot-password`**
  - **Description**: Generates a secure `crypto` reset token, stores it in the DB with an expiration, and emails a reset link to the user.
  - **Payload**: `{ "email": "admin@example.com" }`
  - **Integration**: Uses `nodemailer` with Gmail SMTP.
- **`PUT /api/auth/reset-password/:token`**
  - **Description**: Validates the token and updates the admin's password.
  - **Payload**: `{ "password": "newpassword123" }`

### 2. User Management Workflows (`/api/users`)
Handles CRUD operations and status toggles for users interacting with the dashboard.

- **`GET /api/users/verify?email=...`**: Verifies if an email is whitelisted, returning status and access details (used by the Google Apps Script Add-on).
- **`GET /api/users/`**: Retrieves all users sorted by latest.
- **`POST /api/users/`**: Creates a new user. Expects `{ name, email, accountStatus, startDate, endDate }`. **Automation**: Automatically triggers an invitation email via Nodemailer containing the Add-on installation instructions and the `ADDON_INSTALL_LINK`.
- **`PUT /api/users/:id`**: Updates an existing user's details.
- **`DELETE /api/users/:id`**: Removes a user from the system.
- **`PATCH /api/users/:id/ban`**: Toggles a user's `isBanned` boolean status.
- **`PATCH /api/users/:id/plan`**: Toggles a user's subscription plan between `demo` and `subscribed` and recalculates end dates.

### 3. System Notifications Workflows (`/api/notifications`)
Manages system-wide activity notifications.

- **`GET /api/notifications/`**: Retrieves the latest 20 notifications.
- **`POST /api/notifications/`**: Adds a new notification event. Automatically trims the collection to keep only the 20 most recent logs.
  - **Payload**: `{ "user": "John Doe", "action": "Logged in" }`

### 4. Third-Party Integrations
- **Cloudinary**: Fully integrated for media storage. The backend handles image processing directly using the `cloudinary` and `multer-storage-cloudinary` modules. Uploads are strictly allowed for `['jpg', 'jpeg', 'png', 'webp']` formats.
- **Nodemailer (SMTP)**: Handles all outgoing emails. Configured to use Gmail SMTP (`smtp.gmail.com` on port 587). Supports rich HTML templates embedded directly in the application routes.

### 5. Frontend & Backend Data Flow
1. **State Management**: The frontend handles routing and global state via React.
2. **API Communication**: The frontend calls the Express server endpoints utilizing standard fetch/axios patterns.
3. **CORS**: The backend is configured with `cors()` middleware to safely accept cross-origin requests from the specified `FRONTEND_URL`.
4. **Error Handling**: The backend implements a global error handler to capture upload or routing errors uniformly, returning standard JSON structures `{ message: "Error details" }`.
