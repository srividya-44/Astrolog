# AstroLog

AstroLog is an astronomy observation logging and tracking platform featuring a Node.js/Express backend and a React (Vite) frontend.

## Project Structure

- `frontend/`: React + Vite client application
- `backend/`: Node.js, Express, MongoDB REST API

## Getting Started

### Backend Setup
1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your MongoDB URI and JWT Secret:
   ```bash
   cp .env.example .env
   ```
4. Start the backend server:
   ```bash
   npm start
   # or for development:
   npm run dev
   ```

### Frontend Setup
1. Navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

