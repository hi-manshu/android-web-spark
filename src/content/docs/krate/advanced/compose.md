# Compose Integration

The `krate-compose` module provides Jetpack Compose helpers for collecting `Store` flows with lifecycle awareness.

## Add the Dependency

```kotlin
dependencies {
    implementation(platform("com.himanshoe.krate:krate-bom:0.1.0"))
    implementation("com.himanshoe.krate:krate-compose")
}
```

---

## Collecting Store Flows in Compose

`krate-compose` exports `collectAsStateWithLifecycle` extensions tuned for Krate's `Flow<List<T>>` and `Flow<T?>` return types.

### Observe all items

```kotlin
@Composable
fun NoteList(notes: Store<String, Note>) {
    val items by notes.asFlow().collectAsStateWithLifecycle(emptyList())

    LazyColumn {
        items(items) { note -> NoteRow(note) }
    }
}
```

### Observe a single item

```kotlin
@Composable
fun NoteDetail(notes: Store<String, Note>, noteId: String) {
    val note by notes.observe(noteId).collectAsStateWithLifecycle(null)

    note?.let {
        Text(it.title)
        Text(it.body)
    } ?: CircularProgressIndicator()
}
```

### Observe a filtered query

```kotlin
@Composable
fun PinnedNotes(notes: Store<String, Note>) {
    val pinned by notes
        .findByPredicate(PredicateNode.Eq(Note::isPinned, true))
        .asFlow()
        .collectAsStateWithLifecycle(emptyList())

    LazyColumn {
        items(pinned) { NoteRow(it) }
    }
}
```

---

## Write Operations in Compose

Writes are `suspend` — call them from `rememberCoroutineScope` or your ViewModel.

```kotlin
@Composable
fun AddNoteButton(notes: Store<String, Note>) {
    val scope = rememberCoroutineScope()

    Button(onClick = {
        scope.launch {
            notes.add(Note(id = UUID.randomUUID().toString(), title = "New Note", body = ""))
        }
    }) {
        Text("Add Note")
    }
}
```

---

## ViewModel pattern (recommended)

Drive Krate from a `ViewModel` and expose `StateFlow` to composables:

```kotlin
class NotesViewModel(private val notes: Store<String, Note>) : ViewModel() {

    val all: StateFlow<List<Note>> = notes
        .asFlow()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    fun add(note: Note) = viewModelScope.launch { notes.add(note) }
    fun pin(id: String)  = viewModelScope.launch { notes.update(id) { copy(isPinned = true) } }
    fun delete(id: String) = viewModelScope.launch { notes.delete(id) }
}

@Composable
fun NotesScreen(vm: NotesViewModel = viewModel()) {
    val notes by vm.all.collectAsStateWithLifecycle()

    LazyColumn {
        items(notes) { note ->
            NoteRow(
                note = note,
                onPin = { vm.pin(note.id) },
                onDelete = { vm.delete(note.id) }
            )
        }
    }
}
```

---

## Notes

- Always collect inside a lifecycle-scoped coroutine to avoid leaks.
- Use `WhileSubscribed(5_000)` in `stateIn` to survive configuration changes without leaking the database connection.
- `krate-compose` is architecture-agnostic — use it with ViewModel, plain state, or any other pattern.
