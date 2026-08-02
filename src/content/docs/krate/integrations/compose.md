# Compose Integration

The `krate-compose` module provides Compose Multiplatform extensions.

## rememberStore

Retrieve and memoize a store in a composable:

```kotlin
@Composable
fun NoteList(db: Krate) {
    val noteStore = rememberStore<String, Note>(db)
    // ...
}
```

## collectAsState — full store

```kotlin
@Composable
fun NoteList(store: Store<String, Note>) {
    val notes by store.collectAsState()
    LazyColumn {
        items(notes) { note -> NoteCard(note) }
    }
}
```

## collectAsState — single item

```kotlin
@Composable
fun NoteDetail(store: Store<String, Note>, id: String) {
    val note by store.collectAsState(id)
    if (note != null) {
        Text(note!!.title)
    } else {
        Text("Not found")
    }
}
```

## collectQueryAsState

```kotlin
@Composable
fun PinnedNotes(store: Store<String, Note>) {
    val pinned by store.collectQueryAsState(
        store.findByPredicate(Note::isPinned eq true)
            .sortedByDescending(Note::createdAt)
    )
    LazyColumn {
        items(pinned) { note -> NoteCard(note) }
    }
}
```

## changesAsState

Track individual store changes:

```kotlin
@Composable
fun ChangeIndicator(store: Store<String, Note>) {
    val lastChange by store.changesAsState()
    when (lastChange) {
        is StoreChange.Inserted -> Text("Added!")
        is StoreChange.Updated  -> Text("Edited!")
        is StoreChange.Deleted  -> Text("Deleted!")
        null -> {}
    }
}
```

## diffAsState

For list animations:

```kotlin
@Composable
fun AnimatedNoteList(store: Store<String, Note>) {
    val diff by store.diffAsState()
    // Use diff.inserted, diff.deleted, diff.updated for animations
}
```

## CompositionLocal

Provide Krate through the composition tree:

```kotlin
@Composable
fun App() {
    ProvideKrate(db) {
        val krate = LocalKrate.current
        val noteStore = rememberStore<String, Note>(krate)
        NoteList(noteStore)
    }
}
```

## Preview support

```kotlin
@Preview
@Composable
fun NoteListPreview() {
    KratePreview {
        store<String, Note>({ it.id })
    } preview { db ->
        NoteList(db.store(Note::class))
    }
}
```
