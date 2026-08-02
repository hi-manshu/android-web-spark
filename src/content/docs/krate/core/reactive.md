# Reactive Flows

All reactive operations return `Flow` that never completes. Collect them in a coroutine scope tied to your UI lifecycle.

## Full store observation

```kotlin
notes.asFlow()  // Flow<List<Note>> — re-emits the full list on any change
```

```kotlin
viewModelScope.launch {
    notes.asFlow().collect { list -> _state.value = list }
}
```

## Single item observation

```kotlin
notes.observe("id")  // Flow<Note?> — re-emits when that item changes; null after deletion
```

```kotlin
viewModelScope.launch {
    notes.observe("note-1").collect { note ->
        if (note != null) showDetail(note) else showDeleted()
    }
}
```

## Reactive count

```kotlin
// Total count
notes.observeCount().collect { n -> badge.text = "$n" }

// Filtered count
notes.observeCount(Note::isPinned eq true).collect { n ->
    pinnedBadge.text = "$n"
}
```

## Store change events

`changes()` is a hot `SharedFlow` that emits one event per successful write:

```kotlin
notes.changes().collect { change ->
    when (change) {
        is StoreChange.Inserted -> showSnackbar("Added: ${change.item.title}")
        is StoreChange.Updated  -> showSnackbar("Edited: ${change.new.title}")
        is StoreChange.Deleted  -> showSnackbar("Deleted")
    }
}
```

### Real-world example: sync indicator

```kotlin
notes.changes().collect { change ->
    when (change) {
        is StoreChange.Inserted -> syncQueue.enqueue(change.item)
        is StoreChange.Updated  -> syncQueue.enqueue(change.new)
        is StoreChange.Deleted  -> syncQueue.markDeleted(change.item)
    }
}
```

## Diff — what changed between emissions

```kotlin
notes.diff().collect { diff ->
    diff.inserted.forEach { addToUi(it) }
    diff.deleted.forEach  { removeFromUi(it) }
    diff.updated.forEach  { (old, new) -> updateInUi(old, new) }
}
```

Diffs with nothing changed are automatically filtered out.
