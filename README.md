# Mindmap Project

A full-stack application built with FastAPI (backend) and Next.js (frontend).

## Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: Next.js 16 with React 19, TypeScript, and Tailwind CSS

## Project Structure

```
.
├── backend/        # FastAPI backend
│   └── venv/       # Python virtual environment and source code
└── frontend/       # Next.js frontend
```

## Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn

## Setup

### Backend Setup

Dependencies are already installed. Just activate the virtual environment:

```bash
cd backend/venv
source venv/bin/activate  # On macOS/Linux
```

### Frontend Setup

Dependencies are already installed. No setup needed.

## Running the Application

### Start the Backend Server

1. Navigate to backend and activate the virtual environment:
   ```bash
   cd backend/venv
   source venv/bin/activate
   ```

2. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

The API will be available at `http://localhost:8000`

### Start the Frontend Server

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## Testing the Server

### Test the Backend

1. Visit the API docs at `http://localhost:8000/docs`
2. Try the greeting endpoint:
   ```bash
   curl http://localhost:8000/api/greeting
   ```
   Expected response: `{"message": "Hello from FastAPI!"}`

### Test the Frontend

1. Open `http://localhost:3000` in your browser
2. The Next.js app should load successfully

## Development

- Backend changes will auto-reload thanks to the `--reload` flag
- Frontend changes will hot-reload automatically in development mode

## Building for Production

### Backend
```bash
cd backend/venv
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm run build
npm start
```
