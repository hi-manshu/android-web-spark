# Automatic Migration

Krate computes a deterministic hash of each `@Storable` schema. When the hash changes between app versions, Krate generates the necessary `ALTER TABLE` statements.

## What auto-migrates

- Adding a new column (with default value)
- Adding or removing `@Index`
- Changing column defaults

## What needs annotations

```kotlin
@Storable
data class Note(
    @Key val id: String,
    @RenameFrom("body") val summary: String,   // renamed column
)

@Storable
@DropColumn("legacyField")                      // intentionally removed column
data class Note(@Key val id: String, val title: String)
```

## What fails at build time

- Removing a column without `@DropColumn` (safety check)
- Changing a column type (e.g., `Int` to `String`)
- Removing a `@Key` property

## How it works

1. On first open, Krate records the schema hash in a metadata table
2. On subsequent opens, it compares the current hash with the stored one
3. If they differ, it calls `planAutoMigration()` to generate steps
4. Steps execute as `ALTER TABLE ADD COLUMN`, `CREATE INDEX`, etc.

## planAutoMigration()

```kotlin
val plan = planAutoMigration(oldSchema, newSchema)
plan.steps.forEach { step ->
    when (step) {
        is AutoMigrationStep.AddColumn   -> println("ADD ${step.column}")
        is AutoMigrationStep.RenameColumn -> println("RENAME ${step.from} -> ${step.to}")
        is AutoMigrationStep.CreateTable  -> println("CREATE ${step.table}")
        is AutoMigrationStep.DropTable    -> println("DROP ${step.table}")
    }
}
if (plan.errors.isNotEmpty()) {
    plan.errors.forEach { println("ERROR: $it") }
}
```

## schemaHash()

```kotlin
val hash = schemaHash(Note::class)
// Deterministic — ignores column order, only considers names + types
```
