![Charty Banner](/charty/img/banner.png)

Charty allows you to easily create beautiful and interactive charts in your Jetpack Compose applications.

## 🎉 Getting Started

### Version Catalog

If you're using Version Catalog, you can configure the dependency by adding it to your
`libs.versions.toml` file as follows:
<details open>

```toml
[versions]
charty = "3.0.0-rc01"

[libraries]
charty = { module = "com.himanshoe:charty", version.ref = "charty" }
```

</details>

### Gradle

<details>
Add the dependency below to your module's `build.gradle.kts` file:

```gradle
dependencies {
    implementation("com.himanshoe:charty:3.0.0-rc01")
    
    // if you're using Version Catalog
    implementation(libs.charty)

}
```

For Kotlin Multiplatform, add the dependency below to your commonMain source set's
`build.gradle.kts` file:

```gradle
sourceSets {
    commonMain.dependencies {
          implementation(libs.charty)
     }
}
```

</details>