# QueryResult

`QueryResult<K, T>` is a lazy, composable query. Nothing executes until a terminal operation is called.

## Building a query

```kotlin
noteStore
    .findByPredicate(Note::isPinned eq true)
    .sortedByDescending(Note::createdAt)
    .thenBy(Note::title)
    .take(20)
    .drop(40)
    .asFlow()
```

## Intermediate operations

Each returns a new `QueryResult` — nothing executed yet.

| Operation | SQL equivalent | Notes |
|---|---|---|
| `sortedBy(prop)` | `ORDER BY col ASC` | Replaces prior ordering |
| `sortedByDescending(prop)` | `ORDER BY col DESC` | Replaces prior ordering |
| `thenBy(prop)` | `, col ASC` | Appends to ordering |
| `thenByDescending(prop)` | `, col DESC` | Appends to ordering |
| `take(n)` | `LIMIT n` | |
| `drop(n)` | `OFFSET n` | |
| `distinct()` | `SELECT DISTINCT` | |

## Terminal operations

| Operation | Returns | Notes |
|---|---|---|
| `toList()` | `List<T>` | Snapshot at call time |
| `firstOrNull()` | `T?` | `null` when no match |
| `first()` | `T` | Throws `NoSuchElementException` |
| `count()` | `Int` | |
| `any()` | `Boolean` | `true` if >= 1 match |
| `none()` | `Boolean` | `true` if 0 matches |
| `asFlow()` | `Flow<List<T>>` | Re-evaluates on change |
| `chunked(size)` | `List<List<T>>` | SQL-level paging |
| `fold(initial, op)` | `R` | Left fold |
| `reduce(op)` | `T` | Throws if empty |
| `groupBy(prop)` | `Map<G, List<T>>` | In-memory grouping |
| `sample(n)` | `List<T>` | Random sample |

## Cursor pagination

More efficient than OFFSET for large datasets:

```kotlin
// Page 1
val page1 = notes.findAll()
    .sortedBy(Note::createdAt)
    .take(20).toList()

// Page 2 — start after last item seen
val page2 = notes.findAll()
    .sortedBy(Note::createdAt)
    .afterKey(Note::createdAt, page1.last().createdAt)
    .take(20).toList()

// Backward pagination
val older = notes.findAll()
    .sortedByDescending(Note::createdAt)
    .beforeKey(Note::createdAt, currentPage.last().createdAt)
    .take(20).toList()
```

## Min / max via query

```kotlin
val oldest  = notes.findByPredicate(Note::isPinned eq true).minBy(Note::createdAt)
val highest = notes.findByPredicate(Note::isPinned eq true).maxBy(Note::score)
val top5    = notes.findAll().topN(5, Note::score)
val oldest5 = notes.findAll().bottomN(5, Note::createdAt)
```

## Batch processing

```kotlin
notes.findAll().forEachBatch(100) { batch ->
    batch.forEach { note -> syncToServer(note) }
}
```
