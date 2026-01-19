# User Authentication Specification

## Summary
Implement a secure JWT-based authentication system including User registration, Login, and Protected routes. This involves backend API development with NestJS and frontend integration with React + Ant Design.

## Requirements

### 1. Database (Prisma)
- **User Model**:
  - `id`: Int (Autoincrement) or UUID
  - `email`: String (Unique)
  - `password`: String (Hashed)
  - `name`: String (Optional)
  - `createdAt`: DateTime
  - `updatedAt`: DateTime

### 2. Backend (NestJS)
- **Modules**:
  - `UsersModule`: Manage user data.
  - `AuthModule`: Handle authentication logic (Passport, JWT).
- **API Endpoints**:
  - `POST /auth/register`: Create a new user.
  - `POST /auth/login`: Validate credentials and return JWT access token.
  - `GET /auth/profile`: Get current user profile (Protected Guard).
- **Security**:
  - Use `bcrypt` for password hashing.
  - Use `passport-jwt` for token strategy.

### 3. Frontend (React + Antd)
- **Pages**:
  - `/login`: Login form (Email, Password).
  - `/register`: Registration form (Name, Email, Password).
- **Components**:
  - `AuthProvider`: Context to manage user state and token storage (localStorage/cookie).
  - `ProtectedRoute`: Wrapper for routes requiring login.
- **UX**:
  - Use Ant Design `Form`, `Input`, `Button`, `message`.
  - Redirect to Dashboard after login.

## Acceptance Criteria
- [ ] User can register with a new email.
- [ ] User cannot register with an existing email.
- [ ] User can login with valid credentials.
- [ ] User receives a 401 error with invalid credentials.
- [ ] Protected routes are inaccessible without a token.
