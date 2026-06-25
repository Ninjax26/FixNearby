# Contributing to FixNearby 🚀

First off, thank you for considering contributing to FixNearby! It's people like you that make open-source such a fantastic community to learn, inspire, and create.

This document provides guidelines and steps for contributing to this project. 

## 1. Where do I start?

Before writing code, please review our detailed [**Open Source Contributor Roadmap**](./docs/CONTRIBUTOR_ROADMAP.md) to understand:
* **System Subsystems:** Backend APIs, React Frontend, and Background Schedulers.
* **Architectural Integration Gaps:** Backend vs. Frontend flow mismatches (e.g., booking and searching bypasses) and orphaned components that need integration.
* **Wishlist Tasks:** Specific backend and frontend features categorized by skill level (Beginner, Intermediate, Advanced).

If you are looking for a way to contribute, you can start by checking our **Issues** tab. Look for issues labeled `good first issue` or `help wanted`.

Alternatively, if you find a bug or have a feature request:
- **Check existing issues** to see if it has already been reported.
- **Open a new issue** and clearly describe the bug or feature request.

## 2. Project Setup

Follow these steps to get your local development environment set up:

1. **Fork the repository** to your own GitHub account.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/FixNearby.git
   cd FixNearby
   ```
3. **Set up the remote upstream** so you can keep your fork synced with the original repository:
   ```bash
   git remote add upstream https://github.com/souma9830/FixNearby.git
   ```

### 🖥️ Frontend (Client)
1. Navigate to the client directory: `cd client`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

### ⚙️ Backend (Server)
1. Navigate to the server directory: `cd server`
2. Install dependencies: `npm install`
3. Duplicate `.env.example` to `.env` and fill in your variables (e.g., MongoDB URI).
4. Start the dev server: `npm run dev`

## 3. Development Workflow

1. **Create a new branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```
   *Branch naming convention: Use prefixes like `feature/`, `fix/`, `docs/`, or `refactor/`.*

2. **Make your changes**. Look for `TODO:` comments scattered throughout the frontend and backend codebase to find areas that specifically need work!

3. **Keep your fork synced** by rebasing or merging from the upstream `master` branch frequently.

## 4. Commit Guidelines

We prefer clean and descriptive commit messages. Please follow these general rules:
- Use the present tense ("Add feature" not "Added feature").
- Keep the first line under 72 characters.
- Reference issues if applicable (e.g., "Fix login button styling (#12)").

## 5. Submitting a Pull Request (PR)

When you're ready to submit your changes:

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Go to the original repository on GitHub and click **Compare & pull request**.
3. Fill out the PR template. Clearly describe the changes you made, why you made them, and how they should be tested.
4. Link any relevant issues (e.g., "Closes #15").
5. Wait for a review! We'll review your code and might suggest some tweaks before merging.

## 6. Code Style & Standards

- **React/Frontend**: We use functional components and React Hooks. Styling is done via Tailwind CSS. Try to keep components modular and reusable.
- **Backend**: We use Express.js and Mongoose. Please keep routing, controllers, and database models cleanly separated.
- **Comments**: Comment your code where the logic gets complex. 

## 7. Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful, welcoming, and collaborative.

---

Once again, thank you for your time and effort in improving FixNearby. Happy coding! 🎉
