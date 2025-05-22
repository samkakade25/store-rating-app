# Store Rating App Frontend

React-based frontend for the Store Rating Application.

## Technology Stack

- React 18
- Vite
- Tailwind CSS
- Axios
- React Router DOM

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```plaintext
VITE_API_URL=http://localhost:5000
```

3. Start development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── assets/        # Static assets
│   ├── App.jsx        # Main application component
│   └── main.jsx       # Application entry point
├── public/            # Public assets
└── index.html         # HTML template
```

## Component Structure

- `AdminDashboard` - Dashboard for administrators
- `StoreOwnerDashboard` - Dashboard for store owners
- `UserDashboard` - Dashboard for regular users
- `Navbar` - Navigation component
- `Login/Signup` - Authentication components

## Authentication

Uses JWT tokens stored in localStorage for authentication.