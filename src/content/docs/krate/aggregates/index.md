# Aggregates

Krate provides two aggregate APIs:

- **[Basic aggregates](basic.md)** — `store.aggregate()` returns suspend results
- **[Grouped aggregates](grouped.md)** — partition by a property, optional HAVING
- **[Reactive aggregates](reactive.md)** — `store.aggregateFlow()` returns `Flow`

When a SQL executor is available (production), aggregates push to SQLite (`SELECT SUM(col)`, etc.). In tests with `inMemoryKrate`, they compute in Kotlin.

```kotlin
// Quick examples
val total    = notes.aggregate().count()
val avgScore = notes.aggregate().avg(Note::score)
val byPin    = notes.aggregate().groupBy(Note::isPinned).count()
```
