# Annotations

Krate annotations live in the `krate-annotations` module — a pure common artifact with no runtime dependencies.

## @Storable

Marks a data class as a Krate-managed entity. KSP generates a Room entity, DAO, type converters, and a type-safe proxy class.

```kotlin
@Storable
data class Note(
    @Key val id: String = generateId(),
    val title: String,
    val body: String = "",
    val isPinned: Boolean = false,
    val tags: List<String> = emptyList(),
)
```

**Rules:**
- Must be a `data class`
- Must have exactly one `@Key` property
- All properties must be [supported types](supported-types.md)
- Collections and `@Embeddable` types are stored as JSON and are **not queryable** via `find { }`

### Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `conflictPolicy` | `ConflictPolicy` | `Replace` | SQLite conflict strategy for every insert. |
| `tableName` | `String` | `""` (use class name lowercase) | SQL table name. Set when coexisting with an existing Room or hand-written SQL table — see [Migration annotations](#migration-annotations). |

### ConflictPolicy

| Value | Behaviour |
|---|---|
| `Replace` | Delete existing row, insert new one. Default. |
| `Ignore` | Silently discard the incoming row. |
| `Abort` | Throw a constraint exception. |

```kotlin
@Storable(conflictPolicy = ConflictPolicy.Ignore)
data class SeedData(@Key val id: String, val value: String)
```

## @Key

Marks the primary key. Must appear on **exactly one** property per `@Storable`. Zero or more than one is a compile-time error.

```kotlin
@Storable
data class Note(@Key val id: String, ...)    // String key

@Storable
data class Counter(@Key val id: Int, ...)    // Int key

@Storable
data class Event(@Key val id: Long, ...)     // Long key
```

Supported key types: `String`, `Int`, `Long`.

## @Index

Adds a SQLite index. Repeatable — apply as many as you need.

```kotlin
@Storable
@Index("isPinned")                           // single-column
@Index("isPinned", "createdAt")              // composite
@Index("email", unique = true)               // unique constraint
data class Note(
    @Key val id: String,
    val title: String,
    val isPinned: Boolean = false,
    val email: String,
    val createdAt: Long,
)
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `columns` | `vararg String` | -- | Column names to index |
| `unique` | `Boolean` | `false` | Enforce unique values |

**When to use:**
- Columns you filter or sort on frequently
- Foreign key columns
- Columns that must be unique (email, slug)

**Trade-off:** indexes speed up reads but slightly slow writes. Only index columns you query on.

## @References

Declares a SQLite foreign key. Enforced at the database level.

```kotlin
@Storable
data class Label(
    @Key val id: String = generateId(),
    @References(Note::class, onDelete = Cascade.DELETE)
    val noteId: String,
    val name: String,
)
```

When a `Note` is deleted, all `Label` rows with matching `noteId` are automatically deleted by SQLite.

| Value | Behaviour |
|---|---|
| `Cascade.NONE` | Do nothing (may cause orphans) |
| `Cascade.DELETE` | Delete child rows |
| `Cascade.SET_NULL` | Set FK column to `NULL` |

> Add an `@Index` on the foreign key column to keep FK lookups fast.

## @Embeddable

Marks a data class as a JSON value type inside a parent `@Storable`.

```kotlin
@Embeddable
@Serializable
data class Location(val lat: Double, val lng: Double, val label: String = "")

@Storable
data class Place(
    @Key val id: String = generateId(),
    val name: String,
    val location: Location,                            // single JSON column
    val previousLocations: List<Location> = emptyList(), // JSON array
)
```

**Rules:**
- Must be `@Serializable` (kotlinx.serialization)
- Nested properties are **not queryable** — they are opaque JSON blobs

## @FullTextSearch + @FtsIndexed

Opt a `@Storable` class into SQLite FTS5 full-text search. The class-level
`@FullTextSearch` marker triggers virtual-table generation; the per-property
`@FtsIndexed` marker declares which `String` columns are indexed.

```kotlin
@Storable
@FullTextSearch
data class Note(
    @Key val id: String,
    @FtsIndexed val title: String,
    @FtsIndexed val body: String?,
    val isPinned: Boolean = false,    // not indexed
)
```

KSP emits a `note_fts` virtual table plus three sync triggers so writes to
`note` keep the FTS index in lockstep. Query via [`Store.ftsSearch`](../querying/full-text-search.md).

**Rules:**
- The class must carry `@Storable` and `@FullTextSearch`.
- At least one property must be `@FtsIndexed` — a `@FullTextSearch` class with
  zero indexed properties is rejected at compile time.
- `@FtsIndexed` is only valid on `String` / `String?` properties. FTS5 doesn't
  index numbers or blobs.

## Migration annotations

### @Storable(tableName)

Override the default SQL table name. By default Krate uses the class's simple
name in lowercase (e.g. `Note` → `note`). Set `tableName` explicitly to point
Krate at an existing Room table (matching Room's `@Entity(tableName = "...")`)
or any hand-written SQL table.

```kotlin
@Storable(tableName = "notes")
data class Note(@Key val id: String, val title: String)
```

### @RenameFrom

Tell KSP a column was renamed (for auto-migration):

```kotlin
@Storable
data class Note(
    @Key val id: String,
    @RenameFrom("body") val summary: String,
)
```

### @DropColumn

Acknowledge intentional column removal:

```kotlin
@Storable
@DropColumn("legacyField")
data class Note(@Key val id: String, val title: String)
```
