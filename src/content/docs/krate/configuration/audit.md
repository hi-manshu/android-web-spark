# Audit Trail

Track every change to a store — who changed what, when, and what the old value was.

## Setup

```kotlin
store<String, Note> {
    audit(AuditMode.Rolling(50))  // keep last 50 versions per item
}
```

## Audit modes

| Mode | Behaviour |
|---|---|
| `AuditMode.Debug` | Only records when `KrateAuditConfig.isDebug` is true |
| `AuditMode.Always` | Records every change |
| `AuditMode.Rolling(n)` | Keeps last `n` entries per item, auto-prunes |
| `AuditMode.Window(durationMs)` | Keeps entries within the time window |
| `AuditMode.Off` | Disabled |

## Querying history

```kotlin
// Full history for an item
val entries: List<AuditEntry<Note>> = noteStore.history("n1")

// Changelog (newest first)
val changes: List<AuditEntry<Note>> = noteStore.changelog("n1")

// Specific version
val v3: Note? = noteStore.versionAt("n1", version = 3)
```

## AuditEntry

```kotlin
data class AuditEntry<T>(
    val auditId: Long,
    val entityKey: String,
    val operation: AuditOperation,  // INSERT, UPDATE, DELETE
    val timestamp: Long,
    val snapshot: T?,               // value after the change
    val previous: T?,               // value before the change
)
```

## Restoring a version

```kotlin
noteStore.restoreVersion("n1", version = 3)
```

## Comparing versions

```kotlin
val diff = noteStore.diffVersions("n1", fromVersion = 2, toVersion = 5)
// Returns the two AuditEntry objects for comparison
```

## Undo / Redo

```kotlin
noteStore.undo("n1")     // revert last change
noteStore.redo("n1")     // re-apply last undone change
noteStore.canUndo("n1")  // Boolean
noteStore.canRedo("n1")  // Boolean
```

## Housekeeping

```kotlin
noteStore.purgeHistory("n1")              // delete all audit entries for one item
noteStore.purgeHistory("n1", keepLast = 5) // keep only last 5
```

## Check audit status

```kotlin
if (noteStore.isAudited()) { /* audit is enabled */ }
```
