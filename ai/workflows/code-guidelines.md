# Code Guidelines

## Naming
- Files and directories: `kebab-case`
- Components: PascalCase
- Functions and variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Database columns: snake_case

## TypeScript
- Strict mode — no `any` unless absolutely unavoidable
- Prefer named exports over default exports
- All public function parameters must be typed

## Components (Next.js)
- Server components by default
- Add `"use client"` only when DOM access or browser APIs are needed
- Props must have a TypeScript interface

## Environment Variables
- Never access `process.env` directly — use the config module
- Never commit `.env` files

## Git
- Branch naming: `feature/<description>` or `fix/<description>`
- Commit format: `feat:` / `fix:` / `chore:` / `docs:` (conventional commits)
- PRs require at least 1 review before merge

## What NOT to do
- No commented-out code
- No TODO comments without a ticket reference
- No `console.log` in production code
- No hardcoded secrets or API keys
- Do not modify files unrelated to your story
