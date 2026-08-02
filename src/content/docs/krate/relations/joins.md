# SQL Joins

For complex multi-table queries, Krate provides SQL-level JOINs. Use these when you need filtering, sorting, or aggregation across tables.

## Two-table join

```kotlin
val rows = db.join<Note, User>()
    .on(Note::authorId, User::id)
    .where(Note::isPinned eq true)
    .select { note, user -> "${note.title} by ${user.name}" }
    .toList()
```

### Join types

```kotlin
db.join<Note, User>().on(Note::authorId, User::id)           // INNER JOIN (default)
db.join<Note, User>().leftJoin(Note::authorId, User::id)     // LEFT JOIN
db.join<Note, User>().crossJoin()                              // CROSS JOIN
```

### Row access

```kotlin
db.join<Note, User>().on(Note::authorId, User::id)
    .select { note, user ->
        NoteWithAuthor(note.title, user.name)
    }
```

### Reactive join

```kotlin
db.join<Note, User>()
    .on(Note::authorId, User::id)
    .asFlow { note, user -> NoteWithAuthor(note, user) }
    .collect { list -> render(list) }
```

## N-table join

```kotlin
val rows = db.multiJoin<Note>()
    .join<User>(Note::authorId, User::id)
    .join<Label>(Note::id, Label::noteId)
    .where(Note::isPinned eq true)
    .select { row ->
        val note = row.from<Note>()
        val user = row.with<User>()
        val label = row.with<Label>()
        Triple(note, user, label)
    }
    .toList()
```

## GROUP BY and HAVING

```kotlin
db.join<Note, User>()
    .on(Note::authorId, User::id)
    .groupBy(User::name)
    .having("COUNT(*) > ?", listOf(5))
    .select { note, user -> user.name }
```

## Window functions

```kotlin
db.multiJoin<Note>()
    .join<User>(Note::authorId, User::id)
    .window("ROW_NUMBER() OVER (PARTITION BY authorId ORDER BY createdAt DESC) AS rn")
    .where("rn = 1")
    .select { row -> row.from<Note>() }
```

## CTEs

```kotlin
db.multiJoin<Note>()
    .withCte("recent", "SELECT * FROM notes WHERE createdAt > ?", listOf(lastWeek))
    .joinCte("recent", "id", Note::id)
    .select { row -> row.from<Note>() }
```

## Recursive CTEs

```kotlin
db.multiJoin<TreeNode>()
    .withRecursiveCte(
        name = "ancestors",
        base = "SELECT * FROM tree_nodes WHERE id = ?",
        baseArgs = listOf(nodeId),
        recursive = "SELECT t.* FROM tree_nodes t JOIN ancestors a ON t.id = a.parentId",
    )
    .select { row -> row.from<TreeNode>() }
```

For simple FK resolution without SQL, see [Views](views.md) or [Fluent traversal](fluent.md).
