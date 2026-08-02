# Built-in Middleware

## LoggingMiddleware

Logs every operation with its type and key:

```kotlin
store<String, Note> {
    debugMiddleware(LoggingMiddleware())
}
// → ADD Note key=n1
// ← ADD completed in 2ms
```

## TimingMiddleware

Warns when operations exceed a threshold:

```kotlin
store<String, Note> {
    debugMiddleware(TimingMiddleware(thresholdMs = 50))
}
// ⚠️ SLOW: GET_ALL took 120ms (threshold: 50ms)
```

## QueryCountMiddleware

Tracks operation counts and warns on excessive calls:

```kotlin
store<String, Note> {
    debugMiddleware(QueryCountMiddleware(maxOps = 20))
}
```

## WriteTrackerMiddleware

Detects excessive write frequency:

```kotlin
store<String, Note> {
    debugMiddleware(WriteTrackerMiddleware(maxWritesPerSecond = 50))
}
```

## Debug-only middleware

`debugMiddleware()` wraps any middleware so it only runs when `KrateAuditConfig.isDebug` is `true`. Zero overhead in release builds:

```kotlin
store<String, Note> {
    debugMiddleware(LoggingMiddleware())    // skipped in release
    middleware(MetricsMiddleware())          // always active
}
```
