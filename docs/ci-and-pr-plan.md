# CI and pull request plan

## Goal

Add a GitHub Actions check that validates every push and pull request with the same typecheck, lint, test, and production build commands used locally. Publish the change through a pull request into `main` and merge it after the checks pass.

## Files

- `.github/workflows/ci.yml`: GitHub Actions workflow for Node.js setup, dependency installation, and project checks.
- `package.json`, `package-lock.json`: Keep the Windows-only Rolldown binding optional so Linux CI can install the lockfile.
- `README.md`: Short documentation for the CI workflow and the commands it runs.
- `docs/ci-and-pr-plan.md`: This implementation plan and task record.

## Implementation

1. Create the workflow for pushes and pull requests targeting `main`.
2. Use Node.js 22, enable npm cache, and install from the lockfile with `npm ci`.
3. Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`.
4. Update the README so contributors know what CI checks and how to run the same commands locally.
5. Run the checks locally, inspect the diff, commit only the intended files, push the branch, open a PR, and merge it after GitHub reports the checks as passing.

The Windows-only Rolldown binding stays optional. npm installs it on supported Windows hosts and skips it on Linux runners.

## Constraints

- Do not commit `.env.local` or any API key.
- Do not include existing unrelated untracked workspace metadata.
- Keep the workflow small and use maintained official GitHub Actions.
