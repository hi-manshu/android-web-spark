# Export & Import

The `krate-export` module provides JSON and CSV export/import.

## JSON export

```kotlin
// With explicit serializer
val json: String = noteStore.exportJson(Note.serializer())

// Reified (inferred serializer)
val json: String = noteStore.exportJson<Note>()

// From a filtered query
val json: String = noteStore
    .findByPredicate(Note::isPinned eq true)
    .exportJson(Note.serializer())
```

### Custom Json configuration

```kotlin
val json = noteStore.exportJson(Note.serializer()) {
    prettyPrint = true
    encodeDefaults = true
}
```

## JSON import

```kotlin
noteStore.importJson(jsonString, Note.serializer())
```

## CSV export

```kotlin
val csv: String = noteStore.exportCsv(
    columns = listOf("id", "title", "isPinned", "score"),
)
```

### Custom options

```kotlin
val csv = noteStore.exportCsv(
    columns = listOf("id", "title"),
    delimiter = '\t',        // tab-separated
    nullValue = "N/A",       // represent nulls
)
```

## CSV import

```kotlin
noteStore.importCsv(csvString) { row ->
    Note(
        id = row["id"]!!,
        title = row["title"]!!,
        isPinned = row["isPinned"]?.toBooleanStrict() ?: false,
    )
}
```

### Custom delimiter

```kotlin
noteStore.importCsv(tsvString, delimiter = '\t') { row ->
    Note(id = row["id"]!!, title = row["title"]!!)
}
```

CSV export/import follows RFC 4180 (proper quoting, escaping, newlines in fields).
