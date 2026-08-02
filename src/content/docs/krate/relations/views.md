# Store Views

Store views resolve FK relationships in Kotlin without SQL JOINs.

## One-to-one: including()

```kotlin
val view = noteStore.including(userStore, on = Note::authorId)
val rows = view.toList()

rows.forEach { row ->
    val note = row.primary()            // Note
    val author = row.related<User>()    // User?
    println("${note.title} by ${author?.name}")
}
```

### Reactive view

```kotlin
noteStore.including(userStore, on = Note::authorId)
    .asFlow()
    .collect { rows -> renderList(rows) }
```

### Filtered view

```kotlin
noteStore.including(userStore, on = Note::authorId)
    .filter(Note::isPinned eq true)
    .asFlow()
```

### Mapped view

```kotlin
val mapped = noteStore.including(userStore, on = Note::authorId) { note, user ->
    NoteWithAuthor(note.title, user?.name ?: "Unknown")
}
```

## One-to-many: includingMany()

```kotlin
val view = noteStore.includingMany(commentStore, Comment::noteId, Note::id)
val rows = view.toList()

rows.forEach { row ->
    val note = row.primary()                    // Note
    val comments = row.relatedList<Comment>()   // List<Comment>
    println("${note.title}: ${comments.size} comments")
}
```

### As a typed map

```kotlin
val childrenByParent: Map<Note, List<Comment>> = noteStore
    .includingMany(commentStore, Comment::noteId, Note::id)
    .toTypedMap<Note, Comment>()
```

## Self-joins

Both `including()` and `includingMany()` work with the same store for tree structures:

```kotlin
// Parent lookup
val view = nodeStore.including(nodeStore, on = TreeNode::parentId)

// Children lookup
val childrenView = nodeStore.includingMany(nodeStore, TreeNode::parentId, TreeNode::id)
```

## Relation loading helpers

For simpler one-off lookups without views:

```kotlin
// Single item
val (label, note) = label.loadRelation(noteStore, Label::noteId) ?: return

// List
val pairs: List<Pair<Label, Note?>> = labels.withRelation(noteStore, Label::noteId)

// Reactive
labelStore.asFlow()
    .map { list -> list.withRelation(noteStore, Label::noteId) }
    .stateIn(scope, SharingStarted.WhileSubscribed(5_000), emptyList())
```
