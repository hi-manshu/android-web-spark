# Full-Text Search

Krate supports two styles of text search, layered. Use whichever matches the
size of your dataset and the strictness of your matching.

## Substring search — `LIKE`

For small-to-medium datasets, `Store.search` runs a case-insensitive substring
match across the columns you specify (or every `String` column on the entity
when you omit the column list). No setup required.

```kotlin
// Across every String column on Note, discovered at compile time.
notes.search("kotlin").toList()

// Restricted to specific columns.
notes.search("kotlin", Note::title, Note::summary).toList()

// Chain with sorting + paging.
notes.search("meeting", Note::title)
    .sortedByDescending(Note::createdAt)
    .take(10)
    .asFlow()
```

Each property becomes a `ContainsString` clause; multiple columns are combined
with `OR`. Backed by SQLite `LIKE`, so performance degrades linearly with row
count — switch to FTS5 when you outgrow it.

## FTS5 — `@FullTextSearch` + `@FtsIndexed`

For production full-text search over large tables, mark the `@Storable` class
with `@FullTextSearch` and the indexed `String` properties with `@FtsIndexed`:

```kotlin
@Storable
@FullTextSearch
data class Note(
    @Key val id: String,
    @FtsIndexed val title: String,
    @FtsIndexed val body: String?,
    val isPinned: Boolean = false,   // not indexed
)
```

At build time the KSP processor:

- Creates the FTS5 virtual table `note_fts(title, body, content='note', content_rowid='rowid')`.
- Wires three sync triggers (`note_fts_ai`, `note_fts_au`, `note_fts_ad`) so
  every `INSERT`, `UPDATE`, and `DELETE` on `note` is mirrored into the index
  inside the same transaction.
- Registers metadata with `FtsRegistry` so `Store.ftsSearch` dispatches to the
  virtual table instead of falling back to `LIKE`.

At query time:

```kotlin
// MATCH query, ranked by FTS5's bm25.
notes.ftsSearch("kotlin coroutines").toList()

// Chain like any other query result.
notes.ftsSearch("meeting AND minutes")
    .sortedByRelevance()
    .take(20)
    .asFlow()
```

`ftsSearch` returns an `FtsSearchResult` with `sortedByRelevance()`, `take()`,
`drop()`, and `count()`. The string you pass is a raw FTS5 query — see
[SQLite's FTS5 query syntax](https://www.sqlite.org/fts5.html#full_text_query_syntax)
for the supported operators (`AND`, `OR`, `NOT`, prefix `*`, phrase `"..."`,
column filters, near/distance).

### Rules the processor enforces

- A class annotated `@FullTextSearch` with **no** `@FtsIndexed` properties is
  rejected at compile time. There's nothing to index — almost always a mistake.
- `@FtsIndexed` is only valid on `String` and `String?` properties. FTS5 doesn't
  index numbers or blobs; the processor reports an error pointing at the
  offending property rather than emitting broken DDL.

### In-memory tests

`inMemoryKrate { }` doesn't have an FTS5 engine. `ftsSearch` transparently
falls back to a `LIKE`-based substring match across the same columns, with a
one-shot diagnostic logged through `KrateLog` so the swap is visible in test
output. Production semantics differ from in-memory semantics (BM25 ranking,
prefix matching, NEAR, etc. don't apply to the fallback) — keep your asserts
to "did the right row come back" rather than ranking.

### Migrating from the 0.x array form

Before 1.0 the columns lived on the class annotation:

```kotlin
@Storable
@FullTextSearch(columns = ["title", "body"])   // 0.x
data class Note(...)
```

That form no longer compiles. Replace with the per-property annotation shown
above. The migration is mechanical — same columns, same generated DDL, just
moved from a string array on the class to typed annotations on the properties.
