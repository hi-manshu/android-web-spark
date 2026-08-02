# Relations

Krate provides multiple ways to work with related data:

| Approach | When to use | SQL? |
|---|---|---|
| [Views](views.md) | One-to-one / one-to-many with reactive updates | No (Kotlin) |
| [Joins](joins.md) | Complex multi-table queries, window functions, CTEs | Yes (SQL) |
| [Fluent traversal](fluent.md) | Navigate FK relationships from a single item | No (Kotlin) |
| [Scoped stores](scoped-stores.md) | Multi-tenant data isolation | No (Kotlin) |

## Quick decision guide

- **Need reactive UI updates?** Use [Views](views.md) — they return `Flow`
- **Need complex filtering across tables?** Use [Joins](joins.md) — they push to SQL
- **Loading one related item?** Use [Fluent traversal](fluent.md) — simplest API
- **Per-user data isolation?** Use [Scoped stores](scoped-stores.md)
