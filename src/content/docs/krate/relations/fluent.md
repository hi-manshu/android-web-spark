# Fluent Relation Traversal

Navigate FK relationships from a single item. Simplest API for one-off lookups.

## follow() — single FK lookup

```kotlin
val author: User? = note.follow(userStore, Note::authorId)
```

Example:

```kotlin
val note = noteStore["n1"] ?: return
val author = note.follow(userStore, Note::authorId)
println("${note.title} by ${author?.name ?: "Unknown"}")
```

## followMany() — one-to-many lookup

```kotlin
val comments: List<Comment> = note.followMany(commentStore, Comment::noteId, Note::id)
```

Example:

```kotlin
val note = noteStore["n1"] ?: return
val comments = note.followMany(commentStore, Comment::noteId, Note::id)
println("${note.title} has ${comments.size} comments")
```

## When to use

| Scenario | Use |
|---|---|
| Load one related item | `follow()` |
| Load children of one parent | `followMany()` |
| Load relations for a list | [Views](views.md) — `including()` / `includingMany()` |
| Complex cross-table queries | [Joins](joins.md) |
