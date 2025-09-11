#  Version Control Panel

A full-stack configuration management panel built with Vue 3, Pinia, Tailwind CSS (frontend), and Node.js, Express, Firebase Firestore (backend). This system allows authenticated users to manage application parameters/configurations via a web interface.

---

## Table of Contents

- [Features](#features)
- [System Overview](#system-overview)
- [Backend API Endpoints](#backend-api-endpoints)
- [Local Development Setup](#local-development-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
  - [Backend Example `.env`](#backend-example-env)
  - [Frontend Example `.env`](#frontend-example-env)
- [Testing](#testing)

---

## Features

- User authentication via Firebase
- Add, edit, and delete configuration parameters
- View all parameters in a responsive dashboard
- Secure API endpoints (JWT-based, token verification middleware)
- **Optimistic locking** for safe concurrent updates prevents conflicts by version control
- **Country-based version management:** Each parameter can have country-specific overrides and versioning, allowing you to manage different values per country and track their changes independently.
- Environment-based configuration
- Ready for deployment on Heroku (backend) and Vercel (frontend)

---

## System Overview

- **Frontend:** Vue 3, Pinia, Tailwind CSS, Vite
- **Backend:** Node.js, Express, Firebase Admin SDK, Firestore
- **Authentication:** Firebase Authentication (email/password)
- **Database:** Firestore (configs collection)
- **Deployment:** Heroku (backend), Vercel (frontend)

---

## Backend API Endpoints

Base URL: `https://config-panel-backend-casestudy-3e1325ac03ba.herokuapp.com/api`

> **All endpoints except `/auth/signin` and `/config` require a valid Bearer token in the `Authorization` header. Token verification is handled by backend middleware.**

| Method | Endpoint                | Description                                 | Auth Required |
|--------|-------------------------|---------------------------------------------|--------------|
| POST   | `/auth/signin`          | Sign in with Firebase ID token              | No           |
| GET    | `/parameters`           | Get all configuration parameters            | Yes          |
| POST   | `/parameters`           | Create a new parameter                      | Yes          |
| PUT    | `/parameters/:id`       | Update a parameter by ID (**optimistic locking**) | Yes          |
| DELETE | `/parameters/:id`       | Delete a parameter by ID                    | Yes          |
| GET    | `/config`               | Get public configuration for clients        | No           |

> **Country-based Versioning:**  
> Parameters can have country-specific versions.  
> To fetch a country-specific version, add the `country` query parameter to the endpoint:  
> - `GET /parameters?country=TR`  
>
> This allows you to track parameter versions independently for each country. IF there is no specific country based version, the default version is fetched.
> Use the country management modal in the UI to edit or add country-specific values.

---

## Local Development Setup

### Backend Setup

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd backend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the `backend/` directory (see [Backend Example `.env`](#backend-example-env)).
   - Place your Firebase service account JSON as `serviceAccountKey.json` in `backend/`.

4. **Start the backend server:**
   ```sh
   npm run dev
   ```
   The backend will run on `http://localhost:3000` by default.

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```sh
   cd ../frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the `frontend/` directory (see [Frontend Example `.env`](#frontend-example-env)).

4. **Start the frontend development server:**
   ```sh
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` by default.

---

## Deployment

### Backend (Heroku)

1. Set up a Heroku app and add your environment variables in the Heroku dashboard.
2. Add your `backend/serviceAccountKey.json` as a config var or use a secure file storage.
3. Push your backend code to Heroku:
   ```sh
   git push heroku main
   ```

### Frontend (Vercel)

1. Set up a new project and connect your frontend directory.
2. Add your frontend environment variables in the dashboard.
3. Deploy!

---

## Environment Variables

### Backend Example `.env`

```env
PORT=3000
```

- Place your Firebase service account JSON as `backend/serviceAccountKey.json`.

### Frontend Example `.env`

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

You can find these values in your Firebase project settings.

---

## Testing

- **Backend:** Use Postman or curl to test API endpoints (see Backend API Endpoints). Remember to include a valid Bearer token for protected routes. For country-based versioning, test the endpoints with country-specific payloads.
- **Frontend:** Use the web UI to sign in and manage parameters, including country-specific values via the country modal.

