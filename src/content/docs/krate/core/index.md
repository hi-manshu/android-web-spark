# Core Store API

A `Store<K, T>` manages a single `@Storable` type. Obtain one from a `Krate` instance:

```kotlin
val notes: Store<String, Note> = db.store()
```

Every Store provides:

- **[CRUD operations](crud.md)** — add, update, delete, upsert, operators
- **[Read operations](reads.md)** — get, getAll, getAllByIds, count, existence checks
- **[Reactive flows](reactive.md)** — asFlow, observe, changes, diff
- **[Snapshots](snapshots.md)** — frozen point-in-time reads

All write and read operations are `suspend` functions. Reactive operations return `Flow`.

## Non-throwing wrappers

Every core operation has a `try*` variant that wraps the result in `Result<T>`:

```kotlin
notes.tryAdd(note)
    .onSuccess { showToast("Saved") }
    .onFailure { err -> showError(err.message) }

notes.tryGet("id")
    .onSuccess { note -> showDetail(note) }
    .onFailure { showNotFound() }

notes.tryDelete("id")
notes.tryUpdate("id") { copy(isPinned = !isPinned) }
```
