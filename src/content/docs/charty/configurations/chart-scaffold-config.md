
A data class that holds the configuration for the styling of a chart's scaffold.
The scaffold includes elements like axis lines, grid lines, and labels.

```kotlin
data class ChartScaffoldConfig(
    val showAxis: Boolean = true,
    val showGrid: Boolean = true,
    val showLabels: Boolean = true,
    val axisColor: Color = Color.Companion.Black,
    val leftLabelRotation: LabelRotation = LabelRotation.Straight,
    val gridColor: Color = Color.Companion.LightGray,
    val axisThickness: Float = 2f,
    val gridThickness: Float = 1f,
    val labelTextStyle: TextStyle = TextStyle(color = Color.Companion.Black, fontSize = 12.sp),
)
```

### Properties

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `showAxis` | `Boolean` | `true` | Determines whether the axis lines should be displayed. |
| `showGrid` | `Boolean` | `true` | Determines whether the grid lines should be displayed. |
| `showLabels` | `Boolean` | `true` | Determines whether the axis labels should be displayed. |
| `axisColor` | `Color` | `Color.Black` | The color of the axis lines. |
| `leftLabelRotation` | `LabelRotation` | `LabelRotation.Straight` | The rotation for the labels on the left axis. |
| `gridColor` | `Color` | `Color.LightGray` | The color of the grid lines. |
| `axisThickness` | `Float` | `2f` | The thickness of the axis lines. |
| `gridThickness` | `Float` | `1f` | The thickness of the grid lines. |
| `labelTextStyle` | `TextStyle` | `TextStyle(...)` | The [TextStyle] for the axis labels. |
