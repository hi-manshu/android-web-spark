# Grouped Aggregates

Partition results by a property using `groupBy`, then apply aggregate functions. Each returns a `Map<G, Result>`.

## Basic grouped count

```kotlin
val countsByPin: Map<Boolean, Int> = notes.aggregate()
    .groupBy(Note::isPinned)
    .count()
// {true -> 12, false -> 45}
```

## Grouped sum / avg

```kotlin
val avgByCategory: Map<String, Double?> = notes.aggregate()
    .groupBy(Note::category)
    .avg(Note::score)

val sumByAuthor: Map<String, Double?> = notes.aggregate()
    .groupBy(Note::authorId)
    .sum(Note::wordCount)
```

## HAVING clause

Filter groups after aggregation with the type-safe HAVING DSL:

```kotlin
// Authors with more than 5 notes
val activeAuthors = notes.aggregate()
    .groupBy(Note::authorId)
    .having { count() gt 5 }
    .count()

// Categories where average score >= 4
val goodCategories = notes.aggregate()
    .groupBy(Note::category)
    .having { avg(Note::score) gte 4.0 }
    .avg(Note::score)

// Compound HAVING
val topAuthors = notes.aggregate()
    .groupBy(Note::authorId)
    .having { (count() gte 3) and (avg(Note::score) gte 4.0) }
    .avg(Note::score)
```

## Multi-column grouping

```kotlin
val grid = notes.aggregate()
    .groupByMultiple(Note::category, Note::status)
    .count()
// {["work", "draft"] -> 4, ["personal", "done"] -> 7}
```
