# Pipelines

Functional data pipelines that chain filter, sort, group, aggregate, and limit operations. Each step returns a new immutable pipeline — nothing executes until a terminal is called.

## Basic pipeline

```kotlin
val topPinned = noteStore
    .pipeline()
    .filter(Note::isPinned eq true)
    .sortedByDescending(Note::score)
    .take(10)
    .execute()
```

## Pipeline with mapping

```kotlin
val titles = noteStore
    .pipeline()
    .filter(Note::category eq "tech")
    .sortedBy(Note::title)
    .map { it.title }
```

## Grouped aggregation

```kotlin
val report = noteStore
    .pipeline()
    .filter(Note::status eq "published")
    .aggregate(Note::category) {
        count()
        sumOf(Note::wordCount)
        averageOf(Note::score)
        minOf(Note::score)
        maxOf(Note::score)
    }
    .sortedByDescending { it.count }
    .take(5)
    .execute()
// Returns List<PipelineGroupResult<String>>
// Each result has: group, count, sum, average, min, max
```

## Two-step grouping

```kotlin
val report = noteStore
    .pipeline()
    .filter(Note::score gte 5)
    .groupAndAggregate(Note::category)
    .aggregate { count(); sumOf(Note::wordCount) }
    .execute()
```

## Reactive pipeline

```kotlin
noteStore.pipeline()
    .filter(Note::isPinned eq true)
    .asFlow()
    .collect { notes -> render(notes) }

// Reactive aggregation
noteStore.pipeline()
    .aggregate(Note::category) { count() }
    .asFlow()
    .collect { report -> renderChart(report) }
```

## Terminal operations

| Operation | Returns |
|---|---|
| `execute()` | `List<T>` |
| `asFlow()` | `Flow<List<T>>` |
| `count()` | `Int` |
| `firstOrNull()` | `T?` |
| `first()` | `T` |
| `any()` | `Boolean` |
| `none()` | `Boolean` |
| `map { }` | `List<R>` |
| `mapFlow { }` | `Flow<List<R>>` |
| `fold(initial) { }` | `R` |
| `groupBy(prop)` | `Map<G, List<T>>` |
| `filterResult { }` | `List<T>` (post-query filter) |

## When to use pipelines vs QueryResult

**Use pipelines** when you need grouped aggregation with sorting/limiting on the aggregate results.

**Use QueryResult** for simple filter + sort + limit queries — it maps directly to SQL.
