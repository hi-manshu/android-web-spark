# Custom Middleware

## The StoreMiddleware interface

```kotlin
interface StoreMiddleware {
    suspend fun intercept(operation: StoreOperation, chain: MiddlewareChain): Any?
}
```

Call `chain.proceed()` to execute the next middleware or the actual store operation. Not calling `proceed()` blocks the operation entirely.

## StoreOperation

```kotlin
data class StoreOperation(
    val type: OperationType,    // ADD, DELETE, UPDATE, GET, GET_ALL, COUNT, etc.
    val key: Any? = null,       // primary key (null for bulk ops)
    val entityType: String,     // class name
    val itemCount: Int = 1,     // items involved
) {
    val isWrite: Boolean        // true for ADD, DELETE, UPDATE, etc.
}
```

## Example: logging middleware

```kotlin
class LoggingMiddleware : StoreMiddleware {
    override suspend fun intercept(operation: StoreOperation, chain: MiddlewareChain): Any? {
        println("-> ${operation.type} ${operation.key}")
        val result = chain.proceed()
        println("<- ${operation.type} completed")
        return result
    }
}
```

## Example: rate limiter

```kotlin
class RateLimitMiddleware(private val maxPerSecond: Int) : StoreMiddleware {
    private val mutex = Mutex()
    private var count = 0
    private var windowStart = 0L

    override suspend fun intercept(operation: StoreOperation, chain: MiddlewareChain): Any? {
        if (operation.isWrite) {
            mutex.withLock {
                val now = System.currentTimeMillis()
                if (now - windowStart > 1000) { count = 0; windowStart = now }
                if (++count > maxPerSecond) throw IllegalStateException("Rate limit exceeded")
            }
        }
        return chain.proceed()
    }
}
```

## Example: read-only enforcer

```kotlin
class ReadOnlyMiddleware : StoreMiddleware {
    override suspend fun intercept(operation: StoreOperation, chain: MiddlewareChain): Any? {
        if (operation.isWrite) throw IllegalStateException("Store is read-only")
        return chain.proceed()
    }
}
```

## Registration

```kotlin
store<String, Note> {
    middleware(LoggingMiddleware())                    // always active
    middleware(RateLimitMiddleware(maxPerSecond = 100)) // always active
    debugMiddleware(TimingMiddleware())                 // debug only
}
```

Middleware executes in registration order.
