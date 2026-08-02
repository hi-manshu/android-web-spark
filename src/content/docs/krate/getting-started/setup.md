# Setup

## Gradle

### Using the BOM (recommended)

The Bill of Materials keeps all Krate modules on the same version.

```kotlin
plugins {
    id("com.google.devtools.ksp")
    id("androidx.room")
}

kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation(platform("com.himanshoe:krate-bom:<version>"))
            implementation("com.himanshoe:krate-runtime")
            implementation("com.himanshoe:krate-annotations")
            implementation("com.himanshoe:krate-compose")      // optional
        }
        commonTest.dependencies {
            implementation("com.himanshoe:krate-test")          // optional
        }
    }
}

dependencies {
    add("kspAndroid",           "com.himanshoe:krate-processor:<version>")
    add("kspIosArm64",          "com.himanshoe:krate-processor:<version>")
    add("kspIosSimulatorArm64", "com.himanshoe:krate-processor:<version>")
    add("kspIosX64",            "com.himanshoe:krate-processor:<version>")
    // JVM consumers (desktop, server, integration tests) — add only if your
    // module declares a `jvm()` target.
    // add("kspJvm",            "com.himanshoe:krate-processor:<version>")
}

room {
    schemaDirectory("$projectDir/schemas")
}
```

### Without BOM

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("com.himanshoe:krate-runtime:<version>")
            implementation("com.himanshoe:krate-annotations:<version>")
            implementation("com.himanshoe:krate-compose:<version>")  // optional
        }
        commonTest.dependencies {
            implementation("com.himanshoe:krate-test:<version>")     // optional
        }
    }
}

dependencies {
    add("kspAndroid",           "com.himanshoe:krate-processor:<version>")
    add("kspIosArm64",          "com.himanshoe:krate-processor:<version>")
    add("kspIosSimulatorArm64", "com.himanshoe:krate-processor:<version>")
    add("kspIosX64",            "com.himanshoe:krate-processor:<version>")
    // JVM consumers (desktop, server, integration tests) — add only if your
    // module declares a `jvm()` target.
    // add("kspJvm",            "com.himanshoe:krate-processor:<version>")
}
```

## Opening a database

### Android

```kotlin
val db: Krate = krate(context, "my_app") {
    store<String, Note>()
    store<String, Label>()
}
```

### iOS

```kotlin
val db: Krate = krate("my_app") {
    store<String, Note>()
    store<String, Label>()
}
```

Retrieve a store anywhere — stores are keyed by type:

```kotlin
val notes:  Store<String, Note>  = db.store()
val labels: Store<String, Label> = db.store()
```

The database file is created in the app's default database directory.

## Per-store configuration

```kotlin
val db = krate(context, "my_app") {
    store<String, Note> {
        // Lifecycle hooks
        afterPut  { note -> analytics.track("note_saved", note.id) }
        onError   { op, err -> crashReporter.record("Store.$op", err) }

        // Conflict handling
        onConflict { existing, incoming ->
            ConflictResolution.Replace(incoming.copy(isPinned = existing.isPinned))
        }

        // Validation
        validate {
            notBlank(Note::title)
            maxLength(Note::title, 200)
        }

        // Middleware
        middleware(MetricsMiddleware())

        // Audit trail
        audit(AuditMode.Rolling(50))
    }
}
```

## Database callbacks

```kotlin
krate(context, "my_app") {
    onCreate { db -> db.store<String, Note>().add(Note("welcome", "Welcome!")) }
    onOpen   { db -> logger.info("Opened") }
    onClose  { analytics.flush() }
}
```

## Migrations

```kotlin
val db = krate(context, "my_app") {
    store<String, Note>()
    migration(
        krateMigration(from = 1, to = 2) {
            addColumn(Note::wordCount, ColumnType.Integer, nullable = false, defaultValue = "0")
        }
    )
    fallbackToDestructiveMigration()  // dev only
}
```

See [Migrations](../migrations/index.md) for full details.
