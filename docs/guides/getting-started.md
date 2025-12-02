# Setup Guide - AI Personal Safety Guardian

## Prerequisites
- Node.js (v18 or higher recommended)
- npm (bundled with Node.js)
- Google Gemini API key (create at https://makersuite.google.com/app/apikey)

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

### 2. Create Backend Environment File

Create a `.env` file in `backend/`:

```bash
cd backend
copy .env.example .env   # PowerShell example
```

Sample values:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8080
FRONTEND_URL=http://localhost:3000
```

> Replace `your_gemini_api_key_here` with a real key or a comma-separated list of keys.

### 3. Frontend Setup

```bash
cd Frontend
npm install
```

### 4. Run Both Services

#### Option A: Script (recommended)
From the project root:

```bash
./run-dev.sh
```

#### Option B: Manual terminals

Terminal 1 (backend):
```bash
cd backend
npm run dev
```

Terminal 2 (frontend):
```bash
cd Frontend
npm run dev
```

## Access Points
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Health check: http://localhost:8080/api/health

## Troubleshooting

### Backend will not start
- Ensure port 8080 is free
- Confirm `.env` exists and includes `GEMINI_API_KEY`
- Inspect terminal output for stack traces

### Frontend issues
- Clear caches (`rm -rf .next`)
- Re-run `npm install`
- Verify Node.js version >= 18

### API connectivity
- Backend must be running on port 8080 (or update `FRONTEND_URL`)
- Check CORS config inside `backend/server.js`
- Ensure frontend `NEXT_PUBLIC_API_BASE_URL` matches backend URL

## Development Notes
- Backend `npm run dev` uses nodemon for reloads
- Next.js hot reload is enabled by default
- Uploaded files are stored under `backend/uploads/` and are cleaned up by the controllers
