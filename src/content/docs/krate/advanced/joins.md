# Join Queries

Krate supports two join APIs — a two-table `JoinQuery` and a fully composable N-table
`MultiJoinQuery`. Both push the join into SQLite via Room and support reactive (`Flow`) emission.

---

## Two-table join — `Krate.join<A, B>()`

```kotlin
val results = db.join<Note, User>()
    .on(Note::authorId, User::id)
    .where(PredicateNode.Eq("t0_isPinned", true))
    .sortedByDescending(Note::createdAt)
    .take(20)
    .select { row ->
        NoteWithAuthor(
            title = row.from(Note::title)!!,
            author = row.with(User::name)!!,
        )
    }
```

### Join types

```kotlin
db.join<Note, User>().on(Note::authorId, User::id)            // INNER JOIN (default)
db.join<Note, User>().leftJoin().on(Note::authorId, User::id) // LEFT JOIN
db.join<Note, User>().crossJoin()                             // CROSS JOIN
```

### Row access

| Method           | Direction       | Example                 |
|------------------|-----------------|-------------------------|
| `row.from(Prop)` | Left table (A)  | `row.from(Note::title)` |
| `row.with(Prop)` | Right table (B) | `row.with(User::name)`  |

### Terminal operations

| Operation             | Returns         |
|-----------------------|-----------------|
| `select(mapper)`      | `List<R>`       |
| `firstOrNull(mapper)` | `R?`            |
| `asFlow(mapper)`      | `Flow<List<R>>` |

---

## Aggregate queries on two-table joins

Use `sum()`, `avg()`, `count()`, `min()`, `max()` extension functions on property references to
build aggregate expressions, then chain `groupBy` and `orderBy` on the join:

```kotlin
val totalRevenue = TaxiRide::price.sum().alias("total_revenue")
val rideCount    = TaxiRide::id.count().alias("ride_count")

val results = db.join<Passenger, TaxiRide>()
    .on(Passenger::id, TaxiRide::passengerId)
    .where(TaxiRide::status eq "completed")
    .groupBy(Passenger::name)
    .orderBy(totalRevenue to SortOrder.DESC)
    .limit(3)
    .select { row ->
        PassengerRevenue(
            name         = row.from(Passenger::name)!!,
            totalRevenue = row.aggregate(totalRevenue),
            rideCount    = row.aggregate(rideCount),
        )
    }
```

### Aggregate functions

| Extension                    | SQL              | Result type              |
|------------------------------|------------------|--------------------------|
| `Prop::field.sum()`          | `SUM(table.col)` | Same as property type    |
| `Prop::field.avg()`          | `AVG(table.col)` | Same as property type    |
| `Prop::field.count()`        | `COUNT(table.col)` | `Long`                 |
| `Prop::field.min()`          | `MIN(table.col)` | Same as property type    |
| `Prop::field.max()`          | `MAX(table.col)` | Same as property type    |

Always call `.alias("name")` on the expression — it is required to read the value back via
`row.aggregate(expr)`.

### GROUP BY

Group by a left-table (`FROM`) column:
```kotlin
.groupBy(Passenger::name)
```

Group by a right-table (`JOIN`) column:
```kotlin
.groupByWith(TaxiRide::category)
```

Multiple group-by columns — chain calls:
```kotlin
.groupBy(Passenger::name)
.groupByWith(TaxiRide::category)
```

### ORDER BY aggregate

Pass an `AggregateExpression` paired with a `SortOrder`:
```kotlin
.orderBy(TaxiRide::price.sum().alias("total_revenue") to SortOrder.DESC)
.orderBy(TaxiRide::id.count().alias("ride_count") to SortOrder.ASC)
```

Calling `orderBy(aggregate to SortOrder)` automatically includes the expression in the SELECT
clause, so it is always available via `row.aggregate(expr)`.

### Multiple aggregates without ordering

Use `aggregate()` when you want aggregates in SELECT but don't need to sort by them:
```kotlin
val totalRevenue = TaxiRide::price.sum().alias("total_revenue")
val rideCount    = TaxiRide::id.count().alias("ride_count")

db.join<Passenger, TaxiRide>()
    .on(Passenger::id, TaxiRide::passengerId)
    .groupBy(Passenger::name)
    .aggregate(totalRevenue, rideCount)
    .select { row ->
        row.from(Passenger::name)!! to row.aggregate(rideCount)
    }
```

### Reading aggregate values

`row.aggregate(expr)` resolves the value by the expression's alias:
```kotlin
val totalRevenue = TaxiRide::price.sum().alias("total_revenue")   // Double?
val rideCount    = TaxiRide::id.count().alias("ride_count")       // Long?

.select { row ->
    row.aggregate(totalRevenue)   // Double?
    row.aggregate(rideCount)      // Long?
}
```

### HAVING on two-table joins

Chain `.having { }` after `.groupBy` to filter groups by aggregate conditions. Works identically
to the `MultiJoinQuery` HAVING DSL, with property references resolved to the correct table:

```kotlin
// Only passengers with more than 2 completed rides
db.join<Passenger, TaxiRide>()
    .on(Passenger::id, TaxiRide::passengerId)
    .where(TaxiRide::status eq "completed")
    .groupBy(Passenger::name)
    .having { count() gt 2 }
    .orderBy(TaxiRide::price.sum().alias("revenue") to SortOrder.DESC)
    .limit(3)
    .select { row -> row.from(Passenger::name)!! }

// Filter by aggregate sum — only passengers whose total spend exceeds 500
.having { sum<TaxiRide>(TaxiRide::price) gt 500.0 }

// Compound HAVING condition
.having { (count() gte 2) and (avg<TaxiRide>(TaxiRide::price) gte 100.0) }

// Raw string escape hatch
.having("COUNT(*) > 5")
```

---

### CASE / WHEN expressions

Add computed classification columns to the SELECT using `caseExpr { }`. Read them back via
`row.caseResult(expr)`:

```kotlin
val priceCategory = caseExpr<String> {
    whenThen(TaxiRide::price gt 100.0, "expensive")
    whenThen(TaxiRide::price gt 50.0,  "moderate")
    orElse("cheap")
}.alias("price_category")

val isVip = caseExpr<Boolean> {
    whenThen(TaxiRide::id.count() gt 10L, true)
    orElse(false)
}.alias("is_vip")

db.join<Passenger, TaxiRide>()
    .on(Passenger::id, TaxiRide::passengerId)
    .caseExpr(priceCategory)
    .select { row ->
        PassengerCard(
            name     = row.from(Passenger::name)!!,
            category = row.caseResult(priceCategory),   // String?
        )
    }
```

- Conditions use the full predicate DSL — any `PredicateNode` expression works in `whenThen(...)`.
- Branches are evaluated top-to-bottom; the first match wins (standard SQL `CASE WHEN` semantics).
- `orElse(value)` maps to `ELSE ?`; omit it and unmatched rows return `NULL`.
- Call `.alias("name")` before passing to `caseExpr(...)` — required to read the result back.

---

## N-table join — `Krate.multiJoin<A>()`

Use `multiJoin` when joining three or more tables, or when you need window functions, CTEs, or GROUP
BY.

### Basic join chain

```kotlin
val results = db.multiJoin<Note>()
    .innerJoin<User>().on(Note::authorId, User::id)
    .leftJoin<Tag>().on(Note::tagId, Tag::id)
    .innerJoin<Category>().on(Tag::categoryId, Category::id)
    .where(PredicateNode.Eq(q.columnOf(Note::isPinned), true))
    .sortedBy(Note::createdAt, ascending = false)
    .take(20)
    .select { row ->
        NoteWithDetails(
            title = row.from(Note::title)!!,
            author = row.from(User::name)!!,
            tag = row.from(Tag::label),
            category = row.from(Category::name),
        )
    }
```

### Join types

```kotlin
.innerJoin<User>()   // INNER JOIN — only rows with a matching user
    .leftJoin<Tag>()     // LEFT JOIN  — all notes, null tag columns if no match
    .crossJoin<Region>() // CROSS JOIN — full Cartesian product
```

Call `.on(LeftProp, RightProp)` immediately after each join to set the join condition:

```kotlin
.innerJoin<User>().on(Note::authorId, User::id)
// OR — raw alias-qualified expression
    .innerJoin<User>().on("t0.authorId = t1.id")
```

### Row access

Access columns by property reference — no alias strings required:

```kotlin
.select { row ->
    NoteCard(
        title = row.from(Note::title)!!,         // t0_title
        author = row.from(User::displayName)!!,   // t1_displayName
        tag = row.from(Tag::label),             // t2_label (nullable — LEFT JOIN)
    )
}
```

Use `rawLong`, `rawDouble`, `rawString`, `rawInt`, `rawBoolean` for window/CTE columns:

```kotlin
row.rawLong("rowNum")
row.rawDouble("runningTotal")
row.rawString("categoryPath")
```

### WHERE — type-safe predicates

Use `columnOf` to build alias-prefixed column names without hard-coding alias strings:

```kotlin
val q = db.multiJoin<Note>().innerJoin<User>().on(Note::authorId, User::id)
q.where(
    PredicateNode.And(
        PredicateNode.Eq(q.columnOf(Note::isPinned), true),
        PredicateNode.ContainsString(q.columnOf(User::name), "john"),
    )
)
```

### Sorting

```kotlin
.sortedBy(Note::createdAt, ascending = false)   // primary sort (typed)
    .sortedBy("t0_createdAt", ascending = false)    // primary sort (raw)
    .thenBy(User::name)                             // secondary sort (typed)
    .thenBy("t1_name")                              // secondary sort (raw)
```

### Pagination

```kotlin
.take(20)    // LIMIT 20
    .drop(40)    // OFFSET 40
```

### Distinct

```kotlin
db.multiJoin<Note>()
    .innerJoin<Tag>().on(Note::tagId, Tag::id)
    .distinct()
    .select { row -> row.from(Note::title)!! }
```

---

## GROUP BY

Group by properties from any participating table:

```kotlin
db.multiJoin<Order>()
    .innerJoin<User>().on(Order::userId, User::id)
    .groupBy<User>(User::id, User::name)       // typed — alias resolved automatically
    .select { row ->
        UserOrderSummary(
            userId = row.from(User::id)!!,
            name = row.from(User::name)!!,
        )
    }
```

Or use raw alias-prefixed names:

```kotlin
.groupBy("t1_id", "t1_name")
```

---

## HAVING — type-safe DSL

Chain `.having { }` after `.groupBy` to filter groups. Values are bound as `?` parameters.

```kotlin
// Simple count filter
db.multiJoin<Order>()
    .innerJoin<User>().on(Order::userId, User::id)
    .groupBy<User>(User::id)
    .having { count() gt 3 }
    .select { row -> row.from(User::name)!! }

// Sum filter using property reference — alias resolved automatically
    .having { sum<Order>(Order::totalAmount) gt 500.0 }

// Compound condition
    .having { (count() gte 2) and (avg<Order>(Order::totalAmount) gte 100.0) }
```

**Available HAVING expressions:**

| DSL                           | SQL                           |
|-------------------------------|-------------------------------|
| `count()`                     | `COUNT(*)`                    |
| `sum<T>(prop)` / `sum("col")` | `SUM(alias.col)` / `SUM(col)` |
| `avg<T>(prop)` / `avg("col")` | `AVG(alias.col)` / `AVG(col)` |
| `min<T>(prop)` / `min("col")` | `MIN(alias.col)` / `MIN(col)` |
| `max<T>(prop)` / `max("col")` | `MAX(alias.col)` / `MAX(col)` |

**Comparison operators:** `gt`, `gte`, `lt`, `lte`, `eq` — all infix, return `HavingCondition`.

**Compound operators:** `.and(other)`, `.or(other)` on `HavingCondition`.

Raw string escape hatch for expressions not yet in the DSL:

```kotlin
.having("COUNT(*) > 5")
```

---

## Window functions

Use `.window(alias) { }` to add a computed column to the SELECT clause.

### Plain aggregate with GROUP BY

```kotlin
db.multiJoin<Order>()
    .innerJoin<User>().on(Order::userId, User::id)
    .groupBy<User>(User::id, User::name)
    .window("orderCount") { count() }
    .window("totalSpend") { sum<Order>(Order::totalAmount) }
    .having { count() gt 3 }
    .select { row ->
        UserStats(
            name = row.from(User::name)!!,
            orderCount = row.rawLong("orderCount")!!,
            totalSpend = row.rawDouble("totalSpend")!!,
        )
    }
```

### ROW_NUMBER

```kotlin
.window("rowNum") {
    rowNumber().over {
        partitionBy<User>(User::id)
        orderBy<Order>(Order::createdAt, ascending = false)
    }
}
// row.rawLong("rowNum")
```

### RANK / DENSE_RANK

```kotlin
.window("rank") {
    rank().over { orderBy<Order>(Order::totalAmount, ascending = false) }
}
    .window("denseRank") {
        denseRank().over { orderBy<Note>(Note::score, ascending = false) }
    }
```

### Running total (SUM OVER)

```kotlin
.window("runningTotal") {
    sum<Order>(Order::totalAmount).over {
        partitionBy<User>(User::id)
        orderBy<Order>(Order::createdAt)
    }
}
```

### LAG / LEAD — previous/next row value

```kotlin
.window("prevAmount") {
    lag<Order>(Order::totalAmount, offset = 1, default = 0.0).over {
        partitionBy<User>(User::id)
        orderBy<Order>(Order::createdAt)
    }
}
    .window("nextAmount") {
        lead<Order>(Order::totalAmount, offset = 1, default = 0.0).over {
            partitionBy<User>(User::id)
            orderBy<Order>(Order::createdAt)
        }
    }
```

### FIRST_VALUE / LAST_VALUE

```kotlin
.window("firstOrder") {
    firstValue<Order>(Order::totalAmount).over {
        partitionBy<User>(User::id)
        orderBy<Order>(Order::createdAt)
    }
}
```

### NTILE

```kotlin
.window("quartile") {
    ntile(4).over { orderBy<Order>(Order::totalAmount, ascending = false) }
}
```

> Window functions require **SQLite 3.25+** (Android API 30+ / all modern iOS targets). Plain
> aggregates with `GROUP BY` work on all versions.

---

## CTEs — Common Table Expressions

### Standard CTE

```kotlin
db.multiJoin<Order>()
    .withCte(
        name = "RecentOrders",
        sql = "SELECT * FROM krate_order WHERE createdAt > ?",
        args = listOf(cutoffMs),
    )
    .innerJoin<User>().on("t0.userId = t1.id")
    .select { row ->
        OrderSummary(
            orderId = row.from(Order::id)!!,
            user = row.from(User::name)!!,
        )
    }
```

### Recursive CTE — hierarchical data

```kotlin
db.multiJoin<Category>()
    .withRecursiveCte(
        name = "CategoryTree",
        sql = """
            SELECT id, name, parent_id, 0 AS depth
            FROM krate_category WHERE parent_id IS NULL
            UNION ALL
            SELECT c.id, c.name, c.parent_id, ct.depth + 1
            FROM krate_category c
            INNER JOIN CategoryTree ct ON c.parent_id = ct.id
        """,
    )
    .select { row ->
        CategoryNode(
            id = row.from(Category::id)!!,
            name = row.from(Category::name)!!,
            depth = row.rawInt("depth")!!,
        )
    }
```

---

## Shortcuts

### `exists()` — check without fetching rows

```kotlin
val hasOverdue = db.multiJoin<Order>()
    .innerJoin<User>().on(Order::userId, User::id)
    .where(PredicateNode.LessThan(q.columnOf(Order::dueDate), now))
    .exists()   // true / false — delegates to count() > 0
```

### `selectFirst(mapper)` — fetch only the first row

Adds `LIMIT 1` before executing — more efficient than `select(mapper).firstOrNull()`:

```kotlin
val latest = db.multiJoin<Order>()
    .innerJoin<User>().on(Order::userId, User::id)
    .sortedBy(Order::createdAt, ascending = false)
    .selectFirst { row ->
        OrderSummary(id = row.from(Order::id)!!, user = row.from(User::name)!!)
    }
```

### `selectDistinct(mapper)` — deduplicate at the database level

Equivalent to `.distinct().select(mapper)`:

```kotlin
val uniqueAuthors = db.multiJoin<Note>()
    .innerJoin<User>().on(Note::authorId, User::id)
    .selectDistinct { row -> row.from(User::name)!! }
```

---

## Reactive joins

Every terminal operation has a `Flow`-based counterpart that re-emits whenever any participating
table changes:

```kotlin
// Two-table
db.join<Note, User>()
    .on(Note::authorId, User::id)
    .select { row -> NoteWithAuthor(...) }
    .asFlow()
    .collect { list -> render(list) }

// N-table
db.multiJoin<Note>()
    .innerJoin<User>().on(Note::authorId, User::id)
    .selectAsFlow { row -> NoteWithAuthor(...) }
    .collect { list -> render(list) }
```

---

## Terminal operations summary

| Method                   | Returns          | Notes                                  |
|--------------------------|------------------|----------------------------------------|
| `select(mapper)`         | `List<R>`        | All matching rows                      |
| `selectFirst(mapper)`    | `R?`             | First row; applies `LIMIT 1`           |
| `selectDistinct(mapper)` | `List<R>`        | Unique rows; applies `SELECT DISTINCT` |
| `selectAsFlow(mapper)`   | `Flow<List<R>>`  | Re-emits on any table change           |
| `count()`                | `Int`            | Row count, respects WHERE              |
| `exists()`               | `Boolean`        | `true` if `count() > 0`                |
| `distinct()`             | `MultiJoinQuery` | Enables `SELECT DISTINCT`              |

---

## See also

- [Predicates](../queries/predicates.md) — `PredicateNode`, query conditions
- [Aggregate Queries](../queries/aggregate-queries.md) — `aggregate()`, `groupBy`, `stats`
- [Store](../core/store.md) — core CRUD, transactions, raw SQL
