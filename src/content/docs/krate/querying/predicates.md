# Predicates

Predicates filter items using a tree of `PredicateNode` objects. The preferred way to build them is with the type-safe infix DSL.

## Type-safe DSL

```kotlin
// Equality
Note::isPinned eq true
Note::status neq "archived"

// Comparison
Note::score gt 5
Note::score gte 5
Note::createdAt lt cutoffMs
Note::createdAt lte cutoffMs

// String matching (case-insensitive)
Note::title contains "kotlin"
Note::title startsWith "Meeting"
Note::title endsWith "notes"

// Null checks
Note::authorId.isNull()
Note::authorId.isNotNull()

// Empty/blank checks
Note::body.isEmpty()
Note::body.isNotEmpty()
Note::body.isBlank()
Note::body.isNotBlank()

// Collections
Note::status inList listOf("draft", "published")
Note::status notInList listOf("archived", "deleted")
```

## Combining predicates

```kotlin
// AND
(Note::isPinned eq true) and (Note::score gt 5)

// OR
(Note::title contains "kotlin") or (Note::body contains "kotlin")

// NOT
!(Note::isPinned eq true)
```

## Using predicates

```kotlin
// With findByPredicate
notes.findByPredicate(Note::isPinned eq true).toList()

// With updateAll
notes.updateAll(Note::status eq "draft") { copy(status = "published") }

// With deleteAll
notes.deleteAll(Note::createdAt lt cutoffMs)

// With observeCount
notes.observeCount(Note::isPinned eq true)
```

## Convenience extensions

Shorthand functions that build predicates internally:

```kotlin
notes.findBy(Note::isPinned, true)
notes.findContaining("title", "kotlin")
notes.findStartingWith("title", "Meeting")
notes.findGreaterThan("score", 5)
notes.findWhereNull("authorId")
notes.findWhereNotNull("authorId")
notes.findWhereEmpty("body")
notes.findWhereNotBlank("body")
```

## PredicateNode direct usage

For complex queries the DSL can't express:

```kotlin
notes.findByPredicate(
    PredicateNode.Or(
        PredicateNode.ContainsString("title", query),
        PredicateNode.ContainsString("body", query),
    )
).toList()
```

## Subquery predicates (SQL-only)

```kotlin
PredicateNode.ExistsSubquery(
    "SELECT 1 FROM labels WHERE labels.noteId = notes.id AND labels.name = ?",
    listOf("important"),
)

PredicateNode.InSubquery(
    Note::authorId,
    "SELECT id FROM users WHERE role = ?",
    listOf("admin"),
)
```
