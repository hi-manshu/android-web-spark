# Store Hooks

Lifecycle hooks fire around every write. Exceptions thrown inside hooks are swallowed and do **not** roll back the write.

## Available hooks

```kotlin
store<String, Note> {
    beforePut    { note -> logger.debug("Saving: ${note.title}") }
    afterPut     { note -> analytics.track("note_saved", note.id) }
    beforeDelete { id   -> logger.debug("Deleting: $id") }
    afterDelete  { id   -> cache.invalidate(id) }
    onError      { op, err -> crashReporter.record("Store.$op", err) }
}
```

## Grouped syntax

```kotlin
store<String, Note> {
    hooks {
        beforePut { note -> log("Saving: ${note.title}") }
        afterPut  { note -> sync(note) }
        onError   { op, err -> report(err) }
    }
}
```

## Conflict handling

```kotlin
store<String, Note> {
    onConflict { existing, incoming ->
        ConflictResolution.Replace(incoming.copy(isPinned = existing.isPinned))
    }
}
```

See [Conflict Resolution](../advanced/conflict-resolution.md) for full details.

## Database callbacks

```kotlin
krate(context, "my_app") {
    onCreate { db -> db.store<String, Note>().add(Note("welcome", "Welcome!")) }
    onOpen   { db -> logger.info("Opened") }
    onClose  { analytics.flush() }
}
```

## Hooks vs middleware

| Feature | Hooks | Middleware |
|---|---|---|
| Scope | Per write operation | All operations (read + write) |
| Can block? | No | Yes (skip `proceed()`) |
| Can modify? | No | Yes (transform items) |
| Error handling | Swallowed | Propagated |
| Use for | Analytics, logging, cache | Rate limiting, access control, metrics |
