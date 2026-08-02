# Lint Rules

The `krate-lint` module provides custom Detekt rules.

## Setup

```kotlin
dependencies {
    detektPlugins("com.himanshoe:krate-lint:<version>")
}
```

## Rules

| Rule | Severity | Description |
|---|---|---|
| `RoomDaoDetected` | Warning | Flags Room `@Dao` interfaces — suggests Krate Store |
| `RoomEntityDetected` | Warning | Flags Room `@Entity` classes — suggests `@Storable` |
| `StringBasedPredicate` | Info | Suggests type-safe DSL over string column names |
| `GetAllThenFilter` | Warning | Performance: filter in query, not in Kotlin |
| `MissingValidation` | Info | Suggests adding validation rules |
| `MissingAuditConfig` | Info | Suggests enabling audit for production stores |
| `MissingKrateKDoc` | Info | Requires KDoc on `@Storable` classes |

## Suppression

```kotlin
@Suppress("StringBasedPredicate")
fun legacyQuery() {
    store.findByPredicate(PredicateNode.Eq("status", "active"))
}
```

Or disable in `detekt.yml`:

```yaml
KrateLint:
  StringBasedPredicate:
    active: false
```
