# Installation

Krate is a **Kotlin Multiplatform** type-safe reactive database library backed by Room and SQLite. It supports **Android** and **iOS** (iosX64, iosArm64, iosSimulatorArm64).

## Requirements

| Tool | Minimum Version |
|------|----------------|
| Kotlin | 2.0+ |
| Android minSdk | 24 |
| KSP | 2.0+ |
| Room | 2.7+ |

## Add Dependencies

Krate is published to Maven Central.

### Using the BOM (recommended)

```kotlin
dependencies {
    // Import the BOM — aligns all Krate versions automatically
    implementation(platform("com.himanshoe.krate:krate-bom:0.1.0"))

    implementation("com.himanshoe.krate:krate-runtime")
    implementation("com.himanshoe.krate:krate-compose")   // optional, Compose helpers

    // KSP processor — never included in your final binary
    ksp("com.himanshoe.krate:krate-processor")
    ksp("androidx.room:room-compiler:2.7.0")
}
```

### Without the BOM

```kotlin
dependencies {
    val krateVersion = "0.1.0"

    implementation("com.himanshoe.krate:krate-annotations:$krateVersion")
    implementation("com.himanshoe.krate:krate-runtime:$krateVersion")
    implementation("com.himanshoe.krate:krate-compose:$krateVersion")   // optional

    ksp("com.himanshoe.krate:krate-processor:$krateVersion")
    ksp("androidx.room:room-compiler:2.7.0")
}
```

## Enable KSP

Make sure the KSP plugin is applied in your module:

```kotlin
plugins {
    alias(libs.plugins.kotlin.multiplatform)
    alias(libs.plugins.ksp)
}
```

For KMP, KSP must be wired per platform:

```kotlin
dependencies {
    add("kspAndroid", "com.himanshoe.krate:krate-processor:0.1.0")
    add("kspAndroid", "androidx.room:room-compiler:2.7.0")

    add("kspIosX64", "com.himanshoe.krate:krate-processor:0.1.0")
    add("kspIosX64", "androidx.room:room-compiler:2.7.0")

    add("kspIosArm64", "com.himanshoe.krate:krate-processor:0.1.0")
    add("kspIosArm64", "androidx.room:room-compiler:2.7.0")

    add("kspIosSimulatorArm64", "com.himanshoe.krate:krate-processor:0.1.0")
    add("kspIosSimulatorArm64", "androidx.room:room-compiler:2.7.0")
}
```

## Room Schema Directory

```kotlin
room {
    schemaDirectory("$projectDir/schemas")
}
```

> After syncing, KSP will generate the full database wiring for every `@Storable` class. You're ready to go!
