# Contributing Workflow Guidelines

Welcome to the project! To maintain code stability and ease verification, please follow these branch guidelines:

## Branch Naming Policy
- Always create a dedicated branch. Never commit directly to `master`.
- Use descriptive, hyphen-separated, lowercase names prefixed with one of the following:
  - `fix/` for bug fixes
  - `feat/` for new features and visual enhancements
  - `docs/` for any documentation modifications
  - `security/` for vulnerability mitigations and sanitizers
  - `ci/` for pipeline automation and runner configurations
  - `accessibility/` for screen reader or aria updates
  - `refactor/` for code structure improvements
  - `perf/` for performance caching or lazy loading updates

## Pull Request Checklist
1. Pull latest master and rebase before pushing:
   ```bash
   git checkout master
   git pull origin master
   git checkout your-branch
   git rebase master
   ```
2. Verify all tests pass locally.
3. Ensure no unrelated changes are included in your PR commits.
