# Migrations

Krate has its own migration DSL built on top of Room. When you change the schema of a `@Storable` class, register a `CrateMigration` in the `krate { }` block.

---

## Basic Migration

```kotlin
import com.himanshoe.krate.migration.CrateMigration

val addWordCountMigration = CrateMigration(from = 1, to = 2) { db ->
    db.execSQL("ALTER TABLE note ADD COLUMN wordCount INTEGER NOT NULL DEFAULT 0")
}

val db: Krate = krate("my_app") {
    store<Note>()
    migration(addWordCountMigration)
}
```

---

## Adding a Column

```kotlin
// Before
@Storable
data class Note(@Key val id: String, val title: String, val body: String)

// After — added createdAt
@Storable
data class Note(@Key val id: String, val title: String, val body: String, val createdAt: Long = 0L)
```

Migration:

```kotlin
val MIGRATION_1_2 = CrateMigration(from = 1, to = 2) { db ->
    db.execSQL("ALTER TABLE note ADD COLUMN createdAt INTEGER NOT NULL DEFAULT 0")
}
```

---

## Renaming a Column

SQLite doesn't support `RENAME COLUMN` in older versions. The standard approach is to recreate the table:

```kotlin
val MIGRATION_2_3 = CrateMigration(from = 2, to = 3) { db ->
    db.execSQL("""
        CREATE TABLE note_new (
            id TEXT PRIMARY KEY NOT NULL,
            note_title TEXT NOT NULL,
            body TEXT NOT NULL,
            createdAt INTEGER NOT NULL DEFAULT 0
        )
    """.trimIndent())
    db.execSQL("INSERT INTO note_new SELECT id, title, body, createdAt FROM note")
    db.execSQL("DROP TABLE note")
    db.execSQL("ALTER TABLE note_new RENAME TO note")
}
```

---

## Chaining Migrations

Register multiple migrations — they must form a contiguous chain:

```kotlin
val db: Krate = krate("my_app") {
    store<Note>()
    migration(MIGRATION_1_2)
    migration(MIGRATION_2_3)
    migration(MIGRATION_3_4)
}
```

Krate validates the chain at startup and will throw `KrateMigrationException` if there's a gap.

---

## Destructive Migration (Development Only)

During active development, opt in to drop-and-recreate instead of migrating:

```kotlin
val db: Krate = krate("my_app") {
    store<Note>()
    fallbackToDestructiveMigration()   // ⚠️ destroys all data on schema mismatch
}
```

> Never use `fallbackToDestructiveMigration()` in production.

---

## Schema Export

Always export your Room schema for diff-friendly history and migration testing:

```kotlin
room {
    schemaDirectory("$projectDir/schemas")
}
```

Commit the exported JSON files to version control — they are required for `MigrationTestHelper`.

---

## Testing Migrations

```kotlin
@RunWith(AndroidJUnit4::class)
class MigrationTest {
    @get:Rule
    val helper = MigrationTestHelper(
        InstrumentationRegistry.getInstrumentation(),
        KrateDatabase::class.java
    )

    @Test
    fun migrate1To2() {
        helper.createDatabase("test-db", 1).apply { close() }
        helper.runMigrationsAndValidate("test-db", 2, true, MIGRATION_1_2)
    }
}
```
