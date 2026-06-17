# AI Interview Copilot

Production-ready React + Express app for interview preparation. It analyzes a job description and resume with Google's Gemini API, then produces JD extraction, ATS scoring, skill gap roadmaps, and mock interview feedback.

## Features

- JD parsing: role, required skills, preferred skills, experience, education, responsibilities, industry, and tools.
- ATS score: match score, matching skills, missing skills, missing keywords, strengths, and improvements.
- Skill gap dashboard: current skills, required skills, missing skills, resources, projects, and learning time.
- Mock interview: 10 personalized questions, answer evaluation, scores, suggestions, and local browser history.
- Responsive UI with dark mode.
- Express API with validation, file upload parsing, rate limiting, CORS, Helmet, and structured JSON prompts.

## Folder Structure

```text
backend/
  controllers/
  middleware/
  prompts/
  routes/
  services/
  utils/
  app.js
  server.js
frontend/
  src/
    components/
    hooks/
    pages/
    services/
  index.html
```

## Environment Setup

Create `backend/.env`:

```env
PORT=5000
CORS_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

The backend includes deterministic fallback analysis if `GEMINI_API_KEY` is missing, so the app can still run locally. Add your Gemini key for real AI output.

## Install and Run

Open two terminals.

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

Backend health check:

```text
http://localhost:5000/health
```

## API Documentation

Base URL:

```text
http://localhost:5000
```

### POST `/api/analyze-jd`

JSON body:

```json
{
  "jobDescription": "Paste the job description here"
}
```

### POST `/api/ats-score`

Multipart form data:

```text
jobDescription: string
resume: PDF/DOCX/TXT file
```

Or:

```text
jobDescription: string
resumeText: string
```

### POST `/api/skill-gap`

Multipart form data:

```text
jobDescription: string
resume: PDF/DOCX/TXT file
```

Or:

```text
jobDescription: string
resumeText: string
```

### POST `/api/generate-interview`

Multipart form data:

```text
jobDescription: string
role: string
resume: PDF/DOCX/TXT file
```

Or:

```text
jobDescription: string
role: string
resumeText: string
```

### POST `/api/evaluate-answer`

JSON body:

```json
{
  "question": "Explain Logistic Regression.",
  "answer": "Your answer here",
  "role": "Data Scientist",
  "jobDescription": "Optional JD context",
  "resumeText": "Optional resume context"
}
```

## Sample Test Data

Job description:

```text
Data Scientist role in FinTech requiring Python, SQL, machine learning, statistics, dashboarding, stakeholder communication, and reporting. Preferred experience with AWS and Docker.
```

Resume text:

```text
Data analyst with Python, SQL, pandas, dashboarding, reporting, and stakeholder communication experience. Built customer churn analysis and automated weekly reporting.
```
