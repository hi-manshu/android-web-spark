# TTL / Auto-Expiry

Time-based data expiration for caches, sessions, and temporary data.

## Get only if fresh

```kotlin
val cached = store.getIfFresh("key", CacheEntry::createdAt, maxAgeMs = 5 * 60 * 1000)
// Returns null if expired or not found
```

## List expired items

```kotlin
val stale = store.expired(CacheEntry::createdAt, maxAgeMs = 7 * 24 * 60 * 60 * 1000)
```

## Purge expired items

```kotlin
val purgedCount = store.purgeExpired(CacheEntry::createdAt, maxAgeMs = 7 * 24 * 60 * 60 * 1000)
```

## Check single item

```kotlin
val isStale = store.isExpired("key", CacheEntry::createdAt, maxAgeMs = 60 * 60 * 1000)
```

## List fresh items

```kotlin
val freshItems = store.fresh(CacheEntry::createdAt, maxAgeMs = 60 * 60 * 1000)
```

## Example: cache with auto-purge

```kotlin
@Storable
data class CacheEntry(
    @Key val key: String,
    val data: String,
    val createdAt: Long = System.currentTimeMillis(),
)

// Read with freshness check
suspend fun getCached(key: String): String? {
    return cacheStore.getIfFresh(key, CacheEntry::createdAt, maxAgeMs = 5 * 60 * 1000)?.data
}

// Periodic cleanup
suspend fun cleanup() {
    cacheStore.purgeExpired(CacheEntry::createdAt, maxAgeMs = 24 * 60 * 60 * 1000)
}
```
