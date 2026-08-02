# Koin Integration

The `krate-koin` module provides Koin DI integration for Kotlin Multiplatform. Works on Android, iOS, and Desktop.

## Setup

```kotlin
commonMain.dependencies {
    implementation("com.himanshoe:krate-koin:<version>")
}
```

## 1. Create a Koin module

### With factory lambda

```kotlin
val appModule = krateModule {
    inMemoryKrate { store<String, Note>({ it.id }) }
}
```

### With DSL

```kotlin
val appModule = krateModule {
    krate {
        krate("my_app") {
            store<String, Note>()
            store<String, Label>()
        }
    }
}
```

### Platform-specific (expect/actual)

```kotlin
// commonMain
expect fun createKrate(): Krate
val appModule = krateModule(::createKrate)

// androidMain
actual fun createKrate(): Krate = krate(context, "my_app") {
    store<String, Note>()
}

// iosMain
actual fun createKrate(): Krate = krate("my_app") {
    store<String, Note>()
}
```

## 2. Start Koin

```kotlin
// Android
class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin { modules(appModule) }
    }
}

// iOS
fun initKoin() {
    startKoin { modules(appModule) }
}
```

## 3. Use in ViewModels

```kotlin
class NoteViewModel(krate: Krate) {
    private val notes: Store<String, Note> = krate.store()

    val allNotes = notes.asFlow()

    suspend fun add(title: String) {
        notes += Note(title = title)
    }
}

// Register in Koin
val viewModelModule = module {
    factory { NoteViewModel(get()) }
}
```

## 4. Compose — rememberKoinStore()

Works on all KMP targets:

```kotlin
@Composable
fun NoteList() {
    val notes = rememberKoinStore<String, Note>()
    val list by notes.collectAsState()
    LazyColumn {
        items(list) { note -> NoteCard(note) }
    }
}
```

### rememberKoinStoreAsState — all items

```kotlin
@Composable
fun NoteList() {
    val notes by rememberKoinStoreAsState<String, Note>()
    LazyColumn {
        items(notes) { note -> NoteCard(note) }
    }
}
```

### rememberKoinStoreAsState — single item

```kotlin
@Composable
fun NoteDetail(noteId: String) {
    val note by rememberKoinStoreAsState<String, Note>(noteId)
    note?.let { Text(it.title) }
}
```

## 5. KoinComponent — inject into repositories

```kotlin
class NoteRepository : KoinComponent {
    private val krate by injectKrate()
    private val notes by injectStore<String, Note>()

    suspend fun getAll() = notes.getAll()
    suspend fun add(note: Note) = notes.add(note)
}
```

## 6. Scope-based store binding

Bind individual stores in Koin if you prefer:

```kotlin
val appModule = module {
    single<Krate> { krate("my_app") { store<String, Note>() } }
    single<Store<String, Note>> { krateStore() }
}

// Then inject the store directly
class NoteViewModel(private val notes: Store<String, Note>) { ... }
```

## 7. Testing

```kotlin
class NoteViewModelTest : KoinTest {
    @BeforeTest
    fun setUp() {
        startKoin {
            modules(krateModule {
                inMemoryKrate { store<String, Note>({ it.id }) }
            })
        }
    }

    @AfterTest
    fun tearDown() { stopKoin() }

    @Test
    fun `add note`() = runTest {
        val krate: Krate by inject()
        val store: Store<String, Note> = krate.store()
        store.add(Note("1", "Test"))
        assertEquals(1, store.count())
    }
}
```

## API summary

| API | Description |
|---|---|
| `krateModule { }` | Create Koin module with Krate singleton |
| `krateModule(factory)` | Create module from factory lambda |
| `rememberKoinStore<K, T>()` | Get store from Koin in Compose |
| `rememberKoinStoreAsState<K, T>()` | All items as Compose State |
| `rememberKoinStoreAsState<K, T>(id)` | Single item as Compose State |
| `injectKrate()` | Lazy inject Krate in KoinComponent |
| `injectStore<K, T>()` | Lazy inject Store in KoinComponent |
| `krateStore<K, T>()` | Get Store in Koin Scope |

## Hilt vs Koin

| | Hilt (`krate-hilt`) | Koin (`krate-koin`) |
|---|---|---|
| Platforms | Android only | Android, iOS, Desktop |
| Setup | Annotation processing | Pure Kotlin DSL |
| Compose | `rememberStore<Note>()` | `rememberKoinStore<Note>()` |
| ViewModel | `@HiltViewModel` | `factory { VM(get()) }` |
| Testing | `@TestInstallIn` | `startKoin { }` in setUp |
