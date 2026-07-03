# Architecture

## Pattern: Monolith

Single deployable unit. All features live in one codebase and share the same database.

**Layer structure** (strict top-down, never skip layers):
```
UI (components, pages)
  ↓
Store / Hooks (state management)
  ↓
Actions (server actions or API routes)
  ↓
Services (business logic)
  ↓
Repositories (data access)
  ↓
Database
```


## API Style: REST

RESTful endpoints. Nouns for resources, HTTP verbs for actions.

## Decision Log
See `ai/context/decisions.md` for architecture decision records.
