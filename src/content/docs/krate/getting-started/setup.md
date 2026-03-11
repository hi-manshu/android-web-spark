# Setup

Once dependencies are installed, setting up Krate takes three steps:

1. Annotate your data class with `@Storable` and mark its primary key with `@Key`
2. Open a `Krate` database and register your types
3. Obtain a `Store<K, T>` and start using it

---

## Step 1 — Define your model

```kotlin
import com.himanshoe.krate.annotations.Storable
import com.himanshoe.krate.annotations.Key

@Storable
data class Note(
    @Key val id: String,
    val title: String,
    val body: String,
    val isPinned: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
)
```

Rules:
- Must be a `data class`
- Exactly one property must be annotated with `@Key`
- `@Key` type must be `String`, `Int`, or `Long`

---

## Step 2 — Open the database

KSP generates a top-level `krate()` function. Call it once — in your `Application` class or DI setup.

```kotlin
// The generated krate() function wires everything together
val db: Krate = krate("my_app_db") {
    store<Note>()    // register every @Storable type you want to use
}
```

### With multiple types

```kotlin
val db: Krate = krate("my_app_db") {
    store<Note>()
    store<User>()
    store<Tag>()
}
```

### With a DI framework (Koin example)

```kotlin
val appModule = module {
    single<Krate> {
        krate("my_app_db") {
            store<Note>()
        }
    }
    single<Store<String, Note>> { get<Krate>().store(Note::class) }
}
```

---

## Step 3 — Obtain a Store and use it

```kotlin
val notes: Store<String, Note> = db.store(Note::class)

// Observe all — emits on every change
notes.asFlow().collect { list -> render(list) }

// Write
notes.add(Note(id = "n1", title = "Hello", body = "World"))

// Observe a single item
notes.observe("n1").collect { note -> println(note) }

// Delete by ID
notes.delete("n1")
```

---

## What gets generated

For each `@Storable` class, KSP generates:

| Generated artifact | Description |
|---|---|
| `{Class}Entity` | Room `@Entity` |
| `{Class}Dao` | Room `@Dao` with typed queries |
| `{Class}TypeConverter` | JSON converters for `@Embeddable` / collections |
| `{Class}Mapper` | Entity → domain mapper |
| `KrateDatabase` | The Room `@Database` (shared across all types) |
| `krate(name) { }` | Top-level builder function |

You never write Room boilerplate manually.
