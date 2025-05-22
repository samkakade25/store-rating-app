# Store Rating App Backend

Express.js backend API for the Store Rating Application.

## Technology Stack

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt for password hashing

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```plaintext
PORT=5000
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=store_rating_db
JWT_SECRET=your_jwt_secret
```

3. Set up the database:
```bash
psql -U postgres
CREATE DATABASE store_rating_db;
```

4. Run migrations:
```bash
npm run migrate
```

5. Start the server:
```bash
npm run dev
```

## API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Admin Routes
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `GET /api/admin/stores` - Get all stores

### Store Owner Routes
- `GET /api/store-owner/stores` - Get owner's stores
- `POST /api/store-owner/stores` - Create new store
- `GET /api/store-owner/ratings` - Get store ratings

### User Routes
- `GET /api/user/stores` - Get all stores
- `POST /api/user/ratings` - Rate a store

## Project Structure

```
backend/
├── src/
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Custom middleware
│   ├── routes/        # API routes
│   ├── db/           # Database configuration
│   └── app.js        # Application entry point
└── package.json
```

## Error Handling

Uses centralized error handling middleware for consistent error responses.