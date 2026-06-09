# Contributing to scout-swe

Thanks for your interest.

## Development

```bash
npm install
npm run build      # tsc -b across all packages
npm test           # vitest
npm run docs:build # Docusaurus
```

## Conventions

- TypeScript, ESM (`"type": "module"`), NodeNext resolution.
- No emojis in source, docs, comments, or output. Use text labels (`[OK]`, `[ERROR]`, `[WARNING]`).
- Each package is a workspace with its own `tsconfig.json` using project references.
- Add unit tests under `packages/<pkg>/test/*.test.ts`.

## Commits & PRs

- Keep changes focused; include tests for behavior changes.
- CI must pass: build, tests, and the docs build.
