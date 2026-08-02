# Set Operations

Combine two queries using SQL set semantics.

## Union (deduplicated)

```kotlin
val results = (store.findByPredicate(Note::status eq "PAID")
    union store.findByPredicate(Note::status eq "REFUNDED")).toList()
```

## Union All (keeps duplicates)

```kotlin
val allLogs = (recentLogs unionAll archivedLogs).toList()
```

## Intersect

Items present in BOTH queries:

```kotlin
val pinnedAndRecent = (pinnedNotes intersect recentNotes).toList()
```

## Except

Items in the first query NOT in the second:

```kotlin
val unpaidOrders = (allOrders except paidOrders).toList()
```

## Example: complex search

```kotlin
val techOrPinned = (
    notes.findByPredicate(Note::category eq "tech")
    union
    notes.findByPredicate(Note::isPinned eq true)
).toList()
```
