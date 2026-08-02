# Configuration

Per-store configuration is set via the DSL in `krate { store<T> { ... } }` blocks.

```kotlin
val db = krate(context, "my_app") {
    store<String, Note> {
        // Lifecycle hooks
        hooks {
            beforePut    { note -> logger.debug("Saving: ${note.title}") }
            afterPut     { note -> analytics.track("note_saved") }
            beforeDelete { id   -> logger.debug("Deleting: $id") }
            afterDelete  { id   -> cache.invalidate(id) }
            onError      { op, err -> crashReporter.record("Store.$op", err) }
        }

        // Data validation
        validate {
            notBlank(Note::title)
            maxLength(Note::title, 200)
        }

        // Audit trail
        audit(AuditMode.Rolling(50))

        // Middleware
        middleware(MetricsMiddleware())
    }
}
```

| Feature | Description |
|---|---|
| [Hooks](hooks.md) | Lifecycle callbacks around writes |
| [Validation](validation.md) | Constraint checking before writes |
| [Audit](audit.md) | Change history tracking |
