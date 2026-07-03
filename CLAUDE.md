# demo_ilie

## Tech Stack
- **Frontend**: Next.js
- **Database**: Supabase
- **Auth**: Supabase Auth
- **Deployment**: Vercel
- **Architecture**: Monolith
- **API style**: REST

## Code Conventions
- Files and directories: kebab-case
- All TypeScript — never use `any` unless absolutely necessary
- Prefer named exports over default exports
- Server components by default; add `"use client"` only when needed
- Never access `process.env` directly — use the config module if one exists
- No commented-out code, no TODO comments unless there's a ticket reference

## Git Workflow
- Branch strategy: feature-branches
- Branch naming: `feature/<short-description>` or `fix/<short-description>`
- Commit format: `feat: ...` / `fix: ...` / `chore: ...` (conventional commits)
- Code review: required
- Always create PRs targeting `main`

## Testing
- Write tests for any business logic you add
- Run type-check (`npx tsc --noEmit`) before committing
- Run lint (`npm run lint`) before committing
- If a build command exists, verify it passes: `npm run build`

## Security
- Never hard-code secrets or API keys
- Never commit `.env` files
- Validate all user input at boundaries

## What NOT to do
- Do not modify unrelated files
- Do not delete or overwrite existing tests
- Do not change package.json unless the story requires new dependencies
- Do not push directly to `main`

## Agents in this project
- **dev**: see `.claude/agents/developer-agent.md`
- **qa**: see `.claude/agents/qa-agent.md`
- **architect**: see `.claude/agents/architect-agent.md`
- **ba**: see `.claude/agents/ba-agent.md`
