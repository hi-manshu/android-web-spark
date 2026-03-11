# Store

`Store<K, T>` is the central interface in Krate. It provides a complete, type-safe API for reading, writing, querying, and observing records.

- `K` — the key type matching your `@Key` property (`String`, `Int`, or `Long`)
- `T` — the domain class annotated with `@Storable`

Obtain a store from the `Krate` handle:

```kotlin
val db: Krate = krate("my_app") { store<Note>() }
val notes: Store<String, Note> = db.store(Note::class)
```

---

## Write Operations

All writes are `suspend` functions.

### `add(item)`
Insert or replace a single item (upsert semantics based on `@Storable`'s `conflictPolicy`).

```kotlin
notes.add(Note(id = "n1", title = "Hello", body = "World"))
```

### `addAll(items)`
Batch upsert — atomic, more efficient than calling `add` in a loop.

```kotlin
notes.addAll(listOf(
    Note("n1", "First", "..."),
    Note("n2", "Second", "...")
))
```

### `+=` operator
Shorthand for `add` and `addAll`:

```kotlin
notes += Note("n3", "Third", "...")
notes += listOf(Note("n4", "A", ""), Note("n5", "B", ""))
```

### `update(id, transform)`
Fetch → transform → write back, atomically.

```kotlin
notes.update("n1") { copy(isPinned = true) }
```

### `upsert(item, merge?)`
Insert if key is new; merge if key exists.

```kotlin
// Replace if exists
notes.upsert(note)

// Merge if exists — keep local pinned state, take server title
notes.upsert(serverNote) { existing -> copy(isPinned = existing.isPinned) }
```

### `putIfAbsent(item)`
Only inserts if the key doesn't already exist. Returns `true` if inserted.

```kotlin
val inserted: Boolean = notes.putIfAbsent(note)
```

---

## Read Operations (suspend)

### `get(id)` / `getValue(id)`
```kotlin
val note: Note? = notes["n1"]        // null if not found
val note: Note  = notes.getValue("n1") // throws if not found
```

### `getAll()`
Returns a point-in-time snapshot of all items.

```kotlin
val all: List<Note> = notes.getAll()
```

### `getAllByIds(ids)`
Batch fetch — single query, returns a map.

```kotlin
val map: Map<String, Note> = notes.getAllByIds(listOf("n1", "n2", "n3"))
```

### `count()`
```kotlin
val total: Int = notes.count()
```

---

## Reactive Operations (Flow)

All reactive APIs return `Flow` — they re-emit automatically on every change.

### `asFlow()`
Observe all items.

```kotlin
notes.asFlow().collect { list -> render(list) }
```

### `observe(id)`
Observe a single item. Emits `null` after deletion.

```kotlin
notes.observe("n1").collect { note -> println(note) }
```

### `changes()`
Fine-grained event stream — emits `Inserted`, `Updated`, or `Deleted` for every write.

```kotlin
notes.changes().collect { change ->
    when (change) {
        is StoreChange.Inserted -> analytics.track("note_created")
        is StoreChange.Updated  -> println("Updated: ${change.new}")
        is StoreChange.Deleted  -> println("Deleted: ${change.id}")
    }
}
```

### `diff()`
Emits what changed between consecutive `asFlow` snapshots.

```kotlin
notes.diff().collect { diff ->
    println("Added: ${diff.added}, Removed: ${diff.removed}")
}
```

---

## Delete Operations

### `delete(id)`
```kotlin
notes.delete("n1")
notes -= "n1"   // operator alias
```

### `deleteAll()`
Truncate the entire table.

```kotlin
notes.deleteAll()
```

### `deleteAll(predicate)`
Delete all matching items. Returns the number deleted.

```kotlin
val count: Int = notes.deleteAll(PredicateNode.Eq(Note::isPinned, false))
```

---

## Query Operations

### `findByPredicate(node)`
Returns a `QueryResult<K, T>` — execute with `.toList()`, `.asFlow()`, `.first()`, etc.

```kotlin
notes.findByPredicate(PredicateNode.Eq(Note::isPinned, true))
     .asFlow()
     .collect { pinned -> render(pinned) }
```

### `search(query, vararg props)`
Full-text substring search across string columns.

```kotlin
// Search all string columns
notes.search("kotlin").asFlow()

// Search specific columns
notes.search("meeting", Note::title, Note::body).toList()
```

---

## Aggregate Operations

```kotlin
val total = notes.aggregate().count()
val words = notes.aggregate().sum(Note::wordCount)

// Reactive — re-emits on change
notes.aggregateFlow().countFlow().collect { count -> println(count) }
```

See the Aggregate Queries section for the full API.

---

## Snapshot

```kotlin
val snapshot: StoreSnapshot<String, Note> = notes.snapshot()

// Or scoped
notes.withSnapshot { snap ->
    val pinned = snap.getAll().filter { it.isPinned }
}
```
