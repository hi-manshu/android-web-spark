# Scoped Stores

A scoped store is a filtered view where all reads are automatically restricted. Writes pass through to the underlying store.

## Scope by property

```kotlin
val myNotes = noteStore.scoped(Note::userId, currentUserId)
myNotes.getAll()      // only this user's notes
myNotes.asFlow()      // reactive, filtered
myNotes.count()       // count only this user's notes
```

## Scope by predicate

```kotlin
val pinnedNotes = noteStore.scoped(Note::isPinned eq true)
pinnedNotes.getAll()  // only pinned notes
```

## Writes pass through

```kotlin
val myNotes = noteStore.scoped(Note::userId, "alice")
myNotes += Note("5", "New Note", userId = "alice")  // writes to underlying store
myNotes -= "5"                                        // deletes from underlying store
myNotes.update("5") { copy(title = "Updated") }      // updates in underlying store
```

## Combined predicates

```kotlin
val myPinned = noteStore.scoped(Note::userId, "alice")
    .findByPredicate(Note::isPinned eq true)
    .toList()
// userId == "alice" AND isPinned == true
```

## Use cases

- **Multi-tenant isolation** — each user sees only their own data
- **Team scoping** — `noteStore.scoped(Note::teamId, "team-1")`
- **Status filtering** — `orderStore.scoped(Order::status eq "OPEN")`
