# Batch Operations with Progress

Report progress during large batch writes or deletes.

## addAllWithProgress()

```kotlin
store.addAllWithProgress(items, batchSize = 500) { progress ->
    progressBar.progress = progress.percentage
    statusText.text = "${progress.processed} / ${progress.total}"
}
```

## deleteAllWithProgress()

```kotlin
store.deleteAllWithProgress(ids, batchSize = 100) { progress ->
    progressBar.progress = progress.percentage
    if (progress.isComplete) showToast("Deleted ${progress.total} items")
}
```

## BatchProgress

```kotlin
data class BatchProgress(
    val processed: Int,
    val total: Int,
) {
    val percentage: Float   // 0.0..1.0
    val isComplete: Boolean // processed == total
}
```
