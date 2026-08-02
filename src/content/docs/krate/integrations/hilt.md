# Hilt Integration

The `krate-hilt` module provides zero-setup Dagger Hilt integration with Compose support.

## Setup

```kotlin
// build.gradle.kts
dependencies {
    implementation("com.himanshoe:krate-hilt:<version>")
    implementation("com.google.dagger:hilt-android:<hilt-version>")
    ksp("com.google.dagger:hilt-compiler:<hilt-version>")
}
```

## 1. Provide Krate via Hilt module

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object AppKrateModule : KrateHiltModule {

    @Provides
    @Singleton
    fun provideKrate(): Krate = krate("my_app") {
        store<String, Note>()
        store<String, Label>()
    }
}
```

One binding provides all stores — no per-store qualifiers needed.

## 2. Application class

```kotlin
@HiltAndroidApp
class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        KrateContext.init(this)
    }
}
```

## 3. ViewModel — inject `Krate` directly

```kotlin
@HiltViewModel
class NoteViewModel @Inject constructor(
    private val krate: Krate,
) : ViewModel() {

    private val notes: Store<String, Note> = krate.store()
    private val labels: Store<String, Label> = krate.store()

    val allNotes: StateFlow<List<Note>> = notes.asFlow()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    fun add(title: String) {
        viewModelScope.launch { notes += Note(title = title) }
    }

    fun delete(id: String) {
        viewModelScope.launch { notes -= id }
    }
}
```

Constructor injection is the idiomatic Hilt pattern: it keeps the single-inheritance
slot free for *your* base classes (analytics, error handling, etc.) and works the
same on every platform Krate targets. If a team-wide convention calls for a base
`ViewModel`, write a three-line one in your own codebase that exposes whichever
stores you want.

## 4. Compose — rememberStore()

Access stores directly in composables without a ViewModel:

```kotlin
@Composable
fun NoteList() {
    val notes = rememberStore<String, Note>()   // from Hilt
    val list by notes.collectAsState()

    LazyColumn {
        items(list) { note -> NoteCard(note) }
    }
}
```

### rememberStoreAsState — all items

```kotlin
@Composable
fun NoteList() {
    val notes by rememberStoreAsState<String, Note>()
    LazyColumn {
        items(notes) { note -> NoteCard(note) }
    }
}
```

### rememberStoreAsState — single item

```kotlin
@Composable
fun NoteDetail(noteId: String) {
    val note by rememberStoreAsState<String, Note>(noteId)
    note?.let { Text(it.title) }
}
```

### With explicit Krate

```kotlin
@Composable
fun NoteList(krate: Krate) {
    val notes = rememberStore<String, Note>(krate)
    val list by notes.collectAsState()
}
```

## 5. Activity

```kotlin
@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    @Inject lateinit var krate: Krate

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { App(krate) }
    }
}
```

## 6. Testing

Replace the real module with an in-memory version:

```kotlin
@Module
@TestInstallIn(
    components = [SingletonComponent::class],
    replaces = [AppKrateModule::class],
)
object TestKrateModule {
    @Provides @Singleton
    fun provideKrate(): Krate = inMemoryKrate {
        store<String, Note>({ it.id })
        store<String, Label>({ it.id })
    }
}
```

## Entry point — non-injectable contexts

For `ContentProvider`, `BroadcastReceiver`, or utility objects:

```kotlin
val krate = EntryPointAccessors
    .fromApplication(context, KrateEntryPoint::class.java)
    .krate()
```

## API summary

| API | Description |
|---|---|
| `rememberStore<K, T>()` | Get store from Hilt in Compose |
| `rememberStore<K, T>(krate)` | Get store from explicit Krate |
| `rememberStoreAsState<K, T>()` | All items as Compose State |
| `rememberStoreAsState<K, T>(id)` | Single item as Compose State |
| `KrateEntryPoint` | Hilt entry point for non-injectable contexts |
| `Context.krate()` | Resolve the singleton `Krate` from any Android `Context` |
| `KrateHiltModule` | Marker interface for Krate Hilt modules |
