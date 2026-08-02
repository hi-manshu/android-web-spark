# Database Health & Size Management

Monitor database size, detect fragmentation, and reclaim space.

## Health check

```kotlin
val health = db.health()
health.databaseSizeBytes     // total file size
health.freeBytes             // unused space
health.fragmentationPercent  // % of file that is wasted
health.tableSizes            // Map<String, Long> �� bytes per table
health.indexSizes            // Map<String, Long> — bytes per index
health.integrityOk           // true if SQLite integrity_check passes
health.pageSize              // SQLite page size in bytes
health.pageCount             // total pages
health.freePageCount         // unused pages
health.walSizeBytes          // WAL file size
health.journalMode           // "wal", "delete", etc.
```

## Computed properties

```kotlin
health.totalTableSizeBytes   // sum of all table sizes
health.totalIndexSizeBytes   // sum of all index sizes
health.fragmentationPercent  // (freePages / totalPages) * 100
```

## Vacuum — reclaim space

```kotlin
val health = db.health()
if (health.fragmentationPercent > 20.0) {
    db.vacuum()  // rebuilds the database file, reclaims free pages
}
```

**Warning:** `VACUUM` temporarily doubles disk usage and can be slow on large databases.

## Analyze — update query planner

```kotlin
// After large batch operations
noteStore.addAll(importedNotes)
db.analyze()  // updates SQLite statistics for optimal query plans
```

## Checkpoint — flush WAL

```kotlin
val framesFlushed = db.checkpoint()
// Forces WAL contents to the main database file
```

## Human-readable size

```kotlin
val size = db.sizeFormatted()  // "12.5 MB"
```

## Example: storage settings screen

```kotlin
@Composable
fun StorageSettings(db: Krate) {
    val scope = rememberCoroutineScope()
    var health by remember { mutableStateOf<DatabaseHealth?>(null) }

    LaunchedEffect(Unit) { health = db.health() }

    health?.let { h ->
        Text("Database: ${db.sizeFormatted()}")
        Text("Tables: ${h.tableSizes.size}")
        Text("Fragmentation: ${"%.1f".format(h.fragmentationPercent)}%")
        Text("Integrity: ${if (h.integrityOk) "OK" else "CORRUPTED"}")

        if (h.fragmentationPercent > 10.0) {
            Button(onClick = { scope.launch { db.vacuum(); health = db.health() } }) {
                Text("Optimize Database")
            }
        }
    }
}
```
