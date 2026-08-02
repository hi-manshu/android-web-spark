# Multi-Level Undo Groups

Capture a group of changes and revert them all at once.

## withUndoGroup()

```kotlin
val group = store.withUndoGroup(listOf("n1", "n2"), { it.id }) {
    update("n1") { copy(isPinned = true) }
    delete("n2")
}

// Later — revert all changes
group.undo(store)
```

## beginUndoGroup()

For manual control over the undo boundary:

```kotlin
val group = store.beginUndoGroup(listOf("n1", "n2", "n3"), { it.id })

// Perform operations...
store.update("n1") { copy(title = "Changed") }
store.delete("n2")

// Revert everything
val restoredCount = group.undo(store)
```

`undo()` returns the number of items restored.

## Example: settings screen

```kotlin
// User enters edit mode
val undoGroup = settingsStore.withUndoGroup(
    keys = settingsStore.getAll().map { it.id },
    keyExtractor = { it.id },
) {
    update("theme") { copy(value = "dark") }
    update("language") { copy(value = "es") }
}

// User taps "Cancel"
undoGroup.undo(settingsStore)
```
