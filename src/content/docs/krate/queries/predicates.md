# Predicates

Krate uses `PredicateNode` — an immutable sealed class — to express query conditions. Every node
maps directly to SQL and can be composed to form complex queries.

Predicates can be built in three styles — all produce identical SQL and can be freely mixed:

| Style          | Example                                              |
|----------------|------------------------------------------------------|
| **Infix DSL**  | `Note::isPinned eq true`                             |
| **Property ref** | `PredicateNode.Eq(Note::isPinned, true)`           |
| **String name** | `PredicateNode.Eq("isPinned", true)`                |

---

## Infix DSL

The infix DSL lets you build predicates that read like plain English, inspired by Exposed.
Every operator returns a `PredicateNode`, so it composes freely with the classic style.

```kotlin
// Simple conditions
notes.findByPredicate(Note::isPinned eq true)
notes.findByPredicate(Note::wordCount gt 100)
notes.findByPredicate(Note::title like "kotlin")
notes.findByPredicate(Note::wordCount between 100..500)
notes.findByPredicate(Note::status isIn listOf("draft", "published"))

// Compose with and / or / !
notes.findByPredicate(
    (Note::isPinned eq true) and (Note::wordCount gt 100)
)
notes.findByPredicate(
    (Note::title like "kotlin") or (Note::body like "kotlin")
)
notes.findByPredicate(!(Note::status eq "archived"))

// Mix infix with classic PredicateNode
notes.findByPredicate(
    (Note::isPinned eq true) and PredicateNode.GreaterThan("wordCount", 100)
)
```

### Infix operator reference

| Operator                               | SQL                               |
|----------------------------------------|-----------------------------------|
| `Note::isPinned eq true`               | `isPinned = 1`                    |
| `Note::isPinned neq false`             | `isPinned != 0`                   |
| `Note::wordCount gt 100`               | `wordCount > 100`                 |
| `Note::wordCount gte 100`              | `wordCount >= 100`                |
| `Note::wordCount lt 500`               | `wordCount < 500`                 |
| `Note::wordCount lte 500`              | `wordCount <= 500`                |
| `Note::wordCount between 100..500`     | `wordCount BETWEEN 100 AND 500`   |
| `Note::title like "kotlin"`            | `title LIKE '%kotlin%'`           |
| `Note::title startsWith "Draft"`       | `title LIKE 'Draft%'`             |
| `Note::title endsWith ".kt"`           | `title LIKE '%.kt'`               |
| `Note::status isIn listOf("a", "b")`   | `status IN ('a', 'b')`            |
| `Note::status notIn listOf("x")`       | `status NOT IN ('x')`             |
| `Note::deletedAt.isNull()`             | `deletedAt IS NULL`               |
| `Note::deletedAt.isNotNull()`          | `deletedAt IS NOT NULL`           |
| `Note::body.isEmpty()`                 | `body = ''`                       |
| `Note::body.isNotEmpty()`              | `body != ''`                      |
| `Note::title.isBlank()`               | `TRIM(title) = ''`                |
| `Note::title.isNotBlank()`            | `TRIM(title) != ''`               |
| `nodeA and nodeB`                      | `nodeA AND nodeB`                 |
| `nodeA or nodeB`                       | `nodeA OR nodeB`                  |
| `!node`                                | `NOT (node)`                      |

---

## Classic Construction Styles

Every leaf node supports two classic styles. Both produce identical SQL:

```kotlin
// String column name (used by generated find { } DSL)
PredicateNode.Eq("isPinned", true)

// Property reference (preferred for hand-written predicates)
PredicateNode.Eq(Note::isPinned, true)
```

Use property references when writing predicates manually — they work in in-memory tests without any
extra setup.

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

`Or` must be constructed directly — you cannot use `||` inside `find { }` because the left operand
short-circuits Kotlin evaluation before the right side is recorded.

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
PredicateNode.ExistsSubquery(
    "SELECT 1 FROM tags WHERE note_id = notes.id AND name = ?",
    listOf("important")
)
```

---

## Mixing styles

Because every style produces a `PredicateNode`, they compose naturally in the same expression:

```kotlin
// Build part of the predicate dynamically
val basePredicate = if (onlyPinned) {
    PredicateNode.Eq(Note::isPinned, true)  // classic
} else {
    PredicateNode.All
}

// Combine with infix operators
notes.findByPredicate(
    basePredicate and (Note::title like searchQuery)
).sortedByDescending(Note::createdAt).asFlow()

// Infix for the common cases, PredicateNode.Or for OR (can't use || in find { })
notes.findByPredicate(
    (Note::isPinned eq true) and
    PredicateNode.Or(
        PredicateNode.ContainsString(Note::title, query),
        PredicateNode.ContainsString(Note::body, query),
    )
)
```

---

## Aggregate expressions (join queries)

Use these extension functions on property references to build `SUM`, `AVG`, `COUNT`, `MIN`, `MAX`
expressions for use in [JoinQuery](../joins):

```kotlin
val totalRevenue = TaxiRide::price.sum().alias("total_revenue")
val avgPrice     = TaxiRide::price.avg().alias("avg_price")
val rideCount    = TaxiRide::id.count().alias("ride_count")
val lowestBid    = Bid::amount.min().alias("lowest_bid")
val highestBid   = Bid::amount.max().alias("highest_bid")
```

Always call `.alias("name")` — it is required to read the result back via `row.aggregate(expr)`.

| Extension          | SQL              | Result type            |
|--------------------|------------------|------------------------|
| `prop.sum()`       | `SUM(table.col)` | Same as property type  |
| `prop.avg()`       | `AVG(table.col)` | Same as property type  |
| `prop.count()`     | `COUNT(table.col)` | `Long`               |
| `prop.min()`       | `MIN(table.col)` | Same as property type  |
| `prop.max()`       | `MAX(table.col)` | Same as property type  |

---

## Column arithmetic in predicates

Use arithmetic expressions on property references directly in WHERE conditions.
The expression is translated to SQL — no in-memory read required.

```kotlin
// WHERE (score + bonus) > 100
notes.findByPredicate((Note::score + Note::bonus) gt 100)

// WHERE (price * quantity) <= 1000.0
items.findByPredicate((Item::price * Item::quantity) lte 1000.0)

// Scalar offset — (stock - 10) >= 5
items.findByPredicate((Item::stock - 10) gte 5)

// Mix with compound predicates
notes.findByPredicate(
    ((Note::score + Note::bonus) gt 100) and (Note::status eq "active")
)
```

**Arithmetic operators:** `+`, `-`, `*`, `/`
**Comparison operators:** `gt`, `gte`, `lt`, `lte`, `eq`, `neq`

---

## CASE / WHEN expressions (join queries)

Use `caseExpr { }` to add computed classification columns in a join query SELECT. Each branch
maps a [PredicateNode] condition to a typed result value:

```kotlin
val priceCategory = caseExpr<String> {
    whenThen(TaxiRide::price gt 100.0, "expensive")
    whenThen(TaxiRide::price gt 50.0,  "moderate")
    orElse("cheap")
}.alias("price_category")

db.join<Passenger, TaxiRide>()
    .on(Passenger::id, TaxiRide::passengerId)
    .caseExpr(priceCategory)
    .select { row ->
        row.from(Passenger::name)!! to row.caseResult(priceCategory)   // String?
    }
```

- Branches are evaluated **top-to-bottom** — first match wins (standard SQL `CASE WHEN` semantics).
- `orElse(value)` maps to `ELSE ?`; omit it and unmatched rows return `NULL`.
- `.alias("name")` is required before passing the expression to `.caseExpr(...)`.
- Any `PredicateNode` condition (including infix DSL and compound `and`/`or`) works in `whenThen`.

---

## Expression-based UPDATE

Update columns with SQL arithmetic without reading the row first. Avoids the read-modify-write
cycle for counters and derived fields:

```kotlin
// Increment view count — no SELECT needed
notes.updateExpr("note-1") {
    set(Note::viewCount, Note::viewCount + 1)
}

// Halve price of all archived items
notes.updateAllExpr(Note::status eq "archived") {
    set(Note::price, Note::price * 0.5)
}
// Returns Int — number of rows updated

// Mix constants and expressions in one call
notes.updateExpr("note-1") {
    set(Note::viewCount, Note::viewCount + 1)        // expression
    set(Note::updatedAt, System.currentTimeMillis())  // constant
}
```

| `set` overload | SQL produced |
|---|---|
| `set(Note::score, 42)` | `score = ?` |
| `set(Note::score, Note::score + 10)` | `score = score + ?` |
| `setExpr("score", ColumnExpr.Col("score"))` | raw column expression |

---

## Full Operator Reference

| Node                          | SQL                                     |
|-------------------------------|-----------------------------------------|
| `Eq(col, value)`              | `col = value` / `IS NULL`               |
| `NotEq(col, value)`           | `col != value` / `IS NOT NULL`          |
| `GreaterThan(col, value)`     | `col > value`                           |
| `GreaterThanOrEq(col, value)` | `col >= value`                          |
| `LessThan(col, value)`        | `col < value`                           |
| `LessThanOrEq(col, value)`    | `col <= value`                          |
| `InRange(col, from, to)`      | `col BETWEEN from AND to`               |
| `StartsWith(col, prefix)`     | `col LIKE 'prefix%'`                    |
| `EndsWith(col, suffix)`       | `col LIKE '%suffix'`                    |
| `ContainsString(col, value)`  | `col LIKE '%value%'` (case-insensitive) |
| `In(col, values)`             | `col IN (...)`                          |
| `NotIn(col, values)`          | `col NOT IN (...)`                      |
| `IsNull(col)`                 | `col IS NULL`                           |
| `IsNotNull(col)`              | `col IS NOT NULL`                       |
| `IsEmpty(col)`                | `col = ''`                              |
| `IsBlank(col)`                | `TRIM(col) = ''`                        |
| `And(left, right)`            | `left AND right`                        |
| `Or(left, right)`             | `left OR right`                         |
| `Not(node)`                   | `NOT (node)`                            |
