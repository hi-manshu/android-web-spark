# Middleware

Middleware intercepts Store operations before and after they execute, forming a chain similar to OkHttp interceptors.

A middleware can:
- **Observe** — log, track analytics, measure timing
- **Modify** — transform items before write
- **Block** — reject operations (rate limiting, read-only mode)
- **Retry** — retry failed operations with backoff

## Registering middleware

```kotlin
store<String, Note> {
    middleware(LoggingMiddleware())           // always active
    middleware(MetricsMiddleware())           // always active
    debugMiddleware(TimingMiddleware())       // debug-only — zero overhead in release
}
```

## Sub-pages

- [Built-in middleware](built-in.md) — Logging, timing, query counting
- [Metrics](metrics.md) — `MetricsMiddleware` for observability
- [Access control](access-control.md) — `readOnly()`, `withAccess()`
- [Custom middleware](custom.md) — Writing your own
