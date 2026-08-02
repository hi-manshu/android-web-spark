# Testing

The `krate-test` module provides an in-memory Krate for unit tests — no Room, no file system, no instrumentation.

## Setup

```kotlin
commonTest.dependencies {
    implementation("com.himanshoe:krate-test:<version>")
}
```

## inMemoryKrate

```kotlin
val db = inMemoryKrate {
    store<String, Note>({ it.id })
    store<String, Label>({ it.id })
}
val noteStore = db.store(Note::class)
```

### With searchable properties

```kotlin
val db = inMemoryKrate {
    store<String, Note>(
        { it.id },
        searchableProps = listOf(Note::title, Note::body),
    )
}
```

### With column extractors (for string-based predicates)

```kotlin
val db = inMemoryKrate {
    store<String, Note>(
        { it.id },
        columnExtractors = mapOf(
            "isPinned" to { it.isPinned },
            "score" to { it.score },
        ),
    )
}
```

### With store config

```kotlin
val db = inMemoryKrate {
    store<String, Note>({ it.id }) {
        validate { notBlank(Note::title) }
        middleware(MetricsMiddleware())
    }
}
```

## CRUD testing

```kotlin
@Test
fun `add and retrieve`() = runTest {
    store.add(Note("1", "Hello"))
    assertEquals("Hello", store["1"]?.title)
}

@Test
fun `delete removes item`() = runTest {
    store.add(Note("1", "Hello"))
    store.delete("1")
    assertNull(store["1"])
}
```

## Reactive testing with Turbine

```kotlin
@Test
fun `asFlow emits on change`() = runTest {
    store.asFlow().test {
        assertEquals(emptyList(), awaitItem())
        store.add(Note("1", "Hello"))
        assertEquals(1, awaitItem().size)
    }
}
```

## Query testing

```kotlin
@Test
fun `findByPredicate filters correctly`() = runTest {
    store.addAll(listOf(
        Note("1", "A", isPinned = true),
        Note("2", "B", isPinned = false),
    ))
    val pinned = store.findByPredicate(Note::isPinned eq true).toList()
    assertEquals(1, pinned.size)
    assertTrue(pinned[0].isPinned)
}
```

## JUnit 4 rule

```kotlin
class MyTest {
    @get:Rule val krateRule = KrateTestRule {
        store<String, Note>({ it.id })
    }

    @Test fun test() = runTest {
        val store = krateRule.krate.store(Note::class)
        store.add(Note("1", "Hello"))
        assertEquals(1, store.count())
    }
}
```

## Cleanup

Always close the database after tests:

```kotlin
@AfterTest
fun tearDown() { db.close() }
```
