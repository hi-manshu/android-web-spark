# Testing

`krate-test` provides a fully reactive in-memory `Store<K, T>` implementation with the same
contract as the Room-backed store. No Room, no device, no database files required.

The example data class used throughout this page:

```kotlin
@Storable
data class Note(
    @Key val id: String = UUID.randomUUID().toString(),
    val title: String,
    val body: String = "",
    val isPinned: Boolean = false,
    val createdAt: Long = System.currentTimeMillis(),
)
```

---

## Setup

```kotlin
// build.gradle.kts
commonTest.dependencies {
    implementation("com.himanshoe:krate-test:<version>")
    implementation("app.cash.turbine:turbine:<version>") // optional — Flow assertions
}
```

---

## inMemoryKrate { }

Creates an in-memory `Krate` instance. Register each store you need inside the builder.

```kotlin
val db = inMemoryKrate {
    store<String, Note>({ it.id })
}
val notes: Store<String, Note> = db.store()
```

`store()` accepts two optional parameters beyond the required `keyOf` extractor:

| Parameter         | Type                              | Default      | Description                                                                                 |
|-------------------|-----------------------------------|--------------|---------------------------------------------------------------------------------------------|
| `searchableProps` | `List<KProperty1<T, String?>>`    | `emptyList()` | Properties searched by `search("query")` when no explicit properties are passed.           |
| `columnExtractors`| `Map<String, (T) -> Any?>`        | `emptyMap()`  | Value extractors for manually constructed string-based `PredicateNode` variants. Rarely needed. |

```kotlin
// Minimal — predicates and aggregates work, search("query") returns all items.
store<String, Note>({ it.id })

// With searchable props — search("query") filters correctly.
store<String, Note>({ it.id }, searchableProps = listOf(Note::title, Note::body))
```

Predicate queries (`findBy`, `findContaining`, `findAllOf`, etc.) work correctly without
`searchableProps` — they evaluate predicates via property references directly.

---

## CRUD

Every `Store` operation works identically to the Room backend:

```kotlin
@Test
fun crud_operations() = runTest {
    val db = inMemoryKrate { store<String, Note>({ it.id }) }
    val notes: Store<String, Note> = db.store()

    // Insert
    notes += Note(id = "n1", title = "Hello")
    notes += Note(id = "n2", title = "World")
    assertEquals(2, notes.count())

    // Read
    assertEquals("Hello", notes["n1"]?.title)
    assertEquals("Hello", notes.getValue("n1").title)
    assertNull(notes["missing"])

    // Update
    notes.update("n1") { copy(isPinned = true) }
    assertTrue(notes["n1"]!!.isPinned)

    // Delete
    notes -= "n1"
    assertNull(notes["n1"])
    assertEquals(1, notes.count())

    // Wipe
    notes.deleteAll()
    assertEquals(0, notes.count())
}
```

---

## Reactive testing

Pair with [Turbine](https://github.com/cashapp/turbine) for Flow assertions:

```kotlin
@Test
fun asFlow_emits_on_every_change() = runTest {
    val db = inMemoryKrate { store<String, Note>({ it.id }) }
    val notes: Store<String, Note> = db.store()

    notes.asFlow().test {
        assertEquals(emptyList(), awaitItem())          // initial emission

        notes += Note(id = "n1", title = "First")
        assertEquals(1, awaitItem().size)

        notes += Note(id = "n2", title = "Second")
        assertEquals(2, awaitItem().size)

        notes.update("n1") { copy(isPinned = true) }
        assertTrue(awaitItem().first { it.id == "n1" }.isPinned)

        notes -= "n1"
        assertEquals(1, awaitItem().size)

        cancelAndIgnoreRemainingEvents()
    }
}
```

`observe(id)` tracks a single item:

```kotlin
@Test
fun observe_tracks_a_single_item() = runTest {
    val db = inMemoryKrate { store<String, Note>({ it.id }) }
    val notes: Store<String, Note> = db.store()

    notes.observe("n1").test {
        assertNull(awaitItem())                         // not yet present

        notes += Note(id = "n1", title = "Hello")
        assertEquals("Hello", awaitItem()?.title)

        notes.update("n1") { copy(title = "Updated") }
        assertEquals("Updated", awaitItem()?.title)

        notes -= "n1"
        assertNull(awaitItem())                         // deleted

        cancelAndIgnoreRemainingEvents()
    }
}
```

---

## Query testing

Predicate queries use the same `PredicateNode` matching logic as the Room backend:

```kotlin
@Test
fun predicate_queries_match_room_behaviour() = runTest {
    val db = inMemoryKrate {
        store<String, Note>({ it.id })
    }
    val notes: Store<String, Note> = db.store()

    notes += Note(id = "n1", title = "Kotlin tips",   isPinned = true)
    notes += Note(id = "n2", title = "Meeting notes", isPinned = false)
    notes += Note(id = "n3", title = "Kotlin news",   isPinned = false)

    // Equality filter
    assertEquals(1, notes.findBy("isPinned", true).count())

    // Case-insensitive substring match
    assertEquals(2, notes.findContaining("title", "kotlin").count())

    // Compound predicate
    val pinnedKotlin = notes.findAllOf(
        PredicateNode.Eq("isPinned", true),
        PredicateNode.ContainsString("title", "kotlin"),
    ).toList()
    assertEquals(1, pinnedKotlin.size)
    assertEquals("n1", pinnedKotlin.single().id)

    // Sort + limit
    val top2 = notes.findAll()
        .sortedBy(Note::title)
        .take(2)
        .toList()
    assertEquals("Kotlin news", top2.first().title)

    // Reactive query — re-emits on every matching change
    notes.findBy("isPinned", true).asFlow().test {
        assertEquals(1, awaitItem().size)
        notes += Note(id = "n4", title = "Another pinned", isPinned = true)
        assertEquals(2, awaitItem().size)
        cancelAndIgnoreRemainingEvents()
    }
}
```

---

## KrateTestRule (JUnit 4)

`KrateTestRule` creates a fresh `inMemoryKrate` before each test and tears it down after.
No setup/teardown boilerplate needed:

```kotlin
class NoteStoreTest {

    @get:Rule
    val krateRule = KrateTestRule {
        store<String, Note>({ it.id })
    }

    private val notes: Store<String, Note>
        get() = krateRule.krate.store()

    @Test
    fun insert_increments_count() = runTest {
        notes += Note(id = "n1", title = "First")
        notes += Note(id = "n2", title = "Second")
        assertEquals(2, notes.count())
    }

    @Test
    fun delete_removes_item() = runTest {
        notes += Note(id = "n1", title = "To delete")
        notes -= "n1"
        assertNull(notes["n1"])
    }

    @Test
    fun update_mutates_field() = runTest {
        notes += Note(id = "n1", title = "Draft", isPinned = false)
        notes.update("n1") { copy(isPinned = true) }
        assertTrue(notes["n1"]!!.isPinned)
    }
}
```

Each test receives a completely empty store — writes from one test never affect another.

---

## FakeStore — call-recording test double

`FakeStore<K, T>` is a `Store` implementation backed by the same in-memory engine as
`inMemoryKrate`, but it additionally records every method call. Use it to assert *how* your
code interacts with the store — not just what data ends up in it.

```kotlin
val fake = FakeStore<String, Note>(keyOf = { it.id })
```

### Complete example

```kotlin
// The class under test
class NoteViewModel(private val notes: Store<String, Note>) {
    fun addNote(title: String) = viewModelScope.launch {
        notes += Note(title = title)
    }
    fun pinNote(id: String) = viewModelScope.launch {
        notes.update(id) { copy(isPinned = true) }
    }
    fun deleteNote(id: String) = viewModelScope.launch {
        notes -= id
    }
}

// Test
@Test
fun pinNote_calls_update_once_with_correct_id() = runTest {
    val fake = FakeStore<String, Note>(keyOf = { it.id })
    fake.add(Note(id = "n1", title = "Hello"))
    fake.clearCalls()                               // reset — don't count the setup add

    val vm = NoteViewModel(fake)
    vm.pinNote("n1")
    advanceUntilIdle()

    assertEquals(1, fake.updateCalls.size)
    assertEquals("n1", fake.updateCalls.single().id)
    assertTrue(fake["n1"]!!.isPinned)               // data was actually updated
}
```

### Recording calls

Every `Store` method appends a `FakeStore.Call` sealed variant to an internal log:

```kotlin
val fake = FakeStore<String, Note>(keyOf = { it.id })
val note = Note(id = "n1", title = "Hello")

fake.add(note)
fake.update("n1") { copy(isPinned = true) }
fake.delete("n1")

println(fake.allCalls)
// [Call.Add(item=Note(...)), Call.Update(id="n1", hasTransform=true), Call.Delete(id="n1")]
```

### Typed call filters

```kotlin
fake.addCalls           // List<T>                    — items passed to add()
fake.deleteCalls        // List<K>                    — keys passed to delete()
fake.updateCalls        // List<K>                    — keys passed to update()
fake.partialUpdateCalls // List<Call.PartialUpdate>   — partialUpdate() invocations with column details
```

### Resetting the call log

`clearCalls()` wipes the log without touching stored data:

```kotlin
fake.add(note)
fake.clearCalls()

assertEquals(0, fake.allCalls.size)
assertNotNull(fake["n1"])   // data is still there
```

### Call hierarchy

| Sealed variant              | Recorded when                    | Key fields                                          |
|-----------------------------|----------------------------------|-----------------------------------------------------|
| `Call.Add`                  | `add(item)`                      | `item: Any?`                                        |
| `Call.AddAll`               | `addAll(items)`                  | `items: List<Any?>`                                 |
| `Call.Delete`               | `delete(id)`                     | `id: Any?`                                          |
| `Call.DeleteAll`            | `deleteAll()`                    | —                                                   |
| `Call.DeleteAllByPredicate` | `deleteAll(predicate)`           | `predicate: Any?`                                   |
| `Call.Update`               | `update(id) { ... }`             | `id: Any?`, `hasTransform: Boolean`                 |
| `Call.UpdateAll`            | `updateAll(predicate) { ... }`   | `predicate: Any?`                                   |
| `Call.PartialUpdate`        | `partialUpdate(id) { ... }`      | `id: Any?`, `updates: List<Pair<String, Any?>>`     |
| `Call.Upsert`               | `upsert(item)`                   | `item: Any?`, `hasMerge: Boolean`                   |
| `Call.UpsertAll`            | `upsertAll(items)`               | `items: List<Any?>`                                 |
| `Call.PutIfAbsent`          | `putIfAbsent(item)`              | `item: Any?`                                        |
| `Call.Get`                  | `get(id)` / `store[id]`          | `id: Any?`                                          |
| `Call.GetValue`             | `getValue(id)`                   | `id: Any?`                                          |
| `Call.GetAll`               | `getAll()`                       | `ids: List<Any?>?` (always `null`)                  |
| `Call.GetAllByIds`          | `getAllByIds(ids)`                | `ids: List<Any?>`                                   |
| `Call.Count`                | `count()`                        | —                                                   |
| `Call.AsFlow`               | `asFlow()`                       | —                                                   |
| `Call.Observe`              | `observe(id)`                    | `id: Any?`                                          |
| `Call.Changes`              | `changes()`                      | —                                                   |
| `Call.Diff`                 | `diff()`                         | —                                                   |
| `Call.FindByPredicate`      | `findByPredicate(node)`          | `predicate: Any?`                                   |
| `Call.Search`               | `search(query, ...)`             | `query: String`                                     |
| `Call.Aggregate`            | `aggregate()`                    | —                                                   |
| `Call.AggregateFlow`        | `aggregateFlow()`                | —                                                   |
| `Call.Snapshot`             | `snapshot()`                     | —                                                   |
| `Call.WithSnapshot`         | `withSnapshot { ... }`           | —                                                   |

> `FakeStore` executes real data operations — it is not a mock. `fake["n1"]` after
> `fake.add(note)` returns the actual item, so you can assert both behaviour and state
> in the same test.

---

## See also

- [Store](../core/store.md)
- [Predicates](../queries/predicates.md)
- [Setup](../getting-started/setup.md)
