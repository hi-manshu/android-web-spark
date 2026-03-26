# Migrations

Krate has its own migration DSL built on top of Room. When you change the schema of a `@Storable`
class, register a migration in the `krate { }` block.

---

## How versioning works

Set a `version` argument on the `krate()` call and bump it whenever your schema changes. KSP reads
this value at compile time to stamp the generated `@Database(version = N)` annotation.

```kotlin
val db = krate(context, "my_app", version = 2) {
    store<String, Note>()
    migration(krateMigration(from = 1, to = 2) { /* … */ })
}
```

Rules:

- Start at `version = 1`. Omitting `version` defaults to `1`.
- Increment by 1 for each schema change.
- Register a `krateMigration(from = N, to = N+1)` for every version bump.
- Never set `version` on `@Storable` itself — the version lives only in the `krate()` call.

Krate validates at open time that migrations form a **contiguous chain** from the on-disk version to
the current version. A gap or duplicate throws `KrateMigrationException` with a human-readable
message.

---

## Type-safe DSL — `krateMigration { }`

`krateMigration` is the recommended way to write migrations. It resolves table names automatically
from your `@Storable` classes, so renaming a class is safe and refactoring tools work correctly.

```kotlin
migration(
    krateMigration(from = 1, to = 2) {
        // Add a new column
        addColumn(Note::tags, ColumnType.Text, nullable = false, defaultValue = "'[]'")

        // Rename a column
        renameColumn<Note>(from = "body", to = "summary")

        // Drop a column
        dropColumn<Note>("legacyField")

        // Create a composite index
        createIndex<Note>("idx_note_pinned_date", Note::isPinned, Note::createdAt)

        // Backfill data row by row
        forEach<Note> { row ->
            execute(
                "UPDATE krate_note SET wordCount = ? WHERE id = ?",
                row.getString("summary").split(" ").size,
                row.getString("id"),
            )
        }
    }
)
```

### `addColumn`

```kotlin
// By column name string
addColumn<Note>("tags", ColumnType.Text, nullable = false, defaultValue = "'[]'")

// By property reference — rename-safe
addColumn(Note::tags, ColumnType.Text, nullable = false, defaultValue = "'[]'")
```

| Parameter         | Default | Description                                                                        |
|-------------------|---------|------------------------------------------------------------------------------------|
| `column` / `prop` | —       | Column name or property reference                                                  |
| `type`            | —       | `ColumnType.Text`, `.Integer`, `.Real`, or `.Blob`                                 |
| `nullable`        | `true`  | Adds `NOT NULL` constraint when `false`                                            |
| `defaultValue`    | `null`  | SQL literal. Use `"''"` for empty string, `"0"` for zero, `"'[]'"` for JSON array |

### `ColumnType`

| Value     | SQLite affinity | Kotlin types                                          |
|-----------|-----------------|-------------------------------------------------------|
| `Text`    | TEXT            | `String`, JSON-serialized collections and embeddables |
| `Integer` | INTEGER         | `Int`, `Long`, `Boolean`                              |
| `Real`    | REAL            | `Float`, `Double`                                     |
| `Blob`    | BLOB            | `ByteArray`                                           |

### `renameColumn`

```kotlin
renameColumn<Note>(from = "body", to = "summary")
renameColumn<Note>(from = Note::body, to = "summary")
```

Uses `ALTER TABLE … RENAME COLUMN` on SQLite ≥ 3.25.0; falls back to a table-copy strategy on
older versions.

### `dropColumn`

```kotlin
dropColumn<Note>("legacyField")
dropColumn(Note::legacyField)
```

Uses `ALTER TABLE … DROP COLUMN` on SQLite ≥ 3.35.0; falls back to a table-copy strategy on older
versions.

### `createIndex` / `dropIndex`

```kotlin
createIndex<Note>("idx_note_isPinned", Note::isPinned)
createIndex<Note>("idx_note_pinned_date", Note::isPinned, Note::createdAt)
createIndex<Note>("idx_note_title", Note::title, unique = true)
dropIndex("idx_note_isPinned")
```

### `forEach`

Iterates every row in the table for type `T`. Combine with `execute` to backfill values:

```kotlin
forEach<Note> { row ->
    execute(
        "UPDATE krate_note SET wordCount = ? WHERE id = ?",
        row.getString("summary").split(" ").filter { it.isNotBlank() }.size,
        row.getString("id"),
    )
}
```

### `forEachWhere`

Like `forEach`, but iterates only the rows that match a SQL `WHERE` clause. Useful when you only
need to backfill a subset of rows:

```kotlin
forEachWhere<Note>("isPinned = ?", 1) { row ->
    execute(
        "UPDATE krate_note SET priority = ? WHERE id = ?",
        "high",
        row.getString("id"),
    )
}
```

The `vararg args` list is bound to `?` placeholders in order — the same rules as `execute`.

### `copyColumn`

Adds a new column and copies values from an existing column in one call. Useful when renaming
semantics require keeping the old data:

```kotlin
// Add "summary" column and fill it with the existing "body" values
copyColumn<Note>(from = "body", to = "summary", toType = ColumnType.Text, keyColumn = "id")
```

| Parameter    | Description                                                       |
|--------------|-------------------------------------------------------------------|
| `from`       | Source column name to copy values from                            |
| `to`         | Destination column name (created with `addColumn`)               |
| `toType`     | `ColumnType` for the new column                                   |
| `keyColumn`  | Primary key column name (used in the UPDATE WHERE clause)         |
| `nullable`   | Whether the new column is nullable (default `true`)               |

`MigrationRow` provides:

| Method                     | Description                                                      |
|----------------------------|------------------------------------------------------------------|
| `getString(column)`        | Returns `String`; throws if the value is SQL NULL                |
| `getStringOrNull(column)`  | Returns `String?`                                                |
| `getInt(column)`           | Returns `Int`; throws if the value is SQL NULL                   |
| `getIntOrNull(column)`     | Returns `Int?`                                                   |
| `getLong(column)`          | Returns `Long`; throws if the value is SQL NULL                  |
| `getLongOrNull(column)`    | Returns `Long?`                                                  |
| `getFloat(column)`         | Returns `Float`; throws if the value is SQL NULL                 |
| `getFloatOrNull(column)`   | Returns `Float?`                                                 |
| `getDouble(column)`        | Returns `Double`; throws if the value is SQL NULL                |
| `getDoubleOrNull(column)`  | Returns `Double?`                                                |
| `getBoolean(column)`       | Returns `Boolean` (`1` → `true`, `0` → `false`); throws if NULL |
| `getBooleanOrNull(column)` | Returns `Boolean?`                                               |
| `hasColumn(column)`        | Returns `true` if the column exists in the result set            |

### `execute`

Raw SQL escape hatch for operations not covered by the typed DSL:

```kotlin
execute("ALTER TABLE krate_note ADD COLUMN wordCount INTEGER DEFAULT 0")
execute("UPDATE krate_note SET wordCount = ? WHERE id = ?", 42, "n1")
```

Always use `?` placeholders — never interpolate values directly into the SQL string.

---

## Raw migrations — `KrateMigration`

For full control, extend `KrateMigration` directly. The `MigrationScope` receiver provides the same
helpers as the DSL, but table names must be written manually:

```kotlin
class NoteV2Migration : KrateMigration(from = 1, to = 2) {
    override suspend fun MigrationScope.migrate() {
        execute("ALTER TABLE krate_note ADD COLUMN summary TEXT NOT NULL DEFAULT ''")

        forEach("krate_note") { row ->
            execute(
                "UPDATE krate_note SET summary = ? WHERE id = ?",
                row.getString("body").take(200),
                row.getString("id"),
            )
        }

        dropColumn("krate_note", "body")
    }
}
```

Register the class instance the same way:

```kotlin
val db = krate(context, "my_app") {
    store<String, Note>()
    migration(NoteV2Migration())
}
```

### `MigrationScope` methods

| Method                                              | Description                                             |
|-----------------------------------------------------|---------------------------------------------------------|
| `execute(sql, vararg args)`                         | Run any SQL statement                                   |
| `forEach(tableName) { row -> }`                     | Iterate all rows in a table                             |
| `forEachWhere(table, where, vararg args) { row -> }`| Iterate rows matching a WHERE clause                    |
| `dropColumn(table, column)`                         | Drop a column (with SQLite-version-aware fallback)      |
| `renameColumn(table, from, to)`                     | Rename a column (with fallback)                         |
| `renameTable(from, to)`                             | Rename a table                                          |
| `createTable(createSql)`                            | Create a new table from a full `CREATE TABLE` statement |
| `dropTable(tableName)`                              | Drop a table if it exists                               |
| `createIndex(name, table, unique, vararg columns)`  | Create an index on one or more columns                  |
| `dropIndex(indexName)`                              | Drop an index by name                                   |

All operations run within the same database transaction. If any operation throws, the entire
migration is rolled back.

---

## Migration chain validation

Krate validates migrations at database open time. Common errors:

| Error                                                   | Cause                                    |
|---------------------------------------------------------|------------------------------------------|
| `KrateMigrationException: gap between version 2 and 4` | No migration registered for 2→3          |
| `KrateMigrationException: duplicate migration 1→2`      | Two migrations with the same `from`/`to` |

Fix gaps by registering the missing migration. Fix duplicates by removing or merging the conflicting
entry.

---

## Real-world migration sequence

```kotlin
// v1 → v2: add isPinned column
val migration1to2 = krateMigration(from = 1, to = 2) {
    addColumn(Note::isPinned, ColumnType.Integer, nullable = false, defaultValue = "0")
}

// v2 → v3: add createdAt and backfill existing rows
val migration2to3 = krateMigration(from = 2, to = 3) {
    addColumn(Note::createdAt, ColumnType.Integer, nullable = false, defaultValue = "0")
    forEach<Note> { row ->
        execute(
            "UPDATE krate_note SET createdAt = ? WHERE id = ?",
            System.currentTimeMillis(),
            row.getString("id"),
        )
    }
}

val db = krate(context, "my_app", version = 3) {
    store<String, Note>()
    migration(migration1to2)
    migration(migration2to3)
}
```

Devices on v1 run both migrations in order. Devices on v2 only run the v2→v3 migration.
