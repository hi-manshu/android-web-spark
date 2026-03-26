# @KrateName

`@KrateName` customises the SQLite column name and metadata for a property inside a `@Storable`
class.

## Signature

```kotlin
@Target(AnnotationTarget.PROPERTY)
annotation class KrateName(
    val name: String = "",           // custom SQL column name
    val unique: Boolean = false,     // UNIQUE constraint
    val defaultValue: String = "",   // SQL DEFAULT value
)
```

All three parameters are optional — use whichever you need.

---

## Custom Column Name

By default, Krate uses the Kotlin property name as the SQL column name. Use
`@KrateName("custom_name")` to override it.

```kotlin
@Storable
data class Note(
    @Key val id: String,
    @KrateName("note_title") val title: String,
    @KrateName("is_pinned") val isPinned: Boolean = false
)
```

Generated SQL:

```sql
CREATE TABLE note (
    id TEXT PRIMARY KEY NOT NULL,
    note_title TEXT NOT NULL,
    is_pinned INTEGER NOT NULL DEFAULT 0
)
```

---

## Unique Constraint

```kotlin
@Storable
data class User(
    @Key val id: String,
    @KrateName(unique = true) val email: String
)
```

Krate emits a `UNIQUE` index on the `email` column.

---

## SQL Default Value

```kotlin
@Storable
data class Post(
    @Key val id: String,
    val title: String,
    @KrateName(defaultValue = "0") val likeCount: Int,
    @KrateName(defaultValue = "CURRENT_TIMESTAMP") val publishedAt: String?
)
```

The `defaultValue` string is passed verbatim to Room's `@ColumnInfo(defaultValue = …)`.

---

## Combining All Three

```kotlin
@Storable
data class Note(
    @Key val id: String,
    @KrateName("note_title") val title: String,
    @KrateName("is_pinned", unique = false, defaultValue = "0") val isPinned: Boolean,
    @KrateName(unique = true) val slug: String
)
```

---

## Notes

- `@KrateName` has no effect without `@Storable` on the enclosing class.
- The property name in Kotlin is unchanged — only the underlying SQL column is affected.
- The custom column name propagates to all generated DAO queries, the `columnExtractors` map, and
  the `find { }` proxy.
