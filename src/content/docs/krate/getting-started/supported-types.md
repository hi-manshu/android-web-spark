# Supported Property Types

Krate supports the following property types on `@Storable` and `@Embeddable` classes.

## Primitives

Map to native Room/SQLite columns. Fully queryable via `find { }`.

| Kotlin type | SQLite column | Nullable variant |
|---|---|---|
| `String` | `TEXT NOT NULL` | `String?` -> `TEXT` |
| `Int` | `INTEGER NOT NULL` | `Int?` -> `INTEGER` |
| `Long` | `INTEGER NOT NULL` | `Long?` -> `INTEGER` |
| `Float` | `REAL NOT NULL` | `Float?` -> `REAL` |
| `Double` | `REAL NOT NULL` | `Double?` -> `REAL` |
| `Boolean` | `INTEGER NOT NULL` (0/1) | `Boolean?` -> `INTEGER` |

## Date/time (kotlinx.datetime)

| Kotlin type | SQLite column | Format |
|---|---|---|
| `Instant` | `INTEGER NOT NULL` | Epoch milliseconds |
| `LocalDate` | `TEXT NOT NULL` | ISO-8601 (`2026-03-22`) |
| `LocalDateTime` | `TEXT NOT NULL` | ISO-8601 (`2026-03-22T10:30:00`) |

## Embeddable types

`@Embeddable` data classes (must be `@Serializable`) are serialized to a single JSON column.

```kotlin
@Embeddable
@Serializable
data class Address(val street: String, val city: String)

@Storable
data class User(@Key val id: String, val address: Address)
```

Embeddable properties are **not queryable** via `find { }`.

## Collections

`List<T>` and `Set<T>` where T is a primitive or `@Embeddable` type are serialized to JSON.

```kotlin
@Storable
data class Note(
    @Key val id: String,
    val tags: List<String> = emptyList(),
    val attachments: List<Attachment> = emptyList(),
)
```

Collection properties are **not queryable** via `find { }`.

## Unsupported types

The KSP processor skips properties with unsupported types and logs a warning. Wrap custom types in an `@Embeddable` data class.
