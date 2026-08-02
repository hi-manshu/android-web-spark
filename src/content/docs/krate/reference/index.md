# API Reference

Quick cheat sheet — one-liner per API. Click links for full docs.

## [Core](../core/index.md)

```kotlin
store.add(item)                          // insert or replace
store += item                            // operator alias
store.addAll(items)                      // batch insert
store.update(id) { copy(...) }           // read-modify-write
store.upsert(item) { existing -> ... }   // insert or merge
store.putIfAbsent(item)                  // insert only if new
store.delete(id)                         // delete by key
store -= id                              // operator alias
store.deleteAll()                        // wipe store
store.deleteAll(predicate)               // delete by predicate
store.updateAll(predicate) { copy(...) } // bulk update
store[id]                                // get or null
store.getValue(id)                       // get or throw
store.getAll()                           // all items
store.getAllByIds(ids)                    // batch fetch
store.count()                            // total count
store.exists(id)                         // key exists?
store.isEmpty()                          // no items?
```

## [Reactive](../core/reactive.md)

```kotlin
store.asFlow()                       // Flow<List<T>>
store.observe(id)                    // Flow<T?>
store.observeCount()                 // Flow<Int>
store.observeCount(predicate)        // Flow<Int> filtered
store.changes()                      // Flow<StoreChange>
store.diff()                         // Flow<StoreDiff>
```

## [Querying](../querying/index.md)

```kotlin
store.findByPredicate(pred)              // QueryResult
    .sortedBy(prop)                      // ascending
    .sortedByDescending(prop)            // descending
    .thenBy(prop)                        // secondary sort
    .take(n)                             // limit
    .drop(n)                             // offset
    .distinct()                          // deduplicate
    .toList()                            // execute
    .firstOrNull()                       // first or null
    .count()                             // count matches
    .asFlow()                            // reactive
    .chunked(size)                       // paged
    .afterKey(prop, value)               // cursor forward
    .beforeKey(prop, value)              // cursor backward
store.search(query, props...)            // text search
```

## [Aggregates](../aggregates/index.md)

```kotlin
store.aggregate().count()                // Int
store.aggregate().sum(prop)              // Double?
store.aggregate().avg(prop)              // Double?
store.aggregate().min(prop)              // Double?
store.aggregate().max(prop)              // Double?
store.aggregate().stats(prop)            // AggregateStats
store.aggregate().groupBy(prop).count()  // Map<G, Int>
store.aggregateFlow().countFlow()        // Flow<Int>
```

## [Relations](../relations/index.md)

```kotlin
store.including(other, on = FK)          // one-to-one view
store.includingMany(other, FK, PK)       // one-to-many view
item.follow(store, FK)                   // single lookup
item.followMany(store, childFK, PK)      // children lookup
store.scoped(prop, value)                // filtered view
```

## [Advanced](../advanced/index.md)

```kotlin
store.patch(id, prop, value) { copy(...) }  // single field
store.patchMany(id) { set(...) }             // multi field
store.toggle(id, prop) { copy(...) }         // flip boolean
store.incrementField(id, prop) { copy(...) } // add to int
store.updateIf(id, { cond }) { copy(...) }   // conditional
store.pipeline().filter().execute()           // pipeline
store.readOnly()                              // compile-time RO
store.withAccess(read, write)                 // runtime perms
```

## [Configuration](../configuration/index.md)

```kotlin
store<K, T> {
    beforePut { }; afterPut { }
    beforeDelete { }; afterDelete { }
    onError { }; onConflict { }
    validate { notBlank(prop); maxLength(prop, n) }
    audit(AuditMode.Rolling(50))
    middleware(mw); debugMiddleware(mw)
}
```
