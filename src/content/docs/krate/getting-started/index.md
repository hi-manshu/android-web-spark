# Getting Started

Krate is a Kotlin Multiplatform type-safe reactive database built on Room KMP. Write zero SQL — define data classes, and Krate handles the rest.

## 5-minute quickstart

### 1. Define your data

```kotlin
@Storable
data class Note(
    @Key val id: String = generateId(),
    val title: String,
    val body: String = "",
    val isPinned: Boolean = false,
)
```

### 2. Open the database

```kotlin
// Android
val db = krate(context, "my_app") {
    store<String, Note>()
}

// iOS
val db = krate("my_app") {
    store<String, Note>()
}
```

### 3. Use it

```kotlin
val notes: Store<String, Note> = db.store()

// Write
notes += Note(title = "Hello Krate!")

// Read
val all = notes.getAll()
val note = notes["some-id"]

// Reactive
notes.asFlow().collect { list -> render(list) }

// Query
notes.findByPredicate(Note::isPinned eq true)
    .sortedByDescending(Note::createdAt)
    .take(10)
    .asFlow()
```

## Next steps

- [Setup](setup.md) — Gradle configuration, platform setup, ProGuard
- [Annotations](annotations.md) — `@Storable`, `@Key`, `@Index`, `@References`, `@Embeddable`
- [Supported Types](supported-types.md) — Primitives, dates, collections, embeddables

## Documentation map

| Section | What you'll learn |
|---|---|
| [Core](../core/index.md) | CRUD, reads, reactive flows, snapshots |
| [Querying](../querying/index.md) | Predicates, sorting, pagination, pipelines |
| [Aggregates](../aggregates/index.md) | sum, avg, min, max, groupBy |
| [Relations](../relations/index.md) | Views, JOINs, fluent traversal, scoping |
| [Advanced](../advanced/index.md) | Partial updates, TTL, conditional writes, undo |
| [Middleware](../middleware/index.md) | Interceptors, metrics, access control |
| [Configuration](../configuration/index.md) | Hooks, validation, audit trail |
| [Migrations](../migrations/index.md) | Auto, manual, reversible, from Room |
| [Integrations](../integrations/index.md) | Compose, Paging, Export, Lint |
| [Reference](../reference/index.md) | API cheat sheet |
