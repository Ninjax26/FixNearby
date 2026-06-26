# 🚀 Pull Request Template

## 📝 Related Issue
Closes #ISSUE_NUMBER

## 📋 Summary
Provide a concise overview of the contribution, detailing the motivation behind it, the architectural decisions, and the user-facing impact of these changes.

## 🛠️ Changes Made
Detail all file modifications, configuration updates, and feature implementations.
- **Backend**:
  - [Describe changes in routes, controllers, middleware, or utils]
- **Frontend**:
  - [Describe changes in components, layouts, pages, hooks, or styles]
- **Config & Workflows**:
  - [Describe changes in GitHub workflows, package.json dependencies, or templates]

## 🧪 Testing Verification
Detail the testing strategy and verification executed to validate the code changes.
- **Local Integration Testing**:
  - [Specify commands executed, e.g., `npm run test` or curl commands]
- **Responsiveness Verification**:
  - [Detail test results on Mobile, Tablet, and Desktop screen widths]
- **Accessibility Verification**:
  - [Confirm screen reader navigation, focus state styling, and keyboard traps checks]
- **Security Checkpoints**:
  - [List precautions taken against MongoDB operator injection and cross-site scripting]

## 📸 Screenshots (if applicable)
Add visual aids or walkthrough recordings demonstrating the changes before and after implementation.
*Pre-Implementation vs. Post-Implementation*

---

## 🚦 Contribution Checklist
Before submitting, please ensure you satisfy the following checklist items:

- [ ] **Focused Scope**: This PR targets one isolated feature or fix, modifying only relevant files.
- [ ] **Code Standards**: The code matches the existing style guidelines and naming conventions of the repository.
- [ ] **Backward Compatibility**: Existing functions, schemas, and API endpoints maintain full compatibility.
- [ ] **Tests Pass**: Automated linting and tests execute successfully without warning logs.
- [ ] **Accessibility & UX**: Interactive UI elements support full keyboard-navigation access and correct ARIA states.
- [ ] **No Secrets**: No private credentials, API tokens, or environments were committed.
