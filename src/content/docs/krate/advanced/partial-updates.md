# Partial Updates

Update individual fields without writing a full `copy()` call.

## patch() — single field

```kotlin
noteStore.patch("n1", Note::title, "New Title") { copy(title = it) }
noteStore.patch("n1", Note::isPinned, true) { copy(isPinned = it) }
noteStore.patch("n1", Note::score, 10) { copy(score = it) }
```

Returns `true` if found and patched, `false` if not found.

## patchMany() — multiple fields at once

```kotlin
noteStore.patchMany("n1") {
    set(Note::title, "New Title") { copy(title = it) }
    set(Note::isPinned, true) { copy(isPinned = it) }
    set(Note::score, 10) { copy(score = it) }
}
```

All changes are applied sequentially and written once.

## toggle() — flip a boolean

```kotlin
noteStore.toggle("n1", Note::isPinned) { copy(isPinned = it) }
// false -> true -> false -> ...
```

## incrementField() — add to a number

```kotlin
noteStore.incrementField("n1", Note::score, by = 3) { copy(score = it) }
noteStore.incrementField("n1", Note::viewCount) { copy(viewCount = it) }  // defaults to +1
noteStore.incrementField("n1", Note::score, by = -1) { copy(score = it) } // decrement
```

## Why the applier lambda?

Krate is KMP — no JVM reflection. The `{ copy(field = it) }` lambda tells Krate how to apply the new value without reflection.
