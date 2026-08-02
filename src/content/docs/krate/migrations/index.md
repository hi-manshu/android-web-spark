# Migrations

Krate supports three migration approaches. Use them individually or combine them.

| Approach | Best for | Description |
|---|---|---|
| [Automatic](automatic.md) | Most cases | Schema hash detects changes, generates SQL |
| [Manual](manual.md) | Complex changes | Full control via `krateMigration { }` DSL |
| [Reversible](reversible.md) | Rollback needed | `up()` / `down()` with rollback support |
| [From Room](from-room.md) | Existing Room apps | Bridge migration with zero data loss |
| [Integration testing](integration-testing.md) | Every release | End-to-end v1→vN coverage against live SQLite |

## Quick start

Most apps only need automatic migration:

```kotlin
val db = krate(context, "my_app") {
    store<String, Note>()
    // That's it — Krate detects schema changes automatically
}
```

## Development mode

During development, wipe and recreate on schema mismatch:

```kotlin
val db = krate(context, "my_app") {
    store<String, Note>()
    fallbackToDestructiveMigration()
}
```
