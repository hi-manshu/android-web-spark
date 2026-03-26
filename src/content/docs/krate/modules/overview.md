# Modules Overview

Krate is split into focused modules so you only include what you need.

## Module Map

| Module              | Artifact                                | Description                                                               |
|---------------------|-----------------------------------------|---------------------------------------------------------------------------|
| `krate-annotations` | `com.himanshoe.krate:krate-annotations` | `@Storable`, `@Key`, `@KrateName`, `@Embeddable`, `@References`, `@Index` |
| `krate-processor`   | `com.himanshoe.krate:krate-processor`   | KSP processor — generates `Store` implementations at compile time         |
| `krate-runtime`     | `com.himanshoe.krate:krate-runtime`     | `Store<K,T>`, `Krate`, predicates, aggregates, migrations, transactions   |
| `krate-compose`     | `com.himanshoe.krate:krate-compose`     | `collectAsStateWithLifecycle` helpers for Jetpack Compose                 |
| `krate-test`        | `com.himanshoe.krate:krate-test`        | In-memory `Krate` for unit testing                                        |
| `krate-bom`         | `com.himanshoe.krate:krate-bom`         | Bill of Materials — aligns all artifact versions                          |

---

## krate-annotations

Compile-time only. Contains all annotations:

- `@Storable` — marks a data class as a Krate-managed entity
- `@Key` — marks the primary key property (`String`, `Int`, or `Long`)
- `@KrateName` — customises column name, adds `UNIQUE` or `DEFAULT` constraints
- `@Embeddable` — stores a nested data class as JSON in a single column
- `@References` — declares a foreign-key relationship with cascade rules
- `@Index` — adds a database index on one or more columns

---

## krate-processor

The KSP annotation processor. Reads `@Storable` classes at compile time and generates:

- `{Class}Entity` — Room `@Entity`
- `{Class}Dao` — Room `@Dao`
- `{Class}TypeConverter` — JSON converters for embedded types
- `{Class}Mapper` — entity → domain mapper
- `KrateDatabase` — the Room `@Database`
- `krate(context, name) { }` / `krate(name) { }` — the top-level entry point (Android / iOS)

Add as `ksp(...)` — it is never included in your final binary.

---

## krate-runtime

The core runtime — every Krate app needs this. Provides:

- `Store<K, T>` interface with `add`, `delete`, `update`, `asFlow`, `observe`, `findByPredicate`,
  `aggregate`, etc.
- `Krate` handle with `store<K, T>()`, `transaction`, `rawQuery`, `join`
- `PredicateNode` sealed class for type-safe queries
- `AggregateQuery` and `ReactiveAggregateQuery` for `count`, `sum`, `avg`, `groupBy`
- `KrateMigration` DSL for schema migrations
- `StoreHooks` for `afterPut`, `onError`, `onConflict` lifecycle callbacks

**Platforms:** Android, iosX64, iosArm64, iosSimulatorArm64

---

## krate-compose

Optional Compose helpers. Only include if you're using Jetpack Compose.

Provides lifecycle-aware `collectAsStateWithLifecycle` wrappers for:

- `Flow<List<T>>` from `asFlow()` and `QueryResult.asFlow()`
- `Flow<T?>` from `observe(id)`

**Platforms:** Android

---

## krate-test

Provides `inMemoryKrate { }` — an in-memory `Krate` backed by `MutableMap`s. Perfect for unit
testing repositories and ViewModels without a real database.

```kotlin
class NoteRepositoryTest {
    private val db = inMemoryKrate { store<Note>() }
    private val notes = db.store<String, Note>(Note::class)
    private val repo = NoteRepository(notes)

    @Test
    fun `add saves the note`() = runTest {
        repo.add(Note("n1", "Hello", "World"))
        assertEquals(1, notes.count())
    }
}
```

---

## krate-bom

The Bill of Materials. Import it to keep all Krate artifacts on the same version:

```kotlin
dependencies {
    implementation(platform("com.himanshoe.krate:krate-bom:0.1.0"))

    // No versions needed
    implementation("com.himanshoe.krate:krate-runtime")
    ksp("com.himanshoe.krate:krate-processor")
}
```

---

## Minimum Setup

```kotlin
dependencies {
    implementation(platform("com.himanshoe.krate:krate-bom:0.1.0"))
    implementation("com.himanshoe.krate:krate-runtime")
    ksp("com.himanshoe.krate:krate-processor")
    ksp("androidx.room:room-compiler:2.7.0")
}
```

Add `krate-compose` for Compose UIs and `krate-test` in `testImplementation` for unit tests.
