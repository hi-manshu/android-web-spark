# AndroidX Paging 3

The `krate-paging` module provides `KratePagingSource` for AndroidX Paging 3.

## Setup

```kotlin
commonMain.dependencies {
    implementation("com.himanshoe:krate-paging:<version>")
}
```

## Basic usage

```kotlin
// Page all items
val pager = Pager(PagingConfig(pageSize = 20)) {
    noteStore.pagingSource()
}

// Page filtered items
val pager = Pager(PagingConfig(pageSize = 20)) {
    noteStore.pagingSource(Note::isPinned eq true)
}

// Page from a query chain
val pager = Pager(PagingConfig(pageSize = 20)) {
    noteStore.findByPredicate(Note::category eq "tech")
        .sortedByDescending(Note::createdAt)
        .pagingSource()
}
```

## Auto-invalidation

```kotlin
val pager = Pager(PagingConfig(pageSize = 20)) {
    noteStore.invalidatingPagingSource()
    // Automatically refreshes when the store changes
}
```

## Compose integration

```kotlin
@Composable
fun NoteList(store: Store<String, Note>) {
    val pager = remember {
        Pager(PagingConfig(pageSize = 20)) { store.pagingSource() }
    }
    val items = pager.flow.collectAsLazyPagingItems()

    LazyColumn {
        items(items.itemCount) { index ->
            items[index]?.let { note -> NoteCard(note) }
        }
    }
}
```
