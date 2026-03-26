# Design Influences

Krate draws on patterns from several well-known databases and libraries. This page explains what
each influence contributed and where you can see it in the API.

---

## Room — the engine

Krate does not re-implement SQLite access. It generates Room code at compile time via KSP and
delegates all SQL execution to Room KMP.

| Krate concept | What Room provides |
|---|---|
| `@Storable` | Generates a Room `@Entity` class |
| `@Key` | Generates `@PrimaryKey` on the entity |
| `@Index` | Generates Room `@Index` directly |
| `@References` | Generates `@ForeignKey` with cascade rules |
| `@Embeddable` | Generates `@TypeConverter` (JSON ↔ column) |
| `asFlow()` | Delegates to a Room DAO `Flow`-returning `@Query` — Room's `InvalidationTracker` drives re-emission |
| `rawQuery` / `rawQueryFlow` | Delegates to Room `@RawQuery` DAOs |
| Migrations | `KrateMigration.toRoomMigration()` wraps Krate migrations as Room `Migration` objects |
| `conflictPolicy` | Maps to Room's `OnConflictStrategy.REPLACE / IGNORE / ABORT` |

Room handles the SQLite connection, thread scheduling, and schema versioning. Krate adds the
type-safe API layer on top of it.

---

## MongoDB — the mental model

The overall shape of `Store<K, T>` — a named bucket of typed documents identified by a key — comes
from document-store thinking.

**Key-value CRUD:**
```kotlin
// These read exactly like MongoDB's insertOne / findOne / deleteOne
notes.add(note)
notes.get("n1")
notes.delete("n1")
```

**Nested objects as JSON documents:**
`@Embeddable` classes and collections are serialised to JSON and stored in a single column. You get
nested structure without flattening the schema:

```kotlin
@Embeddable
@Serializable
data class Location(val lat: Double, val lng: Double)

@Storable
data class Place(
    @Key val id: String,
    val location: Location,                      // one JSON column
    val previousLocations: List<Location> = emptyList(), // one JSON array column
)
```

**Aggregation pipeline:**
`aggregate()` and `aggregateFlow()` mirror MongoDB's aggregation pipeline — filter a collection,
group it, then compute statistics:

```kotlin
notes.aggregate()
    .where(PredicateNode.Eq("isPinned", true))
    .groupBy<String>("authorId")
    .count()
```

---

## Redis — change streams

The hot-change-stream pattern in Krate is directly inspired by Redis Pub/Sub and Redis Streams.

**`changes()` — a never-ending event stream:**
```kotlin
notes.changes().collect { change ->
    when (change) {
        is StoreChange.Inserted -> …
        is StoreChange.Updated  -> …
        is StoreChange.Deleted  -> …
    }
}
```

Backed by `MutableSharedFlow(replay = 0)` with `DROP_OLDEST` overflow — the same semantics as a
Redis stream consumer that can fall behind under load.

**`diff()` — structured deltas:**
```kotlin
notes.diff().collect { diff ->
    diff.inserted.forEach { addToUi(it) }
    diff.deleted.forEach  { removeFromUi(it) }
    diff.updated.forEach  { (old, new) -> updateInUi(old, new) }
}
```

**Flow control:**
```kotlin
notes.asFlowDebounced(300L)   // emit only after 300 ms of silence
notes.asFlowThrottled(500L)   // emit at most once per 500 ms window
```

---

## Realm — live objects

Realm popularised the idea that query results should stay live and re-evaluate automatically.
Krate applies the same idea through Kotlin `Flow`.

**Live collections:**
`asFlow()` never completes. It re-emits the full list every time a write touches the store — just
like Realm's `RealmResults`.

```kotlin
viewModelScope.launch {
    notes.asFlow().collect { list -> _state.value = list }
}
```

**Single-item observation:**
```kotlin
notes.observe("n1").collect { note ->
    // re-emits on every update; emits null after deletion
}
```

**Live aggregates:**
```kotlin
notes.aggregateFlow().countFlow().collect { n -> badge.text = "$n" }
```

---

## SQLDelight — type-safe multiplatform generation

SQLDelight proved that you can generate a full, type-safe database layer from source annotations
without writing a single DAO by hand, and that it can be multiplatform.

Krate applies the same idea with KSP:

- Every `@Storable` class produces a complete Room entity, DAO, type converters, and mapper at
  compile time — no hand-written boilerplate.
- The API is identical on Android and iOS.
- `rawQuery` / `rawQueryFlow` provide the same SQL escape hatch that SQLDelight's custom queries
  offer.

---

## What is unique to Krate

The patterns above have all been seen elsewhere. The following are Krate's own contributions:

### `partialUpdate` — zero-read field mutation

Issues a single `UPDATE … SET col = ? WHERE key = ?` with no prior read. No other KMP ORM has
this as a first-class DSL:

```kotlin
notes.partialUpdate("n1") {
    set(Note::isPinned, true)
    set(Note::updatedAt, System.currentTimeMillis())
}
```

### Lazy `QueryResult` pipeline

Predicates, ordering, limit, and offset are collected into a descriptor. SQL is only generated and
executed when a terminal operation (`toList()`, `asFlow()`, `count()`) is called:

```kotlin
notes.findAll()
    .sortedByDescending(Note::createdAt)
    .take(20)
    .asFlow()                      // SQL built and executed here
```

### Type-safe migration DSL

`krateMigration { }` resolves table names from Kotlin types at compile time, so renaming a class
does not silently break a migration:

```kotlin
krateMigration(from = 1, to = 2) {
    addColumn(Note::tags, ColumnType.Text, defaultValue = "'[]'")
    renameColumn<Note>(from = "body", to = "summary")
}
```

### `FakeStore` and `inMemoryKrate`

A complete in-memory test double that records every method call. No instrumentation, no Room, no
file system:

```kotlin
val fake = FakeStore<String, Note>(keyOf = { it.id })
viewModel.pinNote("n1")
assertEquals(1, fake.updateCalls.size)
```

### `snapshot()` / `withSnapshot`

A frozen, consistent point-in-time view of the store, safe to read across multiple suspension
points without the data changing under you:

```kotlin
notes.withSnapshot { snap ->
    val pinned   = snap.filter { it.isPinned }
    val unpinned = snap.filter { !it.isPinned }
    // snap is immutable for the duration of this block
}
```

---

## Summary

| Pattern | Source | Krate surface |
|---|---|---|
| SQLite engine + codegen | Room | `@Storable` → `@Entity`, DAO, `@Database` |
| Reactive Flow | Room / Kotlin Coroutines | `asFlow()`, `observe()`, `changes()`, `diff()` |
| Key-value document model | MongoDB | `Store<K, T>` CRUD |
| JSON nested objects | MongoDB | `@Embeddable`, `List<@Embeddable>` as JSON columns |
| Aggregation pipeline | MongoDB | `aggregate()`, `aggregateFlow()`, `groupBy` |
| Hot change stream | Redis | `changes()` — `SharedFlow`, DROP_OLDEST, never completes |
| Live collections | Realm | `asFlow()`, `observe()`, `aggregateFlow()` |
| Type-safe multiplatform generation | SQLDelight | KSP generates entire DB layer; Android + iOS |
| Partial update DSL | **Krate** | `partialUpdate { set(prop, value) }` |
| Lazy query pipeline | **Krate** | `QueryResult` descriptor → SQL at terminal op |
| Type-safe migration DSL | **Krate** | `krateMigration { addColumn(Note::prop, …) }` |
| In-memory test doubles | **Krate** | `FakeStore`, `inMemoryKrate` with call recording |
| Snapshot isolation | **Krate** | `snapshot()` / `withSnapshot { }` |
