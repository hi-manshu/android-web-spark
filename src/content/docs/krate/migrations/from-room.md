# Migrating from Room

Krate can take over an existing Room database file **in place** — no data copy,
no export/import, and a full safety backup before anything is touched. The
automatic path is one line in the builder: `migrateFromRoom()`.

## Before you start: compatibility check

Krate must be able to model each entity you migrate. Check every Room entity
against this list first:

| Room feature | Krate support | What to do |
|---|---|---|
| Single `String`/`Int`/`Long` primary key | ✅ `@Key` | Direct mapping |
| `@Entity(tableName = ...)` | ✅ `@Storable(tableName = ...)` | Pass the same name |
| `@ColumnInfo(name = ...)` | ✅ `@KrateName(...)` | Pass the same name |
| TypeConverters for `List`/`Set`/embeddables | ✅ generated | Verify on-disk format matches (Krate stores JSON) |
| `@ForeignKey` | ✅ `@References` | Direct mapping |
| Indices | ✅ `@Index` | Redeclare on the class |
| Composite primary keys (`primaryKeys = [...]`) | ❌ | Blocked — keep that entity on Room for now |
| `@PrimaryKey(autoGenerate = true)` | ❌ | Blocked — or switch to app-generated ids first |
| `@Embedded` (flattened columns) | ⚠️ different shape | Reshape via a `KrateMigration` (example below) |
| `@Relation` | ⚠️ no direct equivalent | Use Krate joins / `lazyRelation` at the call site |

If any entity is blocked, migrate the rest and keep that table Room-managed
until support lands.

## Bulk conversion: `krate-room-converter`

Hand-converting entities one-by-one doesn't scale to large apps. The converter
tool reads Room's exported schema JSON (`schemas/*.json` — present in any app
with `room { schemaDirectory(...) }` configured) and generates everything:

```bash
./gradlew :krate-room-converter:run \
    --args="/path/to/your-app/schemas /path/to/output com.your.app.db"
```

Output:

- **One `@Storable` data class per convertible entity** — `tableName`,
  `@Key` (typed from the PK column affinity), `@KrateName` for every column
  whose name differs from the property, `@Index` with property names,
  `@References` with cascade mapping, correct nullability.
- **`KrateSetup.kt`** — a ready-to-adapt `krate { }` builder listing every
  `store<K, T>()` with `migrateFromRoom()` pre-wired and `version` matching
  your schema export.
- **`MIGRATION-REPORT.md`** — the triage report: which entities converted
  cleanly, which are **blocked** (composite PK, `autoGenerate`, `@Embedded`,
  BLOB columns) with a documented next step for each, and every reviewable
  decision the generator made (e.g. `INTEGER` columns named `is*`/`has*`
  mapped to `Boolean` by heuristic).

A 100-table app becomes: run the tool, review the report, fix the flagged
items, paste the generated sources, ship. The mechanical 95% is automated;
your attention goes only where the report points it.

## The automatic path: `migrateFromRoom()`

### 1. Mirror the Room schema

```kotlin
// Before (Room)
@Entity(tableName = "notes")
data class Note(
    @PrimaryKey val id: String,
    @ColumnInfo(name = "note_title") val title: String,
)

// After (Krate) — same physical table, same column names
@Storable(tableName = "notes")
data class Note(
    @Key val id: String,
    @KrateName("note_title") val title: String,
)
```

### 2. Open with adoption enabled

```kotlin
// Your Room database was at version 5.
val db = krate(context, "my_app", version = 5) {
    store<String, Note>()
    migrateFromRoom()
}
```

`name` must resolve to the **same file** your Room build used (Room's
`databaseBuilder(context, ..., "my_app")` and Krate's `krate(context, "my_app")`
both use `context.getDatabasePath`). `version` must be **≥** the Room database's
current version.

### 3. What happens on first launch — automatically

1. **Detection** — Krate sees a Room-created file (has `room_master_table`,
   no Krate adoption marker).
2. **Pre-flight checks, before anything is modified**:
   - declared `version` ≥ on-disk `PRAGMA user_version` (else: clear error
     telling you which version to declare);
   - every registered `@Storable` table exists in the file (else: clear error
     naming the missing tables and pointing at `@Storable(tableName = ...)`).
3. **Full safety backup** — `VACUUM INTO` a sibling
   `my_app.room-backup-<timestamp>.db` file. This is your rollback: restoring
   that file restores the exact pre-migration state.
4. **Identity-hash handover** — Room's schema hash is removed, which puts the
   file on Room's *pre-packaged database* path: on open, Room runs its **strict
   byte-exact schema validation** against Krate's generated schema. A match
   adopts the database and writes a fresh hash. A mismatch fails the open with
   Room's precise `Expected: TableInfo{...} / Found: TableInfo{...}` diff —
   your data and the backup are untouched.
5. **Marker write** — after the first successful open, a `krate_adoption`
   marker table records the takeover. Every later launch short-circuits at
   step 1. `migrateFromRoom()` is safe to leave in the builder permanently.

### 4. Reshaping during adoption

When the Room shape and the Krate shape differ (most commonly Room `@Embedded`
flattened columns vs Krate's JSON `@Embeddable`), bump the version by one and
register a migration — it runs inside the same first open, after the handover
and before validation:

```kotlin
val db = krate(context, "my_app", version = 6) {   // Room was at 5
    store<String, User>()
    migrateFromRoom()
    migration(FlattenedAddressToJson())
}

class FlattenedAddressToJson : KrateMigration(from = 5, to = 6) {
    override suspend fun MigrationScope.migrate() {
        execute("ALTER TABLE user ADD COLUMN address TEXT NOT NULL DEFAULT '{}'")
        forEach("user") { row ->
            val json = buildString {
                append("{\"street\":\"").append(row.getString("addr_street"))
                append("\",\"city\":\"").append(row.getString("addr_city")).append("\"}")
            }
            execute("UPDATE user SET address = ? WHERE id = ?", json, row.getString("id"))
        }
        dropColumn("user", "addr_street")
        dropColumn("user", "addr_city")
    }
}
```

### 5. Replace DAOs with Store

```kotlin
// Before (Room)
@Dao
interface NoteDao {
    @Query("SELECT * FROM notes") fun getAll(): Flow<List<Note>>
    @Insert(onConflict = REPLACE) suspend fun insert(note: Note)
    @Delete suspend fun delete(note: Note)
}

// After (Krate)
val notes: Store<String, Note> = db.store()
notes.getAll()
notes.asFlow()
notes += note
notes -= note.id
```

| Room | Krate |
|---|---|
| `@Query("SELECT * FROM notes WHERE isPinned = 1")` | `notes.findByPredicate(Note::isPinned eq true).toList()` |
| `@Query("SELECT COUNT(*) FROM notes")` | `notes.count()` |
| `@Query("... WHERE title LIKE '%' \|\| :q \|\| '%'")` | `notes.search(q, Note::title).toList()` |

### 6. Ship, then clean up

Remove the Room entity/DAO/`@Database` code and Room compiler wiring once the
release is stable. Keep the `.room-backup-*.db` files for a release cycle;
delete them in a later version once the rollout is proven.

## Testing the migration before shipping

**This is not optional for production apps.** Copy a real database file from a
device running the Room build (`adb pull` or Device File Explorer), drop it into
an instrumented test's files dir under the database name, and assert:

```kotlin
val db = krate(context, "my_app", version = 5) {
    store<String, Note>()
    migrateFromRoom()
}
val notes = db.store<String, Note>()
assertEquals(expectedRowCount, notes.count())     // no rows lost
assertEquals(expectedFirstNote, notes.get("n1"))  // values map correctly
```

If Krate's generated schema doesn't match, the open fails with Room's per-column
diff — fix the `@Storable`/`@KrateName` declarations (or add a reshaping
migration) and re-run until green. Iterate here, on a copy, never on users.

## Fallback: copy migration

When in-place adoption doesn't fit (blocked entities, or you want the old file
untouched as a natural rollback), keep both stacks for one release and copy:

```kotlin
suspend fun copyFromRoom(context: Context) {
    if (prefs.getBoolean("migrated_to_krate", false)) return
    val roomDb = Room.databaseBuilder(context, OldDb::class.java, "my_app_room").build()
    val krateDb = krate(context, "my_app_krate") { store<String, Note>() }
    val notes = krateDb.store<String, Note>()
    notes.addAll(roomDb.noteDao().getAll().map { it.toKrateNote() })
    check(notes.count() == roomDb.noteDao().count()) { "Row count mismatch — aborting" }
    roomDb.close()
    prefs.edit().putBoolean("migrated_to_krate", true).apply()
}
```

## Warnings

- **Never** combine `migrateFromRoom()` with `fallbackToDestructiveMigration()`
  in a release build — the destructive fallback converts any schema mismatch
  into total data loss instead of a safe failure.
- `krateBridge(roomDb)` (side-by-side coexistence on one connection) is
  **not production-ready** in this release — store registration through the
  bridge is incomplete. Use in-place adoption or copy migration instead.
