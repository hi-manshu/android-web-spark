# Field-Level Observation

Subscribe to changes on a specific property or computed value.

## observeField()

Emits only when the specific field changes — not on every store write:

```kotlin
store.observeField("n1", Note::title).collect { title ->
    titleLabel.text = title ?: "Deleted"
}
```

## observeComputed()

Observe a derived value:

```kotlin
store.observeComputed("n1") { "${it.title} (${it.wordCount} words)" }
    .collect { summary -> summaryLabel.text = summary ?: "" }
```

## observeDistinctValues()

Live list of all distinct non-null values of a property across the store:

```kotlin
store.observeDistinctValues(Note::category).collect { categories ->
    categoryFilter.options = categories
}
```

## When to use

| Need | Use |
|---|---|
| Observe one item | `store.observe(id)` |
| Observe one field of one item | `store.observeField(id, prop)` |
| Observe a derived value | `store.observeComputed(id) { ... }` |
| Observe all unique values of a field | `store.observeDistinctValues(prop)` |
