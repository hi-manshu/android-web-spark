# Access Control

## Compile-time read-only

`readOnly()` returns a `ReadOnlyStore` — write methods don't exist on the type:

```kotlin
val readOnly = noteStore.readOnly()
readOnly.getAll()       // works
readOnly.asFlow()       // works
readOnly.aggregate()    // works
readOnly.count()        // works
// readOnly += note     // compile error — no such method
```

`ReadOnlyStore` exposes: `get`, `getValue`, `getAll`, `getAllByIds`, `count`, `observeCount`, `asFlow`, `observe`, `findByPredicate`, `search`, `aggregate`, `aggregateFlow`, `changes`, `diff`, `snapshot`, `withSnapshot`.

## Runtime access control

`withAccess()` returns a full `Store` that checks permissions at runtime:

```kotlin
// Static permissions
val restricted = noteStore.withAccess(read = true, write = false)
restricted.getAll()    // works
restricted += note     // throws AccessDeniedException
```

### Dynamic permissions

Re-evaluated on every operation:

```kotlin
val guarded = noteStore.withAccess(
    read = { true },
    write = { currentUser.isAdmin },
)

// Non-admin: reads work, writes throw
// Admin: everything works
```

### AccessDeniedException

```kotlin
try {
    restricted.add(note)
} catch (e: AccessDeniedException) {
    showError(e.message)  // "Write access denied for 'add'"
}
```

## Protected store is still a Store

`ProtectedStore` implements `Store<K, T>`, so it works with all extension functions:

```kotlin
val restricted = noteStore.withAccess(read = true, write = true)
restricted.pipeline().filter(Note::isPinned eq true).execute()  // works
```
