## Overview

FinTra is built as a full-stack web application with a separate React frontend and NestJS backend.

The main goal of the project is to provide a simple and maintainable platform for managing personal finances while applying software engineering practices such as:

- Domain-Driven Design
- Clean Architecture
- RESTful API design
- Repository Pattern
- Use Case Pattern
- Automated testing
- Separation of concerns

---

## Current Features

### Authentication

- User authentication
- JWT-based authentication
- Google OAuth integration
- Protected API endpoints

### Account Management

Users can manage their financial accounts, including:

- Create an account
- View the current user's account
- Update an account
- Delete an account
- View account balance

### Transaction Domain

The backend currently contains the foundation for transaction management, including:

- Transaction domain entity
- Transaction repository abstraction
- Prisma repository implementation
- Create transaction use case
- Domain validation
- Unit tests for domain logic

> More transaction features are currently being implemented.

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack React Query
- Axios
- Tailwind CSS
- Lucide React

### Backend

- Node.js
- NestJS
- TypeScript
- Passport
- JWT
- Google OAuth

### Database

- PostgreSQL
- Supabase
- Prisma ORM

### Development & Testing

- Jest
- Supertest
- ESLint
- Prettier
- TypeScript

---

## Architecture

The backend follows **Domain-Driven Design (DDD)** and **Clean Architecture** principles.

The general application flow is:

```text
React UI
    ↓
API / Controller
    ↓
Use Case
    ↓
Domain Entity
    ↓
Repository Interface
    ↓
Repository Implementation
    ↓
Prisma ORM
    ↓
PostgreSQL / Supabase
```

This approach keeps the business logic separated from the framework, database, and other infrastructure concerns.

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Git
- PostgreSQL / Supabase account

### 1. Clone the Repository

```bash
git clone https://github.com/ARobeeHerrera/FinTra.git
cd FinTra
```

---

## Backend Setup

### 1. Navigate to the Backend

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory and configure the required environment variables.

Example:

```env
DATABASE_URL="your_database_url"
DIRECT_URL="your_direct_database_url"
JWT_SECRET="your_jwt_secret"
```

> Replace the example values with your own configuration.

### 4. Generate Prisma Client

Generate the Prisma Client based on the current Prisma schema:

```bash
npx prisma generate
```

### 5. Start the Backend

Run the backend in development mode:

```bash
npm run start:dev
```

---

## Frontend Setup

Open another terminal while keeping the backend running.

### 1. Navigate to the Frontend

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create the required environment file and configure the backend API URL.

### 4. Start the Frontend

Run the Vite development server:

```bash
npm run dev
```

The terminal will provide the local URL where the frontend can be accessed.

---

## Testing

The backend uses **Jest** for unit testing and **Supertest** for end-to-end testing.

### Run Unit Tests

```bash
npm run test
```
---

## Design Goals

FinTra is also a learning project focused on applying software engineering principles to a real-world application.

### Maintainability

Keep business logic organized and independent from infrastructure concerns, making the application easier to understand and maintain.

### Testability

Design domain logic and use cases so they can be tested independently from external frameworks and infrastructure.

### Separation of Concerns

Keep presentation, application logic, domain rules, and infrastructure responsibilities separated.

### Scalability

Structure the application so new financial features can be added without tightly coupling different parts of the system.

---

## License

This project is licensed under the MIT License.

See the [LICENSE](LICENSE) file for more information.

---