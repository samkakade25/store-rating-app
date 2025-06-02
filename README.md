# Store Rating Application

A full-stack application for managing and rating stores, with different user roles (Admin, Store Owner, and Regular User).

## Project Structure

```
store-rating-app/
├── frontend/         # React frontend application
├── backend/          # Express.js backend API
└── README.md        # This file
```

## Features

- User authentication with role-based access
- Admin dashboard for user and store management
- Store owner dashboard for managing stores and viewing ratings
- User dashboard for viewing and rating stores
- Filtering and sorting capabilities
- Responsive design

## Prerequisites

- Node.js (v14 or higher) or [Bun](https://bun.sh/) (v1.0 or higher)
- PostgreSQL (v12 or higher)
- npm, yarn, or bun package manager

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/store-rating-app.git
cd store-rating-app
```

2. Set up the backend:
   - Using npm:
     ```bash
     cd backend
     npm install
     npm run dev
     ```
   - Using Bun:
     ```bash
     cd backend
     bun install
     bun run dev
     ```

3. Set up the frontend:
   - Using npm:
     ```bash
     cd frontend
     npm install
     npm run dev
     ```
   - Using Bun:
     ```bash
     cd frontend
     bun install
     bun run dev
     ```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Environment Variables

Create `.env` files in both frontend and backend directories. See their respective README files for details.

## License

MIT