# Conditional Writes

Write only if a condition is true. Essential for optimistic locking and conflict prevention.

## updateIf()

```kotlin
val result = store.updateIf("n1", { it.version == 3 }) {
    copy(title = "Updated", version = version + 1)
}

when (result) {
    is WriteResult.Success  -> saved()
    is WriteResult.Rejected -> conflict(result.current)
    is WriteResult.NotFound -> deleted()
}
```

## updateIfVersion()

Shorthand for version-based optimistic locking:

```kotlin
store.updateIfVersion("n1", Note::version, expectedVersion = 3) {
    copy(title = "Updated", version = 4)
}
```

## addIf()

Conditional insert:

```kotlin
val result = store.addIf(note, { it.id }) { existing ->
    existing.status == "draft"  // only replace drafts
}
```

## deleteIf()

Delete only if a condition is met:

```kotlin
store.deleteIf("n1") { it.status == "draft" }
```

## WriteResult

All conditional writes return `WriteResult<T>`:

| Variant | Meaning |
|---|---|
| `WriteResult.Success(item)` | Write succeeded, contains the written item |
| `WriteResult.Rejected(current)` | Condition was false, contains current item |
| `WriteResult.NotFound` | Item with that key does not exist |
