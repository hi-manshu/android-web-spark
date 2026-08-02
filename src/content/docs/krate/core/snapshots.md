# Snapshots

A snapshot is a frozen, read-only view of all items at a point in time. Does not reflect writes made after creation.

## Creating a snapshot

```kotlin
val snap: StoreSnapshot<String, Note> = notes.snapshot()
val item  = snap["note-1"]
val all   = snap.toList()
val count = snap.count()
```

## Scoped snapshots

The snapshot is released after the block completes:

```kotlin
notes.withSnapshot { snap ->
    val pinned = snap.toList().filter { it.isPinned }
    val total  = snap.count()
    renderReport(pinned, total)
}
```

## When to use snapshots

- **Consistent reads** — when you need multiple reads to see the same state
- **Report generation** — freeze state, compute, then render
- **Comparison** — snapshot before a batch operation, compare after

```kotlin
// Example: before/after comparison
val before = notes.snapshot()
notes.replaceAll { copy(synced = true) }
val after = notes.snapshot()

val changedCount = before.toList().zip(after.toList()).count { (b, a) -> b != a }
```
