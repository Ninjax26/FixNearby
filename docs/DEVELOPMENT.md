# FixNearby Development & Architecture Guide

Welcome to the contributor documentation for **FixNearby**! This guide details the development setup, repository structure, and codebase architecture.

---

## 🏗️ Architecture Overview

The system is structured as a classic decoupled client-server architecture:

```mermaid
graph TD
  A[React/Vite Client] -->|HTTP/REST APIs| B[Express/Node Server]
  B -->|Mongoose ODM| C[(MongoDB Database)]
  B -->|Mail Delivery| D[Brevo SMTP]
```

### Directory Structure

```text
├── client/          # React frontend with Vite & Tailwind CSS
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React state providers
│   │   ├── pages/       # Route pages
│   │   └── services/    # API calling client layers
├── server/          # Express API server
│   ├── config/      # DB and env configurations
│   ├── controllers/ # Route logic controllers
│   ├── middleware/  # Auth, rate limiting & upload helpers
│   ├── models/      # MongoDB Schema models
│   └── routes/      # REST API route paths
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.x or higher
- **MongoDB**: Local community instance or MongoDB Atlas URI

### Local Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/KGFCH2/FixNearby.git
   cd FixNearby
   ```

2. **Configure environment variables**:
   Create a `.env` file in the root directory (based on `.env.example`).
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/FixNearby
   JWT_SECRET=your-secure-jwt-secret-key
   ```

3. **Install dependencies and start development servers**:
   * **Backend**:
     ```bash
     cd server
     npm install
     npm run dev
     ```
   * **Frontend**:
     ```bash
     cd client
     npm install
     npm run dev
     ```

### Running with Docker Compose

If you have Docker and Docker Compose installed, you can spin up the MongoDB database and both development servers with a single command from the root directory:

```bash
docker-compose up --build
```

This starts:
- MongoDB on port `27017`
- Express API server on port `5000`
- React frontend client on port `5173`

To tear down the environment:
```bash
docker-compose down
```

---

## 🛡️ Coding Standards

- **Code Quality**: Ensure linting passes check prior to submitting any PRs (`npm run lint` inside the client folder).
- **Security**: Never commit raw API secrets or JWT passwords to git. Always use environment configs.
- **Git Flow**: Create isolated, focused branches for all changes. Propose an issue first.
