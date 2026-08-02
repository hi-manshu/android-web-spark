# Query System

Krate's query system has two core types:

- **`PredicateNode`** — a sealed class representing a filter tree (immutable, composable)
- **`QueryResult<K, T>`** — a lazy result that executes only when a terminal is called

Nothing runs against the database until you call a terminal operation.

## Four query layers

| Layer | Where | Example |
|---|---|---|
| [Predicates](predicates.md) | `commonMain` | `Note::isPinned eq true` |
| [QueryResult](query-result.md) | `commonMain` | `.sortedBy(...).take(10).asFlow()` |
| [Full-text search](full-text-search.md) | `commonMain` | `notes.search("kotlin")` |
| [Pipelines](pipelines.md) | `commonMain` | `store.pipeline().filter().aggregate().execute()` |

## Also see

- [Set Operations](set-operations.md) — union, intersect, except
- [Aggregates](../aggregates/index.md) — sum, avg, min, max, groupBy
- [Joins](../relations/joins.md) — multi-table SQL joins
