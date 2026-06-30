# InterviewAI — AI-Powered Interview Preparation Platform

A full-stack web application that analyzes your resume and a job description to generate a personalized interview preparation report using Google Gemini AI.

---

## Features

- **AI Interview Report** — Upload your resume (PDF) + paste a job description → get 10 technical questions, 5 behavioral questions, skill gap analysis, and a 7-day preparation plan
- **Match Score** — Percentage score showing how well your resume aligns with the job
- **Skill Gap Analysis** — Identifies missing skills with severity ratings (low / medium / high)
- **Resume PDF Download** — AI-tailored resume generated from your report
- **Authentication** — JWT-based auth with secure httpOnly cookies
- **Report History** — All your past reports saved and accessible

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router 7, Axios, SCSS, Vite |
| Backend | Node.js, Express 5 |
| Database | MongoDB + Mongoose |
| AI | Google Gemini 2.5 Flash (with 1.5 Flash fallback) |
| PDF | pdf-parse (resume parsing), Puppeteer (PDF generation) |
| Auth | JWT, bcryptjs |
| Security | Helmet, express-rate-limit, Zod validation |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key — [get one here](https://aistudio.google.com/app/apikey)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/resume-genai.git
cd resume-genai
```

### 2. Set up the Backend

```bash
cd Backend
npm install
cp .env.example .env
# Fill in your values in .env
npm run dev
```

### 3. Set up the Frontend

```bash
cd Frontend
npm install
# Optional: create .env with VITE_API_BASE_URL=http://localhost:3000/
npm run dev
```

The app will be available at `http://localhost:5173`

---

## Environment Variables

See [`Backend/.env.example`](./Backend/.env.example) for all required variables.

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs (min 32 chars) |
| `GOOGLE_GENAI_API_KEY` | Google Gemini API key |
| `PORT` | Backend server port (default: 3000) |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Frontend origin for CORS |

---

## API Endpoints

### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/logout` | Public | Logout |
| GET | `/api/auth/get-me` | 🔒 JWT | Get current user |

### Interview
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/interview` | 🔒 JWT | Generate AI interview report |
| GET | `/api/interview` | 🔒 JWT | Get all reports for user |
| GET | `/api/interview/report/:id` | 🔒 JWT | Get single report |
| GET | `/api/interview/resume/pdf/:id` | 🔒 JWT | Download tailored resume PDF |

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| Auth (login/register) | 10 requests / 15 min per IP |
| Report generation | 5 requests / 10 min per IP |
| All other routes | 100 requests / 15 min per IP |

---

## Project Structure

```
resume_GenAI/
├── Backend/
│   ├── src/
│   │   ├── config/         # Database connection
│   │   ├── controllers/    # Route handlers
│   │   ├── middlewares/    # Auth, validation, rate limiting, file upload
│   │   ├── model/          # Mongoose schemas
│   │   ├── routes/         # Express routers
│   │   ├── services/       # AI service (Gemini)
│   │   └── app.js          # Express app setup
│   └── server.js           # Entry point
└── Frontend/
    └── src/
        ├── features/
        │   ├── auth/       # Login, Register, auth context/hooks
        │   └── interview/  # Home, Interview page, context/hooks/services
        ├── App.jsx
        └── main.jsx
```

---

## Author

Gaurav — [GitHub](https://github.com/your-username)
