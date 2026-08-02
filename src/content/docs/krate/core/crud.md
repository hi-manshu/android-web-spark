# CRUD Operations

## Insert

```kotlin
// Operator syntax
notes += Note(title = "Hello")
notes += listOf(note1, note2)

// Explicit
notes.add(note)
notes.addAll(listOf(note1, note2))
```

## Update

```kotlin
// Read-modify-write by key (atomic)
notes.update("id") { copy(title = "Updated", isPinned = true) }
```

## Upsert

Insert if absent, or merge if present:

```kotlin
// Simple — replace if exists
notes.upsert(note)

// Merge — keep existing fields
notes.upsert(note) { existing -> copy(isPinned = existing.isPinned) }

// Batch upsert
notes.upsertAll(serverNotes) { existing -> copy(isPinned = existing.isPinned) }
```

### Upsert merge DSL

Fine-grained control over which fields to keep, take, or merge:

```kotlin
notes.upsert(note) {
    keep(Note::isPinned) { copy(isPinned = it) }      // keep existing value
    max(Note::version) { copy(version = it) }          // take the larger version
    merge(Note::tags, { copy(tags = it) }) { local, incoming ->
        (local + incoming).distinct()                   // custom merge logic
    }
}
```

## Insert-if-absent

```kotlin
val inserted: Boolean = notes.putIfAbsent(note)
// true if inserted, false if key already existed
```

## Bulk update

```kotlin
// Update all matching items atomically — returns count
val n: Int = notes.updateAll(Note::isPinned eq false) { copy(isPinned = true) }
```

## Delete

```kotlin
// By key
notes -= "id"
notes.delete("id")

// All items
notes.deleteAll()

// By predicate — returns count
notes.deleteAll(Note::createdAt lt cutoffMs)
```

## Bulk transform

```kotlin
// Transform every item and write back in one batch
notes.replaceAll { copy(synced = true) }
notes.replaceAll { copy(wordCount = body.split(" ").count { it.isNotBlank() }) }
```

## Batch operations

```kotlin
notes.deleteWhere(Note::status eq "archived")
notes.increment(Note::viewCount, by = 1, Note::id eq "n1") { copy(viewCount = it.toInt()) }
```
