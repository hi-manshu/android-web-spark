# Conflict Resolution

Two independent layers — apply either or both.

## Layer 1: SQLite strategy (compile time)

Set on the `@Storable` annotation:

```kotlin
@Storable(conflictPolicy = ConflictPolicy.Ignore)
data class SeedData(@Key val id: String, val value: String)
```

| Value | Behaviour |
|---|---|
| `Replace` | Delete existing row, insert new. **Default.** |
| `Ignore` | Silently discard incoming row. |
| `Abort` | Throw constraint exception. |

## Layer 2: Application hook (runtime)

Set via `onConflict` in the store config. Takes **priority over** the SQLite strategy.

```kotlin
store<String, Note> {
    onConflict { existing, incoming ->
        ConflictResolution.Replace(incoming.copy(isPinned = existing.isPinned))
    }
}
```

| Return value | Outcome |
|---|---|
| `ConflictResolution.Replace(t)` | Write `t`, emit `StoreChange.Updated` |
| `ConflictResolution.Ignore` | Discard incoming, emit no event |
| `ConflictResolution.Abort` | Throw `ConflictAbortException` |

## Examples

### Server sync — keep local pins

```kotlin
onConflict { existing, incoming ->
    ConflictResolution.Replace(incoming.copy(isPinned = existing.isPinned))
}
```

### Strict insert-only

```kotlin
onConflict { _, _ -> ConflictResolution.Ignore }
```

### Fail on conflict

```kotlin
onConflict { _, _ -> ConflictResolution.Abort }
```
