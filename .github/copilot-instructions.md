# Copilot Cloud Agent Onboarding for `dayour/scout-swe`

## What this repository contains
- Monorepo with TypeScript workspaces under `packages/*` plus a Docusaurus docs site in `docs/`.
- Python bindings live in `python/` and are validated separately in CI.
- Root uses npm workspaces and TypeScript project references (`tsc -b`).

## First steps in a fresh agent session
1. Install dependencies:
   - `npm ci`
2. Baseline validation (matches CI `ci.yml`):
   - `npm run build`
   - `npm test`
   - `npm run docs:build`
3. Python smoke check (also in CI):
   - `python -m pip install ./python`
   - `python -c "import scout_swe; print('scout_swe', scout_swe.__version__)"`

## Important repo conventions
- Keep changes focused and minimal.
- TypeScript is ESM/NodeNext across packages.
- Add/adjust unit tests in `packages/<pkg>/test/*.test.ts` for behavior changes.
- Do not use emojis in source/docs/comments/output; use text labels like `[OK]`, `[ERROR]`, `[WARNING]`.

## Useful paths
- Root scripts and workspace config: `package.json`
- CI workflow: `.github/workflows/ci.yml`
- Docs deploy workflow: `.github/workflows/docs.yml`
- Contributor rules: `CONTRIBUTING.md`

## Errors encountered and workarounds
- **CI `npm ci` lockfile sync failure**  
  Observed in workflow run `27180901810` (`build-test` job):  
  `npm ci` failed with `EUSAGE` and `Missing: yaml@2.9.0 from lock file`.  
  **Workaround:** run `npm install` locally to regenerate `package-lock.json`, then commit both `package.json` and `package-lock.json` if dependency graph changed.

- **Workflow run metadata may be partially populated**  
  Some runs are `in_progress` and have `conclusion: null`, which can break scripts that assume `conclusion` always exists.  
  **Workaround:** defensively read workflow fields (null-safe parsing) when automating run summaries.

## Before finalizing a PR
- Re-run the relevant checks above.
- Ensure no unrelated files were changed.
- Keep docs updated if behavior or developer workflow changed.
