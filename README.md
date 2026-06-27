# Resume GenAI

Resume GenAI is a MERN-style application with a React/Vite frontend and an Express/MongoDB backend.

## Project structure

- `Frontend/` - React app built with Vite
- `Backend/` - Express API with MongoDB, JWT auth, and cookie-based sessions

## Prerequisites

- Node.js 20 or newer
- npm
- MongoDB connection string

## Local setup

1. Install backend dependencies:

```bash
cd Backend
npm install
```

2. Create backend environment file:

```bash
cp .env.example .env
```

Update `Backend/.env` with your MongoDB URI and JWT secret.

3. Install frontend dependencies:

```bash
cd ../Frontend
npm install
```

4. Create frontend environment file:

```bash
cp .env.example .env
```

5. Start the backend:

```bash
cd ../Backend
npm run dev
```

6. Start the frontend in a second terminal:

```bash
cd Frontend
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend defaults to `http://localhost:3000`.

## Scripts

Backend:

```bash
npm run dev
npm start
```

Frontend:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```
