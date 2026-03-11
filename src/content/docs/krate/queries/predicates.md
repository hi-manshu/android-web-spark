# Predicates

Krate uses `PredicateNode` — an immutable sealed class — to express query conditions. Every node maps directly to SQL and can be composed to form complex queries.

## Two Construction Styles

Every leaf node supports two styles. Both produce identical SQL:

```kotlin
// String column name (used by generated find { } DSL)
PredicateNode.Eq("isPinned", true)

// Property reference (preferred for hand-written predicates)
PredicateNode.Eq(Note::isPinned, true)
```

Use property references when writing predicates manually — they work in in-memory tests without any extra setup.

---

## Using Predicates

Pass a `PredicateNode` to `findByPredicate`, `deleteAll`, or `updateAll`:

```kotlin
// Read
notes.findByPredicate(PredicateNode.Eq(Note::isPinned, true))
     .asFlow()
     .collect { pinned -> render(pinned) }

// Delete matching
notes.deleteAll(PredicateNode.Eq(Note::isPinned, false))

// Update matching
notes.updateAll(PredicateNode.Eq(Note::isPinned, false)) {
    copy(isPinned = true)
}
```

---

## Predicate Reference

### Equality

```kotlin
PredicateNode.Eq(Note::isPinned, true)      // column = value
PredicateNode.NotEq(Note::isPinned, false)  // column != value
```

Passing `null` as the value generates `IS NULL` / `IS NOT NULL`.

### Comparison

```kotlin
PredicateNode.GreaterThan(Note::wordCount, 100)      // >
PredicateNode.GreaterThanOrEq(Note::wordCount, 100)  // >=
PredicateNode.LessThan(Note::wordCount, 1000)        // <
PredicateNode.LessThanOrEq(Note::wordCount, 1000)    // <=
```

### Range

```kotlin
PredicateNode.InRange(Note::wordCount, from = 100, to = 500)
// fromInclusive and toInclusive default to true
PredicateNode.InRange(Note::wordCount, 100, 500, fromInclusive = true, toInclusive = false)
```

### String Matching

```kotlin
PredicateNode.StartsWith(Note::title, "Hello")        // LIKE 'Hello%'
PredicateNode.EndsWith(Note::title, "world")          // LIKE '%world'
PredicateNode.ContainsString(Note::title, "kotlin")   // case-insensitive LIKE '%kotlin%'
```

### Set Membership

```kotlin
PredicateNode.In(Note::status, listOf("draft", "published"))
PredicateNode.NotIn(Note::status, listOf("deleted", "archived"))
```

### Null / Empty Checks

```kotlin
PredicateNode.IsNull(Note::summary)
PredicateNode.IsNotNull(Note::summary)
PredicateNode.IsEmpty(Note::body)       // column = ''
PredicateNode.IsNotEmpty(Note::body)
PredicateNode.IsBlank(Note::title)      // TRIM(column) = ''
PredicateNode.IsNotBlank(Note::title)
```

---

## Composing Predicates

### AND

```kotlin
store.findByPredicate(
    PredicateNode.And(
        PredicateNode.Eq(Note::isPinned, true),
        PredicateNode.GreaterThan(Note::wordCount, 100)
    )
).asFlow()
```

### OR

`Or` must be constructed directly — you cannot use `||` inside `find { }` because the left operand short-circuits Kotlin evaluation before the right side is recorded.

```kotlin
store.findByPredicate(
    PredicateNode.Or(
        PredicateNode.ContainsString(Note::title, query),
        PredicateNode.ContainsString(Note::body, query)
    )
).asFlow()
```

### NOT

```kotlin
PredicateNode.Not(PredicateNode.Eq(Note::isPinned, true))
```

### Nested composition

```kotlin
PredicateNode.And(
    PredicateNode.Eq(Note::isPinned, true),
    PredicateNode.Or(
        PredicateNode.ContainsString(Note::title, "kotlin"),
        PredicateNode.ContainsString(Note::body, "kotlin")
    )
)
```

---

## Subqueries

For advanced cases:

```kotlin
PredicateNode.InSubquery("author_id", "SELECT id FROM users WHERE role = ?", listOf("admin"))
PredicateNode.ExistsSubquery("SELECT 1 FROM tags WHERE note_id = notes.id AND name = ?", listOf("important"))
```

---

## Full Operator Reference

| Node | SQL |
|---|---|
| `Eq(col, value)` | `col = value` / `IS NULL` |
| `NotEq(col, value)` | `col != value` / `IS NOT NULL` |
| `GreaterThan(col, value)` | `col > value` |
| `GreaterThanOrEq(col, value)` | `col >= value` |
| `LessThan(col, value)` | `col < value` |
| `LessThanOrEq(col, value)` | `col <= value` |
| `InRange(col, from, to)` | `col BETWEEN from AND to` |
| `StartsWith(col, prefix)` | `col LIKE 'prefix%'` |
| `EndsWith(col, suffix)` | `col LIKE '%suffix'` |
| `ContainsString(col, value)` | `col LIKE '%value%'` (case-insensitive) |
| `In(col, values)` | `col IN (...)` |
| `NotIn(col, values)` | `col NOT IN (...)` |
| `IsNull(col)` | `col IS NULL` |
| `IsNotNull(col)` | `col IS NOT NULL` |
| `IsEmpty(col)` | `col = ''` |
| `IsBlank(col)` | `TRIM(col) = ''` |
| `And(left, right)` | `left AND right` |
| `Or(left, right)` | `left OR right` |
| `Not(node)` | `NOT (node)` |
