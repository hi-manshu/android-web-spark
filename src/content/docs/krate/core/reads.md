# Read Operations

All read operations are `suspend` functions.

## Single item

```kotlin
val note: Note? = notes["id"]            // null if missing
val note: Note  = notes.getValue("id")   // throws NoSuchElementException if missing
```

## All items

```kotlin
val all: List<Note> = notes.getAll()
```

## Batch fetch by IDs

Fetches matching items in a **single query** — always prefer this over calling `get` in a loop:

```kotlin
val some: Map<String, Note> = notes.getAllByIds(listOf("id1", "id2"))
// Keys with no matching item are absent from the map
```

## Count

```kotlin
val n: Int = notes.count()
```

## Existence checks

```kotlin
if (notes.exists("n1")) { /* key present */ }
if (notes.exists(Note::status eq "PENDING")) showPendingBanner()
if (notes.isEmpty())     showEmptyState()
if (notes.isNotEmpty())  loadList()
```

## Min / max items

```kotlin
val oldest:  Note? = notes.minBy(Note::createdAt)
val longest: Note? = notes.maxBy(Note::wordCount)
```

## Top / bottom N

```kotlin
val top5:    List<Note> = notes.topN(5, Note::wordCount)
val oldest5: List<Note> = notes.bottomN(5, Note::createdAt)
```

## Partitioning and mapping

```kotlin
// Split into two lists
val (pinned, unpinned) = notes.partition { it.isPinned }

// Project to Map
val byId: Map<String, Note> = notes.associate { it.id to it }

// Group by a property (null values excluded)
val byAuthor: Map<String, List<Note>> = notes.groupBy(Note::authorId)
```

## Lookup and indexing

```kotlin
// All distinct non-null values of a property
val authors: List<String> = notes.distinctValuesOf(Note::authorId)

// Count occurrences per distinct value
val countByStatus: Map<String, Int> = orders.frequency(Order::status)

// Map from property value to item (last wins on collision)
val noteBySlug: Map<String, Note> = notes.indexBy(Note::slug)
```

## Quick numeric aggregates

Convenience shortcuts that avoid the full aggregate builder:

```kotlin
val totalWords: Double  = notes.sumOf(Note::wordCount)
val avgScore:   Double? = notes.averageOf(Note::score)  // null if empty
```

## Paging

```kotlin
// In-memory paging
val pages: List<List<Note>> = notes.chunked(20)

// SQL-level paging (avoids loading all items)
notes.findAll().chunked(20).forEachIndexed { i, page -> renderPage(i, page) }
```
