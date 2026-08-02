# Basic Aggregates

All basic aggregates are `suspend` functions on `store.aggregate()`.

## Count

```kotlin
val total = notes.aggregate().count()
val pinned = notes.aggregate().where(Note::isPinned eq true).count()
```

## Sum

```kotlin
val totalWords = notes.aggregate().sum(Note::wordCount)
// Returns Double? — null if no items match
```

## Average

```kotlin
val avgScore = notes.aggregate().avg(Note::score)
// Returns Double? — null if no items match or all non-numeric
```

## Min / Max

```kotlin
val earliest = notes.aggregate().min(Note::createdAt)
val highest  = notes.aggregate().max(Note::score)
```

## Count distinct

```kotlin
val uniqueAuthors = notes.aggregate().countDistinct(Note::authorId)
```

## Stats — all five metrics in one query

```kotlin
val s = notes.aggregate().where(Note::isPinned eq true).stats(Note::wordCount)
println("count=${s.count} avg=${s.avg} range=${s.min}..${s.max} sum=${s.sum}")
```

`stats()` fires exactly one SQL query — use it when you need multiple metrics.

## Filtering

Chain `.where()` to filter before aggregating:

```kotlin
val pinnedAvg = notes.aggregate()
    .where(Note::isPinned eq true)
    .avg(Note::score)

val recentCount = notes.aggregate()
    .where(Note::createdAt gte lastWeek)
    .count()
```
