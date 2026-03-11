# Aggregate Queries

Krate provides two aggregate APIs:
- `aggregate()` — one-shot suspend functions
- `aggregateFlow()` — reactive `Flow`-based variants that re-emit when data changes

---

## One-Shot Aggregates

```kotlin
val notes: Store<String, Note> = db.store(Note::class)

val total:   Int     = notes.aggregate().count()
val words:   Double? = notes.aggregate().sum(Note::wordCount)
val avg:     Double? = notes.aggregate().avg(Note::wordCount)
val longest: Double? = notes.aggregate().max(Note::wordCount)
val shortest:Double? = notes.aggregate().min(Note::wordCount)
val unique:  Int     = notes.aggregate().countDistinct(Note::title)
```

### All stats in one query

```kotlin
val stats: AggregateStats = notes.aggregate().stats(Note::wordCount)
println("count=${stats.count}, sum=${stats.sum}, avg=${stats.avg}")
```

---

## Filtering with `where`

Chain a `where` call before any aggregate to filter rows first:

```kotlin
// Sum of word counts for pinned notes only
val pinnedWords: Double? = notes
    .aggregate()
    .where(PredicateNode.Eq(Note::isPinned, true))
    .sum(Note::wordCount)
```

---

## Grouping

### Single column

```kotlin
// Count of notes per pinned state: Map<Boolean, Int>
val byPin: Map<Boolean, Int> = notes
    .aggregate()
    .groupBy<Boolean>(Note::isPinned)
    .count()
```

```kotlin
// Average word count per pinned state: Map<Boolean, Double?>
val avgByPin: Map<Boolean, Double?> = notes
    .aggregate()
    .groupBy<Boolean>(Note::isPinned)
    .avg(Note::wordCount)
```

### Multiple columns

```kotlin
val byPinAndStatus: Map<List<Any?>, Int> = notes
    .aggregate()
    .groupByMultiple(Note::isPinned, Note::status)
    .count()
```

---

## Reactive Aggregates

`aggregateFlow()` returns terminal operators that emit `Flow` values — they re-compute automatically whenever the store changes.

```kotlin
// Live count — re-emits on every add/delete
notes.aggregateFlow().countFlow().collect { count ->
    badge.text = count.toString()
}

// Live sum
notes.aggregateFlow().sumFlow(Note::wordCount).collect { total ->
    println("Total words: $total")
}
```

### Reactive grouped

```kotlin
// Live map of (isPinned → count) that updates when notes change
notes.aggregateFlow()
     .groupByFlow(Note::isPinned)
     .countFlow()
     .collect { map: Map<Boolean, Int> ->
         println("Pinned: ${map[true]}, Unpinned: ${map[false]}")
     }
```

---

## Reactive with filter

```kotlin
notes.aggregateFlow()
     .where(PredicateNode.Eq(Note::isPinned, true))
     .sumFlow(Note::wordCount)
     .collect { total -> println("Pinned word count: $total") }
```

---

## ViewModel pattern

```kotlin
class StatsViewModel(private val notes: Store<String, Note>) : ViewModel() {

    val totalCount: StateFlow<Int> = notes
        .aggregateFlow()
        .countFlow()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), 0)

    val pinnedCount: StateFlow<Int> = notes
        .aggregateFlow()
        .where(PredicateNode.Eq(Note::isPinned, true))
        .countFlow()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), 0)
}
```
