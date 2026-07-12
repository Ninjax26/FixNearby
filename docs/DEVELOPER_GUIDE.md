# FixNearby Developer Guide 🛠️

Welcome! This guide consolidates all local development instructions, folder layouts, and coding rules for FixNearby.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or on Atlas)
- npm or yarn

### Configuration Setup
1. Copy `.env.example` in the server root to `.env` and fill in:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/fixnearby
   JWT_SECRET=your_jwt_secret
   ```
2. Navigate to `server` and run `npm install`.
3. Start the dev server: `npm run dev`.

### Client Setup
1. Navigate to `client` and run `npm install`.
2. Start Vite: `npm run dev`.

## Project Directory Map
- `/client`: Frontend codebase (Vite, React, Tailwind CSS)
  - `/src/components`: Shared React UI widgets
  - `/src/pages`: Top-level route pages
- `/server`: Node/Express backend codebase
  - `/controllers`: HTTP controller handlers
  - `/models`: Database schema models
  - `/routes`: Server router endpoints

## Coding Rules
- Do not commit secrets/credentials.
- Follow conventional commits for branches and commits.
- Ensure linting and tests pass before raising a PR.
