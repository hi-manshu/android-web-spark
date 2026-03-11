# @Storable

`@Storable` marks a Kotlin `data class` as a Krate-managed persistent entity. The KSP processor reads it at compile time and generates a full Room-backed `Store<K, T>` implementation — no boilerplate needed.

## Basic Usage

```kotlin
import com.himanshoe.krate.annotations.Storable
import com.himanshoe.krate.annotations.Key

@Storable
data class Note(
    @Key val id: String,
    val title: String,
    val body: String,
    val isPinned: Boolean = false
)
```

---

## Rules

### Must be a `data class`

`@Storable` only works on Kotlin `data class`. Using it on a regular class causes a compile-time KSP error.

```kotlin
@Storable
data class Product(...)  // ✅

@Storable
class Order(...)          // ❌ compile error
```

### Primary key — `@Key`

Exactly one property must be annotated with `@Key`. The type must be `String`, `Int`, or `Long`.

```kotlin
@Storable
data class Session(
    @Key val sessionId: String,   // ← primary key
    val userId: String,
    val token: String
)
```

### Supported property types

| Kotlin type | SQLite column |
|---|---|
| `String`, `String?` | `TEXT` |
| `Int`, `Long`, `Int?`, `Long?` | `INTEGER` |
| `Float`, `Double`, `Float?`, `Double?` | `REAL` |
| `Boolean`, `Boolean?` | `INTEGER (0/1)` |
| `@Embeddable` data class | `TEXT (JSON)` |
| `List<T>`, `Set<T>` where `T` is primitive or `@Embeddable` | `TEXT (JSON)` |
| `kotlinx.datetime.Instant`, `LocalDate`, `LocalDateTime` | `INTEGER` / `TEXT` |

---

## Conflict Policy

`@Storable` accepts an optional `conflictPolicy` that controls what SQLite does when a row with the same `@Key` already exists:

```kotlin
@Storable(conflictPolicy = ConflictPolicy.Ignore)
data class SeedData(
    @Key val id: String,
    val value: String
)
```

| Policy | Behaviour |
|---|---|
| `ConflictPolicy.Replace` | Overwrites the existing row (default) |
| `ConflictPolicy.Ignore` | Keeps the existing row, discards the new one |
| `ConflictPolicy.Abort` | Rolls back the transaction and throws |

For field-level merge logic (e.g. keep local `isPinned`, take server `title`), use runtime hooks via `store<K, T> { onConflict { existing, incoming -> … } }` in the `krate { }` block.

---

## Column Customisation

Use `@KrateName` on individual properties to override column names or add constraints. See the `@KrateName` section for details.

```kotlin
@Storable
data class User(
    @Key val id: String,
    @KrateName("full_name") val name: String,
    @KrateName(unique = true) val email: String
)
```
