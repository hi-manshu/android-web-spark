# Room 3.0 Roadmap

## Current state

Krate currently uses Room 2.x KMP under the hood. 95% of Krate is Room-agnostic — only the internal database driver layer touches Room.

## What changes in Room 3.0

| Area | Room 2.x | Room 3.0 |
|---|---|---|
| Package | `androidx.room` | `androidx.room` (same) |
| Transaction API | `withTransaction { }` | `useWriterConnection { }` |
| Threading | Dispatchers.IO | Direct connection pool |
| Platforms | Android, iOS | Android, iOS, JS, WASM |
| FTS5 | Basic | Custom tokenizers |

## What stays the same

- All `@Storable` annotations
- All Store APIs (CRUD, reactive, queries)
- All extension functions
- All middleware, hooks, validation
- All query DSL and predicates

## Planned architecture

When Room 3.0 is stable, the internal driver layer will be updated:

```
krate-runtime        ← Room-agnostic (95% of code)
krate-runtime        ← Internal driver updated to Room 3.0
```

## Timeline

Room 3.0 is currently in alpha. Krate will update its internal Room driver when Room 3.0 reaches stable.

## User impact

Switching from Room 2.x to 3.0 will require updating to the latest Krate version. No code changes needed — the Room driver is an internal implementation detail.
