# Hilt Integration

The `krate-hilt` module provides Dagger Hilt integration for Android. It has two responsibilities:

1. **Auto-generated `@Module`** — KSP generates a Hilt module with a `@Provides @Singleton` method
   for every `@Storable` type. Once Krate is in the Hilt graph, every `Store<K, T>` is injectable
   with zero boilerplate.
2. **`KrateEntryPoint`** — a Hilt `@EntryPoint` that exposes `Krate` to non-Hilt components (
   ContentProvider, BroadcastReceiver, etc.).

> **Android only.** `krate-hilt` targets Android. For Compose Multiplatform screens use
`krate-compose` which has no DI dependency.

---

## Setup

```kotlin
// build.gradle.kts (app module)
plugins {
    id("com.google.dagger.hilt.android")
    id("com.google.devtools.ksp")
}

dependencies {
    implementation(platform("com.himanshoe:krate-bom:<version>"))

    implementation("com.himanshoe:krate-runtime")
    implementation("com.himanshoe:krate-hilt")          // entry point + generated module

    ksp("com.himanshoe:krate-processor")                 // generates Store @Provides automatically
    ksp("com.google.dagger:hilt-compiler")
}
```

The KSP processor detects Hilt on the classpath automatically — no extra configuration needed.

---

## Provide Krate

Add a single Hilt module that provides the `Krate` instance. Everything else is generated.

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object AppKrateModule {

    @Provides
    @Singleton
    fun provideKrate(@ApplicationContext context: Context): Krate =
        krate(context, "my_app", version = 1) {
            // optional store configs
        }
}
```

---

## What KSP generates

For a project with `Note` and `Label` `@Storable` types, KSP emits:

```kotlin
// com/himanshoe/krate/generated/KrateGeneratedHiltModule.kt
@Module
@InstallIn(SingletonComponent::class)
object KrateGeneratedHiltModule {

    @Provides
    @Singleton
    fun provideNoteStore(krate: Krate): Store<String, Note> = krate.store()

    @Provides
    @Singleton
    fun provideLabelStore(krate: Krate): Store<String, Label> = krate.store()
}
```

You never write or maintain this file — it regenerates on every KSP build.

---

## Inject stores

```kotlin
@HiltViewModel
class NoteViewModel @Inject constructor(
    private val notes: Store<String, Note>,
    private val labels: Store<String, Label>,
) : ViewModel() {

    val list = notes
        .findByPredicate(PredicateNode.All)
        .sortedByDescending(Note::createdAt)
        .asFlow()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    fun add(title: String) = viewModelScope.launch { notes += Note(title = title) }
    fun delete(id: String) = viewModelScope.launch { notes -= id }
}
```

```kotlin
// Fragment / Activity
@AndroidEntryPoint
class NoteFragment : Fragment() {
    private val viewModel: NoteViewModel by viewModels()
}
```

---

## Inject Krate directly

If you need the raw `Krate` handle (for `transaction`, `rawQuery`, or `join`):

```kotlin
@HiltViewModel
class AdvancedViewModel @Inject constructor(
    private val krate: Krate,
) : ViewModel() {

    fun addNoteWithLabel(title: String, labelName: String) = viewModelScope.launch {
        krate.transaction {
            val note = Note(title = title)
            store<String, Note>() += note
            store<String, Label>() += Label(noteId = note.id, name = labelName)
        }
    }
}
```

---

## Non-Hilt components

For components that Hilt cannot inject directly (ContentProvider, BroadcastReceiver, custom
services), use `KrateEntryPoint` or the `Context.krate()` extension:

```kotlin
class NotesSyncProvider : ContentProvider() {
    override fun onCreate(): Boolean {
        val krate = requireContext().krate()   // Context extension from krate-hilt
        // use krate...
        return true
    }
}
```

Or via `EntryPointAccessors` directly:

```kotlin
val krate = EntryPointAccessors
    .fromApplication(context, KrateEntryPoint::class.java)
    .krate()
```

---

## Scoping

All generated `@Provides` methods are annotated `@Singleton`, matching the scope of the `Krate`
instance. Store instances are thread-safe and designed to be shared — one `Store<K, T>` per type
across the whole app is the correct usage.

---

## See also

- [Setup](../getting-started/setup.md)
- [Store](../core/store.md)
- [Compose Integration](compose.md)
