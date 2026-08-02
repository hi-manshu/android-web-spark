# Migration integration testing

Migrations are the highest-risk code in a persistence library — a bug here
loses user data across an app upgrade. Krate covers them at three levels:

| Level | Test | What it proves |
|---|---|---|
| Unit | `MigrationChainValidatorTest`, `KrateMigrationDslTest` | Chain validation + each DSL helper in isolation. |
| Primitive | `MigrationScopeImplTest` | Every `MigrationScope` primitive against a live `BundledSQLiteDriver` connection. |
| Integration | `MigrationV1ToV5IntegrationTest` | Four `KrateMigration` subclasses composed end-to-end against live SQLite, with data preservation asserted at the final version. |

## The v1→v5 round-trip pattern

The integration test composes four migrations sequentially through
`MigrationScopeImpl` — exactly the path Room walks when opening a stale
database — and verifies the resulting schema + data:

```kotlin
@Test
fun `v1 to v5 chain preserves all original data and applies every transform`() = runTest {
    val migrations = listOf(
        V1ToV2_AddSummary(),
        V2ToV3_RenameAuthorToCreatedBy(),
        V3ToV4_PopulateTagTable(),
        V4ToV5_DropBodyAfterDigest(),
    )

    for (migration in migrations) {
        val scope = MigrationScopeImpl(connection)
        with(migration) {
            with(scope) { migrate() }
        }
    }

    // Then assert: original rows still there, every added/renamed column
    // populated correctly, every dropped column absent, every materialised
    // side table populated as expected.
}
```

The chain intentionally exercises every operation a real migration is likely
to perform:

- **v1 → v2 — add column with backfill.** `execute("ALTER TABLE ... ADD COLUMN ... DEFAULT ...")`
- **v2 → v3 — rename column.** `renameColumn(table, from, to)`
- **v3 → v4 — materialise side table.** `createTable` + `forEach` + `execute` with bound args
- **v4 → v5 — derive value then drop source.** `forEach` to compute, then `dropColumn` — the highest-risk step because if the per-row writes fail before the drop, the source data is gone

## Why these are JVM tests

The integration tests live under `krate-runtime/src/jvmTest/` because they
need to dlopen the bundled SQLite native library, and Android unit tests run
on a host JVM that cannot load the `.so` / `.dylib` files packaged for the
device. The JVM target added in 1.0 gives this test a host where the native
libs actually load — run them with:

```bash
./gradlew :krate-runtime:jvmTest
```

The same source tree also enables JVM consumers (desktop, server) of Krate at
runtime — the test infrastructure is a side effect of a real product feature,
not test-only scaffolding.

## Writing your own migration integration test

For an app-specific chain, copy `MigrationV1ToV5IntegrationTest` and:

1. Replace the v1 schema in `createV1Schema` with your app's v1 `CREATE TABLE`
   statements (one per table).
2. Seed two or three rows of representative data in `seedV1Data`. Two is
   enough to catch most off-by-one errors; more is rarely worth the test-read
   complexity.
3. Replace the four `KrateMigration` subclasses with your real migrations,
   in `from`-order. Keep them as private nested classes so the test file is
   self-contained.
4. Replace the read helpers (`readNotes`, `readTags`, `columnNames`) with
   selects against your tables.
5. Run before every release. Migrations that worked yesterday can break
   tomorrow when a coworker reorders the chain or merges two migrations.
