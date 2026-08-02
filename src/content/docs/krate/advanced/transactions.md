# Transactions & Raw SQL

## Transactions

`Krate.transaction { }` executes an atomic block across multiple stores. All writes succeed together or roll back entirely.

```kotlin
val result: String = db.transaction {
    val note = Note(title = "New note")
    store<String, Note>()  += note
    store<String, Label>() += Label(noteId = note.id, name = "important")
    "Created '${note.title}'"
}
```

## Raw SQL queries

Use when the fluent API can't express what you need. Use `tableName<T>()` to avoid hard-coding table names:

```kotlin
val counts = db.rawQuery(
    sql = "SELECT tag, COUNT(*) AS n FROM ${db.tableName<Note>()} GROUP BY tag",
) { row ->
    row.getString("tag")!! to row.getLong("n")!!.toInt()
}
```

## Reactive raw queries

```kotlin
db.rawQueryFlow(
    sql         = "SELECT * FROM ${db.tableName<Note>()} WHERE score > ?",
    args        = listOf(50),
    watchTables = listOf(db.tableName<Note>()),
) { row -> /* map row */ }.collect { results -> render(results) }
```

## Raw write SQL

```kotlin
db.rawExecute(
    "UPDATE ${db.tableName<Note>()} SET syncedAt = ? WHERE userId = ?",
    listOf(now, uid),
)
```
