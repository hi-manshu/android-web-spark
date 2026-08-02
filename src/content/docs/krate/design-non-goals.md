# Design non-goals

A short list of things Krate **does not** support — and why. If your use case
lives here, Krate is the wrong tool and a different library will serve you
better. Naming what you won't do is as important as naming what you will.

This list is curated, not exhaustive. New non-goals get added here when the
maintainers say "no" to a feature request that has come up enough times to
deserve a permanent answer.

---

## Storage model

### Single-process only

Krate uses Room's single-process SQLite connection model. **Two processes
opening the same database file is unsupported.** On Android this rules out
sharing a Krate database across:

- A widget process (`android:process=":widget"`)
- A sync adapter
- A `ContentProvider` in a separate process
- A Firebase Messaging service running in its own process

SQLite at the filesystem level uses advisory locks, so concurrent writes from
two processes will not corrupt data — but read/write ordering, change-event
fan-out, and the per-store `Mutex` all assume one process. Observers in process
A will not see writes from process B.

If you need cross-process state, expose Krate from a single owner process and
talk to it via Binder/IPC, or use a different storage primitive
(`SharedPreferences`, `DataStore`, a content provider) for the shared state.

### No raw `Cursor` access

Reads return domain objects or `Flow<List<T>>`, never `android.database.Cursor`.
If you need cursor-style iteration over a huge result set, use
`Store.findByPredicate(...).asFlow()` with a `.chunked(n)` operator or paging.
Krate will not expose `Cursor` because:

- It does not exist on iOS/native — the abstraction would not be KMP.
- It encourages forgotten `.close()` calls and leaked statements.
- The `KrateRow`/`Flow` API covers every legitimate use we have seen.

### No reflection-based deserialization

Mapping rows to domain objects goes through KSP-generated code, not Kotlin
reflection. This is non-negotiable because:

- KMP/Native targets (iOS, Linux) have **no Kotlin reflection** at runtime.
- KSP-generated mappers are zero-allocation; reflection-based ones are not.
- Errors are caught at compile time, not at the first row of a million-row
  query in production.

If you want reflection-based mapping for a one-off script, use
`Krate.rawQuery(sql, args) { /* mapper */ }` and map by hand.

---

## Query model

### No lazy `N+1` joins

`Store<K, T>` does not transparently follow foreign-key relationships. There
is no Krate equivalent of Room's `@Relation` annotation that quietly issues N
extra queries per row. If you want joined data, use `Krate.join`, `multiJoin`,
or a CTE-backed projection — all of which emit one SQL statement.

### No string-keyed `find { }` predicate as the primary path

`PredicateNode.Eq("isPinned", true)` is an escape hatch for migration code
and string-driven dynamic queries. **The recommended API is the typed
`Note::isPinned eq true` infix DSL** which catches column renames at compile
time. Future releases will mark the string-key constructors `@PublishedApi
internal` once the typed DSL covers every case.

### No ORM-style identity map

Two `Store.get(id)` calls return two different objects, not the same instance.
Krate is a data layer, not an ORM. Identity-map / unit-of-work semantics
belong in application code that wants them.

---

## Write model

### No optimistic-concurrency version columns by default

Krate has `onConflict` hooks and `@Storable(conflictPolicy = ...)` for
last-write-wins or app-driven merge, but it does not auto-generate a
`@Version` column with optimistic-lock semantics. If you need it, add a
`val version: Long` field to your `@Storable` and gate writes in a `beforePut`
hook.

### No automatic schema migration generation

`@RenameFrom` and `@DropColumn` declare *intent*; they do not auto-write a
migration. For breaking changes you implement `KrateMigration(from = N, to = M)`
explicitly. Auto-migration synthesis (Room's `@AutoMigration` style) is a
non-goal — we believe migrations should be reviewed code, not generated SQL.

---

## Platform & target coverage

### No JS/Wasm targets

The `@Storable` processor + Room runtime depend on JVM/Native SQLite drivers.
JS/Wasm has no comparable SQLite story today; Krate does not target them.
When the platform story stabilises this stance may revisit.

### No Java interop guarantees

Krate's public API is Kotlin-only. Methods are exposed to Java where the
Kotlin compiler does so by default, but coroutines, extension functions,
inline reified generics, and the DSLs are not designed to be called from
Java. Use [kotlinx.coroutines `runBlocking` interop](https://kotlinlang.org/docs/coroutines-and-channels.html)
if you must.

---

## Operations

### No cross-process / cross-device sync

There is no `SyncAdapter` abstraction, no built-in CRDT, no server-push
endpoint. Krate is local persistence. Layer your own sync logic on top of
`Store.changes()` (granular write events) or `Store.asFlow()` (snapshots).
A future companion library may address this; the core does not.

### Disk failures are SQLite's problem

If `fsync` fails, the disk is full, or the file is corrupt, Krate surfaces
SQLite's error verbatim and does not attempt recovery. Krate trusts the
filesystem to do its job. If you need Byzantine-fault tolerance, use a
managed cloud database, not a single SQLite file.

---

## What about feature X?

If your feature isn't on this list and isn't in the public roadmap, open a
discussion. The honest answer to "will you add this?" is usually one of:

- "Yes, on the roadmap" (`ROADMAP.md`)
- "No, by design" (this file)
- "Maybe, write a use case in the GitHub Discussions"
