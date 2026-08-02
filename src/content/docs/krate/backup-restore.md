# Backup and restore

Krate ships two methods on `Krate` for whole-database snapshots:

```kotlin
suspend fun backup(destinationPath: String)
suspend fun restore(sourcePath: String)
```

Both operate one level below hooks, validators, and the audit trail — they
work directly on the SQLite file. Per-store JSON/CSV dumps (`krate-export`)
remain the right tool for analytics exports; backup/restore is for whole-DB
snapshots and replacements.

## Why this exists

`krate-export` handles per-store CSV/JSON. That's fine for analytics dumps or
migrating one collection between databases. It is not enough for these real
production needs:

- **Google Drive auto-backup interop.** Android's Auto Backup framework copies
  `/data/data/<pkg>/databases/*.db` files. A consistent snapshot is what makes
  the on-disk state safe to copy mid-write.
- **B2B data portability.** GDPR / HIPAA / SOC2 contracts often require
  "export everything this user has, atomically." Per-store dumps miss
  inter-store FK dependencies that only an entire-DB snapshot captures.
- **App-data migration between devices.** "Move my data to a new phone" needs
  one file the user can hand off, not 14 JSON files plus a `MANIFEST.json`
  describing how to reassemble them.
- **Pre-migration safety net.** Before applying a risky `KrateMigration`,
  snapshot the DB to disk so a rollback is a file move.

## `backup(destinationPath)`

Writes a transactionally-consistent snapshot of the entire database to
`destinationPath` using SQLite's `VACUUM INTO`.

```kotlin
krate.backup("/data/data/com.example/files/backup.db")
```

Properties of the produced file:

- **Atomic.** Takes a shared lock for the duration. Concurrent reads continue;
  concurrent writes block briefly. The output cannot be mid-write torn.
- **Defragmented.** `VACUUM INTO` rewrites the database, producing an output
  file typically smaller than the live DB and with no companion WAL/SHM files.
- **Self-contained.** A single `.db` file. Safe to ship through any byte-pipe
  (`ContentResolver`, `OkHttp`, `FileProvider`).

Throws `IllegalArgumentException` if `destinationPath` is blank, and surfaces
the original SQLite error on disk-full, permission-denied, or
parent-directory-missing failures. The destination path is escaped (SQL-92
single-quote doubling) so embedded quotes can't be used to inject SQL — the
path is still a filesystem path under the caller's control, but the escape
is hardened defence-in-depth.

`InMemoryKrate.backup` throws with an explicit "no on-disk file" message —
nothing to snapshot.

## `restore(sourcePath)`

Replaces the contents of the live database with the file at `sourcePath`.

```kotlin
krate.restore("/data/data/com.example/files/backup.db")

// The Krate handle is now closed. Rebuild before continuing.
val freshDb = krate("notes") { store<String, Note>() }
```

Sequence:

1. Closes the live database so the OS releases the file handle.
2. Copies `sourcePath` over the live database file via the platform-specific
   `copyFileOverwriting` primitive (`java.nio.Files.copy` on JVM / Android,
   `NSFileManager.copyItemAtPath` on iOS).
3. Returns.

After `restore` returns, **every `Store` reference obtained from this `Krate`
is invalid**. Callers must rebuild via `krate(...)`. Active `Flow` collectors
are *not* cancelled automatically — cancel your own collector scopes before
invoking `restore` to avoid `IllegalStateException` from collectors touching
the closed database.

Throws `IllegalArgumentException` if `sourcePath` is blank, and
`IllegalStateException` if the underlying database has no file path (in-memory
or memory-mapped — there's nothing on disk to overwrite).

### Database file path

`restore` needs to know the live database's file path so it can overwrite it.
The path is captured at construction time and threaded through
`KrateRoomBuilder(roomDb, location)` as a `DatabaseLocation` sentinel:

- `DatabaseLocation.OnDisk(absolutePath)` — the normal case. Used by the
  KSP-generated `krate(...)` entry point, which knows the path because it
  computed it before calling `Room.databaseBuilder(...)`. There is nothing
  for normal consumers to wire.
- `DatabaseLocation.InMemory` — for `krateBridge(...)` and other bridges that
  don't own a file. `restore()` then throws an explicit error rather than
  silently corrupting state.

The sentinel is required (no implicit default), so a misconfigured construction
fails at the call site instead of later inside `restore()`.

## Test plan

The shipped behaviour is covered by:

- `BackupRestoreTest` in `krate-runtime/src/commonTest` — round-trip with a
  real entity, including the data-survives-restore assertion.
- `InMemoryKrate.backup` rejection — verified by the in-memory module's tests.
- The platform-specific `copyFileOverwriting` actuals each have their own
  unit tests in `androidMain`, `iosMain`, and `jvmMain` test source sets.

## What this enables on Android specifically

- Wire `android:fullBackupContent` to include the backup file Krate writes
  during `Application.onTrimMemory(TRIM_MEMORY_RUNNING_LOW)` or a `WorkManager`
  periodic job — the produced file is self-consistent without an Application
  restore receiver.
- Restore-from-backup flow in onboarding: an Activity reads
  `Intent.ACTION_VIEW` of a `.krate-backup` MIME type, hands the URI to
  `Krate.restore(...)` after copying through `ContentResolver` to a local
  path.
- Integration with **Auto Backup**: the OS-copied file is already a
  consistent snapshot — restore just hands the path back to `restore()`.

## What about streaming?

A `Krate.backupStream(): Flow<ByteArray>` API was considered for network
destinations. We don't ship it because:

- SQLite's snapshot APIs operate on file descriptors, not streams. Bridging
  one to the other means a temp file anyway — pipe `backup(tmp)` into your
  stream consumer.
- Backup files are tens of MB to a few GB. The Flow ceremony adds no value
  over `tmpFile.inputStream().use { it.copyTo(target) }`.

File an issue if your use case is materially harmed by the temp-file
indirection.
