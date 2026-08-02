# Store Metrics

`MetricsMiddleware` records timing and count metrics for every store operation.

## Setup

```kotlin
val metrics = MetricsMiddleware()

val db = krate(context, "app.db") {
    store<String, Note>({ it.id }) {
        middleware(metrics)
    }
}
```

## Reactive observation

```kotlin
metrics.metrics().collect { m ->
    log("reads=${m.readCount} writes=${m.writeCount} avgRead=${m.avgReadLatencyMs}ms")
}
```

## Pull snapshot

```kotlin
val snap = metrics.snapshot()
snap.readCount         // total reads
snap.writeCount        // total writes
snap.totalCount        // reads + writes
snap.errorCount        // operations that threw
snap.avgReadLatencyMs  // average read time (ms)
snap.avgWriteLatencyMs // average write time (ms)
snap.avgLatencyMs      // average across all operations
snap.operationCounts   // Map<OperationType, Long>
snap.lastOperationType // most recent operation
```

## Convenience flows

```kotlin
metrics.readCountFlow().collect { reads -> readBadge.text = "$reads" }
metrics.writeCountFlow().collect { writes -> writeBadge.text = "$writes" }
metrics.errorCountFlow().collect { errors -> errorBadge.text = "$errors" }
```

## Reset

```kotlin
metrics.reset()  // clears all counters
```

## StoreMetricsSnapshot

| Property | Type | Description |
|---|---|---|
| `readCount` | `Long` | Total read operations |
| `writeCount` | `Long` | Total write operations |
| `totalCount` | `Long` | `readCount + writeCount` |
| `totalReadTimeMs` | `Long` | Cumulative read time |
| `totalWriteTimeMs` | `Long` | Cumulative write time |
| `errorCount` | `Long` | Operations that threw |
| `avgReadLatencyMs` | `Double?` | `null` if no reads |
| `avgWriteLatencyMs` | `Double?` | `null` if no writes |
| `avgLatencyMs` | `Double?` | `null` if no operations |
| `operationCounts` | `Map<OperationType, Long>` | Per-type breakdown |
| `lastOperationType` | `OperationType?` | Most recent operation |
