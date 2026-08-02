# Reactive Aggregates

`store.aggregateFlow()` returns live-updating `Flow` values that re-compute on every store change.

## Reactive count

```kotlin
notes.aggregateFlow().countFlow()
    .collect { count -> badge.text = "$count" }
```

## Reactive sum / avg / min / max

```kotlin
notes.aggregateFlow().sumFlow(Note::wordCount)
    .collect { total -> totalLabel.text = "$total words" }

notes.aggregateFlow().avgFlow(Note::score)
    .collect { avg -> avgLabel.text = "Avg: $avg" }
```

## Reactive stats

```kotlin
notes.aggregateFlow().statsFlow(Note::wordCount)
    .collect { s -> 
        renderDashboard(s.count, s.avg, s.min, s.max)
    }
```

## Reactive grouped

```kotlin
notes.aggregateFlow()
    .groupByFlow(Note::category)
    .countFlow()
    .collect { map: Map<String, Int> ->
        renderPieChart(map)
    }

notes.aggregateFlow()
    .groupByFlow(Note::isPinned)
    .avgFlow(Note::score)
    .collect { map: Map<Boolean, Double?> ->
        pinnedAvg.text = "${map[true]}"
        unpinnedAvg.text = "${map[false]}"
    }
```

## Filtered reactive

```kotlin
notes.aggregateFlow()
    .where(Note::isPinned eq true)
    .countFlow()
    .collect { pinnedCount -> pinnedBadge.text = "$pinnedCount" }
```
