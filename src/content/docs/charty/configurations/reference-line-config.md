# ReferenceLineConfig

Configuration for reference lines displayed on charts.

## Overview

`ReferenceLineConfig` provides a chart-agnostic way to add reference lines (such as target, average, or threshold lines) to any chart type with a numeric axis.

## Definition

```kotlin
data class ReferenceLineConfig(
    val isEnabled: Boolean = true,
    val value: Float,
    val color: Color = Color.Gray,
    val strokeWidth: Float = 2f,
    val strokeStyle: ReferenceLineStrokeStyle = ReferenceLineStrokeStyle.DASHED,
    val dashIntervals: FloatArray? = null,
    val label: String? = null,
    val showValueInLabelWhenNoText: Boolean = true,
    val labelPosition: ReferenceLineLabelPosition = ReferenceLineLabelPosition.END,
    val labelTextStyle: TextStyle = TextStyle(
        color = Color.Gray,
        fontSize = 10.sp,
        fontWeight = FontWeight.Normal
    ),
)

enum class ReferenceLineStrokeStyle {
    SOLID,   // Continuous line
    DASHED,  // Dashed line
}

enum class ReferenceLineLabelPosition {
    START,   // At line start
    CENTER,  // At line center
    END,     // At line end
    ABOVE,   // Above the line
    BELOW,   // Below the line
}
```

## Properties

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `isEnabled` | `Boolean` | `true` | Whether the reference line should be rendered |
| `value` | `Float` | *required* | The value on the chart's axis where line is drawn |
| `color` | `Color` | `Gray` | Color of the reference line |
| `strokeWidth` | `Float` | `2f` | Thickness of the line in pixels |
| `strokeStyle` | `ReferenceLineStrokeStyle` | `DASHED` | Style: SOLID or DASHED |
| `dashIntervals` | `FloatArray?` | `null` | Custom dash pattern (null uses default) |
| `label` | `String?` | `null` | Optional text label for the line |
| `showValueInLabelWhenNoText` | `Boolean` | `true` | Show numeric value when label is null |
| `labelPosition` | `ReferenceLineLabelPosition` | `END` | Position of the label |
| `labelTextStyle` | `TextStyle` | `...` | Style for the label text |

## Usage Examples

### Target Line

```kotlin
import com.himanshoe.charty.common.config.ReferenceLineConfig
import com.himanshoe.charty.common.config.ReferenceLineStrokeStyle

val targetLine = ReferenceLineConfig(
    value = 100f,
    label = "Target",
    color = Color(0xFF4CAF50),
    strokeStyle = ReferenceLineStrokeStyle.SOLID,
    strokeWidth = 3f
)

BarChart(
    data = { barData },
    barConfig = BarChartConfig(
        referenceLine = targetLine
    )
)
```

### Average Line

```kotlin
val averageLine = ReferenceLineConfig(
    value = averageValue,
    label = "Average",
    color = Color(0xFFFF9800),
    strokeStyle = ReferenceLineStrokeStyle.DASHED,
    labelPosition = ReferenceLineLabelPosition.CENTER
)
```

### Custom Dashed Pattern

```kotlin
val customLine = ReferenceLineConfig(
    value = 75f,
    strokeStyle = ReferenceLineStrokeStyle.DASHED,
    dashIntervals = floatArrayOf(10f, 5f, 2f, 5f),
    label = "Threshold"
)
```

## Related

- [BarChartConfig](bar-chart-config.md)
- [LineChartConfig](line-chart-config.md)
- [PointChartConfig](point-chart-config.md)
- [ComboChartConfig](combo-chart-config.md)
- [ChartScaffoldConfig](chart-scaffold-config.md)

