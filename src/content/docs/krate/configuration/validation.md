# Data Validation

Constraint rules checked before every write. If any rule fails, a `ValidationException` is thrown and the write does not proceed.

## Setup

```kotlin
store<String, Note> {
    validate {
        notBlank(Note::title)
        maxLength(Note::title, 200)
        min(Note::wordCount, 0)
        pattern(Note::email, "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}")
    }
}
```

## Built-in rules

| Rule | Description |
|---|---|
| `notBlank(prop)` | String must not be blank or empty |
| `notNull(prop)` | Nullable property must not be null |
| `minLength(prop, n)` | String must have >= n characters |
| `maxLength(prop, n)` | String must have <= n characters |
| `min(prop, n)` | Number must be >= n |
| `max(prop, n)` | Number must be <= n |
| `pattern(prop, regex)` | String must match the regex |

## Custom single-property validation

```kotlin
validate {
    check(Note::title) { it.first().isUpperCase() }
        .message("Title must start with uppercase")
}
```

## Cross-field validation

```kotlin
validate {
    require("date range") { it.startDate <= it.endDate }
        .message("startDate must be before endDate")
}
```

## Custom error messages

```kotlin
validate {
    notBlank(Note::title).message("Title is required")
    maxLength(Note::title, 200).message("Title too long (max 200)")
}
```

## Handling errors

```kotlin
try {
    notes.add(Note(title = "", body = "..."))
} catch (e: ValidationException) {
    e.violations.forEach { v ->
        println("${v.property}: ${v.message} (value: ${v.value})")
    }
}
```

## Which operations validate

`add`, `addAll`, `update`, `upsert`, `upsertAll` all validate before writing.
