# Raw SQL with typed arguments

Krate's typed APIs (`Store.findByPredicate`, `Store.aggregate`, joins/CTEs)
cover most query needs. When you need something the typed API doesn't
express — a custom JOIN through three tables, a window function, a vendor-
specific SQLite extension — drop to raw SQL via [`Krate.rawQuery`](../krate-runtime/src/commonMain/kotlin/com/himanshoe/krate/Krate.kt)
and [`Krate.rawExecute`](../krate-runtime/src/commonMain/kotlin/com/himanshoe/krate/Krate.kt).

This page is a recipe book covering every `SqlArg` variant and the common
patterns built on top of them.

## Quick reference: the five variants

| Variant | Wraps | SQL affinity | Construct via |
|---|---|---|---|
| `SqlArg.Text` | `String` | `TEXT` | `SqlArg.text("hi")` or `"hi".toSqlArg()` |
| `SqlArg.Integer` | `Long` | `INTEGER` | `SqlArg.int(7)` / `.long(...)` / `.bool(...)` |
| `SqlArg.Real` | `Double` | `REAL` | `SqlArg.real(3.14)` |
| `SqlArg.Blob` | `ByteArray` | `BLOB` | `SqlArg.blob(bytes)` |
| `SqlArg.Null` | — | `NULL` | `SqlArg.nullArg()` |

Every variant is a sealed `SqlArg` subtype — the compiler refuses
unsupported types (`java.time.Instant`, `BigDecimal`, etc.) at the call
site instead of binding them as `toString()` at runtime.

---

## Read recipes

### 1. Simple equality lookup (TEXT)

```kotlin
data class Author(val id: String, val name: String, val email: String)

val authors: List<Author> = krate.rawQuery(
    sql  = "SELECT id, name, email FROM author WHERE email = ?",
    args = listOf(SqlArg.text("alice@example.com")),
) {
    Author(
        id    = getString("id")!!,
        name  = getString("name")!!,
        email = getString("email")!!,
    )
}
```

### 2. Numeric range (INTEGER, paginated)

```kotlin
val cutoffMs = System.currentTimeMillis() - 30.days.inWholeMilliseconds
val recent: List<NoteRow> = krate.rawQuery(
    sql  = """
        SELECT id, title, created_at FROM note
        WHERE created_at > ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
    """.trimIndent(),
    args = listOf(
        SqlArg.long(cutoffMs),
        20.toSqlArg(),    // limit
        40.toSqlArg(),    // offset
    ),
) {
    NoteRow(
        id        = getString("id")!!,
        title     = getString("title")!!,
        createdAt = getLong("created_at")!!,
    )
}
```

### 3. Boolean flag (1/0)

```kotlin
// Pinned notes only.
val pinned: List<NoteRow> = krate.rawQuery(
    sql  = "SELECT * FROM note WHERE is_pinned = ?",
    args = listOf(SqlArg.bool(true)),
) { /* mapper */ }

// `SqlArg.bool(true)` binds as INTEGER 1; `false` binds as 0.
```

### 4. Floating-point comparison (REAL)

```kotlin
val highlyRated: List<ProductRow> = krate.rawQuery(
    sql  = "SELECT * FROM product WHERE rating >= ? AND price <= ?",
    args = listOf(SqlArg.real(4.5), SqlArg.real(50.0)),
) { /* mapper */ }
```

### 5. BLOB lookup (SHA-256 digest, encrypted payload, etc.)

```kotlin
val avatar: List<AvatarRow> = krate.rawQuery(
    sql  = "SELECT mime, data FROM avatar WHERE digest = ?",
    args = listOf(SqlArg.blob(sha256(userId))),
) {
    AvatarRow(
        mime = getString("mime")!!,
        data = getBlob("data")!!,
    )
}
```

### 6. NULL filter

```kotlin
// Notes with no assigned category.
val uncategorized: List<NoteRow> = krate.rawQuery(
    sql  = "SELECT * FROM note WHERE category_id IS ?",
    args = listOf(SqlArg.nullArg()),
) { /* mapper */ }
```

Note SQLite quirk: `column = NULL` is **never true**. `IS ?` with a bound
NULL works because SQLite's `IS` operator treats NULL as a value.

### 7. Mixed-type predicate

```kotlin
val rows = krate.rawQuery(
    sql = """
        SELECT * FROM order_line
        WHERE customer_id = ?
          AND ordered_at > ?
          AND amount > ?
          AND is_returned = ?
    """.trimIndent(),
    args = listOf(
        SqlArg.text(customerId),                   // TEXT
        SqlArg.long(thirtyDaysAgoMs),              // INTEGER
        SqlArg.real(100.0),                        // REAL
        SqlArg.bool(false),                        // INTEGER 0
    ),
) { /* mapper */ }
```

### 8. `IN (...)` clause (variable-length)

SQLite doesn't expand `?` into a list — you build the placeholder string
manually:

```kotlin
val ids = listOf("n1", "n2", "n3")
val placeholders = ids.joinToString(",") { "?" }
val notes: List<NoteRow> = krate.rawQuery(
    sql  = "SELECT * FROM note WHERE id IN ($placeholders)",
    args = ids.map { it.toSqlArg() },
) { /* mapper */ }
```

### 9. `LIKE` substring search

```kotlin
val q = "kotlin"
val matches: List<NoteRow> = krate.rawQuery(
    sql  = "SELECT * FROM note WHERE title LIKE ?",
    args = listOf(SqlArg.text("%$q%")),    // wildcard goes in the bound value
) { /* mapper */ }
```

Don't interpolate `q` directly into the SQL — that's a string-injection
vector. The wildcard chars (`%`, `_`) are part of the *value*, not the
template.

### 10. CTE / window function

```kotlin
val topByCategory: List<Pair<String, NoteRow>> = krate.rawQuery(
    sql  = """
        WITH ranked AS (
            SELECT category_id, id, title, score,
                   ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY score DESC) AS rk
            FROM note
            WHERE created_at > ?
        )
        SELECT category_id, id, title, score FROM ranked WHERE rk <= ?
    """.trimIndent(),
    args = listOf(
        SqlArg.long(cutoffMs),
        SqlArg.int(3),    // top 3 per category
    ),
) {
    getString("category_id")!! to NoteRow(
        id    = getString("id")!!,
        title = getString("title")!!,
        score = getLong("score")!!,
    )
}
```

---

## Write recipes

### 11. Single-row UPDATE

```kotlin
val rowsAffected = krate.rawExecute(
    sql  = "UPDATE note SET is_pinned = ? WHERE id = ?",
    args = listOf(SqlArg.bool(true), SqlArg.text("n42")),
)
```

### 12. Bulk DELETE with a date cutoff

```kotlin
val deleted = krate.rawExecute(
    sql  = "DELETE FROM note WHERE created_at < ?",
    args = listOf(SqlArg.long(System.currentTimeMillis() - 365.days.inWholeMilliseconds)),
)
```

### 13. INSERT with mixed types including BLOB

```kotlin
krate.rawExecute(
    sql = """
        INSERT INTO attachment(id, owner_id, mime, payload, uploaded_at)
        VALUES (?, ?, ?, ?, ?)
    """.trimIndent(),
    args = listOf(
        attachmentId.toSqlArg(),
        ownerId.toSqlArg(),
        SqlArg.text("image/png"),
        SqlArg.blob(encryptedBytes),
        System.currentTimeMillis().toSqlArg(),
    ),
)
```

### 14. UPSERT (INSERT … ON CONFLICT)

```kotlin
krate.rawExecute(
    sql = """
        INSERT INTO setting(key, value, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET
            value      = excluded.value,
            updated_at = excluded.updated_at
    """.trimIndent(),
    args = listOf(
        SqlArg.text("theme"),
        SqlArg.text("dark"),
        System.currentTimeMillis().toSqlArg(),
    ),
)
```

### 15. Conditional NULL write

```kotlin
// Clear a category assignment when the user picks "None".
val categoryId: String? = userSelection.takeIf { it != "None" }
krate.rawExecute(
    sql  = "UPDATE note SET category_id = ? WHERE id = ?",
    args = listOf(
        categoryId?.toSqlArg() ?: SqlArg.nullArg(),
        SqlArg.text(noteId),
    ),
)
```

---

## Reactive recipes

`Krate.rawQueryFlow` re-executes the query whenever a watched table is
invalidated. Combine it with typed args the same way:

```kotlin
val pinnedFlow: Flow<List<NoteRow>> = krate.rawQueryFlow(
    sql        = "SELECT * FROM note WHERE is_pinned = ? ORDER BY created_at DESC",
    args       = listOf(SqlArg.bool(true)),     // typed args work via the overload
    watchTables = listOf("note"),
) { /* mapper */ }
```

The watched-tables list tells Room which tables' write events should trigger
re-execution. List every table the query reads from to avoid stale results.

---

## Anti-patterns to avoid

### ❌ Don't string-concatenate user input

```kotlin
// SQL injection waiting to happen.
krate.rawQuery("SELECT * FROM note WHERE author = '$author'", emptyList()) { … }
```

Always parameterise. `SqlArg` makes this trivial.

### ❌ Don't pass `java.time.Instant` directly via the legacy `List<Any?>` overload

```kotlin
// Compiles — but binds Instant.toString() as TEXT, which is almost never what you want.
krate.rawQuery("SELECT * FROM e WHERE at > ?", listOf(Instant.now())) { … }
```

Convert explicitly:

```kotlin
krate.rawQuery(
    "SELECT * FROM e WHERE at > ?",
    listOf(Instant.now().toEpochMilli().toSqlArg()),
) { … }
```

### ❌ Don't bind a `Boolean` to a `BOOLEAN` column

SQLite has no boolean affinity. Use `SqlArg.bool(true)` which binds 1/0
into an `INTEGER` column. Same for matching reads:

```kotlin
val isPinned = getInt("is_pinned") == 1
```

### ❌ Don't forget to declare `watchTables` for reactive queries

```kotlin
// Will not re-emit on note writes — Room doesn't know what to watch.
krate.rawQueryFlow("SELECT * FROM note", emptyList(), watchTables = emptyList()) { … }
```

---

## Where the typed API still wins

Raw SQL is the escape hatch. Prefer the typed API when it covers your case:

| You want… | Use… |
|---|---|
| `WHERE col = value` | `findByPredicate(Note::col eq value)` |
| Count, sum, avg, min, max | `aggregate().count()` / `.sum(...)` etc. |
| Single-table reactive observation | `store.asFlow()` |
| JOIN across `@Storable` types | `krate.multiJoin<Note>().innerJoin<User>().on(...)` |
| Full-text search | `store.ftsSearch(query)` (needs `@FullTextSearch`) |
| Schema migration DDL | `KrateMigration(from = N, to = M)` |

Raw SQL exists for what's left over: window functions, recursive CTEs,
vendor-specific pragmas, custom JOIN strategies, and migration code that
needs to inspect on-disk state row-by-row.
