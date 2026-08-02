# Manual Migration

Full control over schema changes using the `krateMigration { }` DSL.

## Basic usage

```kotlin
val db = krate(context, "my_app") {
    store<String, Note>()
    migration(
        krateMigration(from = 1, to = 2) {
            addColumn(Note::wordCount, ColumnType.Integer, nullable = false, defaultValue = "0")
        }
    )
}
```

## Available operations

| Operation | Description |
|---|---|
| `addColumn(prop, type, nullable, defaultValue)` | Add a new column |
| `dropColumn(name)` | Remove a column |
| `renameColumn(from, to)` | Rename a column |
| `createTable(name, columns)` | Create a new table |
| `dropTable(name)` | Drop a table |
| `createIndex(name, table, columns)` | Create an index |
| `execute(sql)` | Run arbitrary SQL |
| `forEach(sql) { row -> }` | Iterate over query results |

## Examples

### Add column with default

```kotlin
krateMigration(from = 1, to = 2) {
    addColumn(Note::wordCount, ColumnType.Integer, nullable = false, defaultValue = "0")
}
```

### Rename column

```kotlin
krateMigration(from = 2, to = 3) {
    renameColumn("body", "summary")
}
```

### Data migration

```kotlin
krateMigration(from = 3, to = 4) {
    addColumn("fullName", ColumnType.Text, nullable = false, defaultValue = "''")
    execute("UPDATE users SET fullName = firstName || ' ' || lastName")
    dropColumn("firstName")
    dropColumn("lastName")
}
```

## KrateMigration class

For complex migrations that need custom logic:

```kotlin
class MyMigration : KrateMigration(from = 5, to = 6) {
    override fun migrate(scope: MigrationScope) {
        scope.addColumn("status", ColumnType.Text, nullable = false, defaultValue = "'draft'")
        scope.createIndex("idx_status", "notes", listOf("status"))
    }
}
```

## Migration chain validation

Krate validates that migrations form a continuous chain (1->2, 2->3, 3->4) with no gaps or overlaps.
