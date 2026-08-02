# Reversible Migration

Migrations with rollback support via `up()` and `down()` methods.

## Basic usage

```kotlin
class AddStatusMigration : ReversibleMigration(from = 1, to = 2) {
    override fun up(scope: MigrationScope) {
        scope.addColumn("status", ColumnType.Text, nullable = false, defaultValue = "'draft'")
        scope.createIndex("idx_status", "notes", listOf("status"))
    }

    override fun down(scope: MigrationScope) {
        scope.dropColumn("status")
    }
}
```

## Planning rollback

```kotlin
val plan = migration.planRollback()
plan.steps.forEach { println(it) }
```

## Generating rollback SQL

```kotlin
val sql = migration.generateRollbackSql()
// Returns the SQL statements that would execute during down()
```

## When to use

| Scenario | Approach |
|---|---|
| Feature flag rollback | Reversible — can undo schema changes |
| Phased rollout | Reversible — roll back if issues found |
| Simple additions | Automatic — no rollback needed |
| Data transformations | Manual — too complex to reverse |

## Combining with other approaches

```kotlin
val db = krate(context, "my_app") {
    store<String, Note>()
    migration(AddStatusMigration())
    migration(krateMigration(from = 2, to = 3) {
        addColumn("priority", ColumnType.Integer, nullable = false, defaultValue = "0")
    })
}
```
