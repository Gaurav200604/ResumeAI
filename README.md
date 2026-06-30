# Resume GenAI

AI-powered resume analysis and interview preparation platform.

Live App: https://resume-ai-gaurav13.vercel.app/

Resume GenAI helps candidates prepare for job interviews by comparing a resume with a job description and generating a personalized interview preparation report. It includes match scoring, skill gap analysis, technical and behavioral interview questions, a preparation plan, and resume PDF generation.

---

## Features

- AI interview report from resume PDF, self-description, and job description
- Resume-to-job match score
- Skill gap analysis with severity levels
- Technical and behavioral interview questions
- 7-day interview preparation plan
- AI-generated resume PDF download
- Secure authentication using JWT and httpOnly cookies
- Saved report history for logged-in users
- Rate limiting, validation, and security headers on the backend

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, React Router 7, Axios, SCSS, Vite |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| AI | Google Gemini |
| PDF | pdf-parse, Puppeteer |
| Auth | JWT, bcryptjs, httpOnly cookies |
| Security | Helmet, express-rate-limit, Zod |
| Deployment | Vercel frontend, Render backend |

---

## Project Structure

```text
resume_GenAI/
|-- Backend/
|   |-- src/
|   |   |-- config/          # Database connection
|   |   |-- controllers/     # Route handlers
|   |   |-- middlewares/     # Auth, validation, upload, rate limiting
|   |   |-- model/           # Mongoose models
|   |   |-- routes/          # Express routes
|   |   |-- services/        # Gemini AI service
|   |   `-- app.js           # Express app setup
|   `-- server.js            # Backend entry point
`-- Frontend/
    `-- src/
        |-- features/
        |   |-- auth/        # Login, register, auth context/hooks
        |   `-- interview/   # Interview pages, hooks, API services
        |-- App.jsx
        `-- main.jsx
```

---

## Getting Started

### Prerequisites

- Node.js 18 or newer
- MongoDB local database or MongoDB Atlas cluster
- Google Gemini API key from https://aistudio.google.com/app/apikey

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/resume-genai.git
cd resume-genai
```

### 2. Set Up the Backend

```bash
cd Backend
npm install
cp .env.example .env
npm run dev
```

Fill in `Backend/.env` before starting the server.

### 3. Set Up the Frontend

```bash
cd Frontend
npm install
npm run dev
```

The frontend runs locally at:

```text
http://localhost:5173
```

The backend runs locally at:

```text
http://localhost:3000
```

---

## Environment Variables

Backend variables are documented in `Backend/.env.example`.

| Variable | Description |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `GOOGLE_GENAI_API_KEY` | Google Gemini API key |
| `PORT` | Backend server port |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Frontend origin allowed by CORS |
| `CLIENT_URLS` | Optional comma-separated list of extra frontend origins |

For production on Render, `CLIENT_URL` should be the frontend origin only:

```env
CLIENT_URL=https://resume-ai-gaurav13.vercel.app
```

For production on Vercel, set the frontend API URL:

```env
VITE_API_BASE_URL=https://resume-genai-backend.onrender.com/
```

---

## API Endpoints

### Auth

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login user |
| `POST` | `/api/auth/logout` | Public | Logout user |
| `GET` | `/api/auth/get-me` | Required | Get current user |

### Interview

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/interview` | Required | Generate interview report |
| `GET` | `/api/interview` | Required | Get all saved reports |
| `GET` | `/api/interview/report/:id` | Required | Get one report |
| `GET` | `/api/interview/resume/pdf/:id` | Required | Download generated resume PDF |

---

## Rate Limits

| Area | Limit |
| --- | --- |
| Login and register | 10 requests per 15 minutes per IP |
| Report generation | 5 requests per 10 minutes per IP |
| General API routes | 100 requests per 15 minutes per IP |

---

## Deployment

The project is deployed with:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

Production app:

```text
https://resume-ai-gaurav13.vercel.app/
```

---

## Author

Gaurav
