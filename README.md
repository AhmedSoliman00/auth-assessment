# Full-Stack Secure Authentication Application 🔒

A full-stack technical assessment implementing enterprise-grade authentication with **NestJS**, **MongoDB**, **React (TypeScript)**, **Vite**, and **Zustand**. Built with modern clean architecture, secure token rotation, and robust state management.

---

## 🌟 What the Application Does

The application provides a seamless user authentication experience:

1. **User Registration (`/signup`)**: Allows new users to create an account with full name, email, and strong password validation.
2. **User Sign In (`/signin`)**: Authenticates registered users and issues in-memory access tokens and HttpOnly refresh cookies.
3. **Protected Dashboard (`/dashboard`)**: Displays user profile details and security status. Includes an interactive **Protected API Tester** tool to test `GET /auth/me` and observe silent token refresh in action.
4. **Session Persistence & Silent Refresh**: Automatically restores the authenticated session upon page reload and silently rotates expired access tokens without user interruption.
5. **Secure Sign Out (`/logout`)**: Revokes the refresh token hash on the server and clears the HttpOnly cookie and in-memory state.

---

## 🛡️ Authentication Architecture & Security Techniques

### 1. In-Memory Access Tokens (XSS Defense)
- Access tokens are short-lived (**15 minutes**) and stored **exclusively in memory** via a Zustand state store.
- Access tokens are **never stored in `localStorage` or `sessionStorage`**, eliminating vulnerabilities to Cross-Site Scripting (XSS) token theft.

### 2. HttpOnly Cookie Refresh Tokens (CSRF & Storage Protection)
- Refresh tokens are long-lived (**7 days**) and delivered strictly via **`HttpOnly`**, **`SameSite=Lax/Strict`**, and **`Secure`** HTTP cookies.
- JavaScript running in the browser cannot read or modify the refresh token cookie.

### 3. Refresh Token Rotation & Hashing
- Each time `/auth/refresh` is invoked, the old refresh token is invalidated, a **new refresh token** is issued, and its **bcrypt hash** is updated in MongoDB.
- Re-using a revoked refresh token fails authentication.

### 4. Single-Flight Silent Refresh Interceptor
- Axios response interceptor intercepts `401 Unauthorized` responses from protected API endpoints.
- Uses a **single-flight promise queue** (`refreshPromise`) to consolidate concurrent `401` errors into a single refresh HTTP request, preventing request storms.

### 5. Decoupled API & Refresh Clients (No Circular Dependency Loops)
- The application uses two separate Axios clients:
  - `apiClient`: Used for normal API endpoints with request/response interceptors attached.
  - `refreshClient`: A bare client without interceptors used strictly for token refresh to eliminate circular dependency loops.

### 6. Clean Architecture & Symbol Dependency Injection
- Backend is structured using NestJS with strict feature modularity (`common`, `modules/auth`, `modules/users`).
- Uses Symbol Dependency Injection Token (`USER_REPOSITORY`) to decouple business services (`AuthService`) from the database persistence layer (`UserRepository`).

### 7. User Enumeration Defense & Input Validation
- Sign-in failures return generic `"Invalid credentials"` error messages to prevent email enumeration.
- Input data is validated at both frontend (Zod + React Hook Form) and backend (NestJS `ValidationPipe` + `class-validator`) enforcing strong password rules (minimum 8 characters, letter, number, and special character).

---

## 🚀 How to Run the Application

### Option A: Using Docker Compose (Recommended)

1. **Create the environment file from template**:
   ```bash
   cp .env.example .env
   ```

2. **Run the entire stack (MongoDB + Backend API + Frontend Nginx)**:
   ```bash
   docker compose up --build
   ```

Access the application:
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:3000`
- **Swagger API Docs**: `http://localhost:3000/api/docs`

To stop the services:
```bash
docker compose down
```

---

### Option B: Running Locally (Development Mode)

#### Prerequisites
- Node.js `22.x`
- `pnpm` (or `npm`)
- MongoDB running locally on port `27017` (or Docker container)

#### 1. Backend Setup (`/api`)
```bash
cd api

# 1. Install dependencies
pnpm install

# 2. Copy environment file
cp .env.example .env

# 3. Start development server
pnpm run start:dev
```
*Backend runs on `http://localhost:3000`.*

#### 2. Frontend Setup (`/client`)
```bash
cd client

# 1. Install dependencies
pnpm install

# 2. Copy environment file
cp .env.example .env

# 3. Start Vite dev server
pnpm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🧪 Testing & Quality Assurance

### Run Unit Tests
```bash
# Run NestJS backend unit tests
cd api
pnpm test
```

### Run Code Formatting & Linting
```bash
# Backend linting
cd api
pnpm run lint

# Frontend linting
cd client
pnpm run lint
```

---

## ⚙️ CI/CD Pipeline

This repository includes a pre-configured **GitHub Actions CI workflow** (`.github/workflows/ci.yml`) that automatically runs on every `push` and `pull_request` to `main`:
- **Backend Job**: Dependency caching, ESLint linting, Jest unit tests, and production build verification.
- **Frontend Job**: Dependency caching, Prettier code style checks, and Vite production bundle compilation.

---

## 🛠️ Tech Stack Summary

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, TailwindCSS, Zustand (with Redux DevTools), React Hook Form, Zod, Axios |
| **Backend** | NestJS 11, Node.js 22, TypeScript, Mongoose, Passport JWT, Bcrypt, Pino Logger, Swagger |
| **Database** | MongoDB |
| **DevOps & CI** | Docker, Docker Compose (Multi-stage builds), Nginx, GitHub Actions |
