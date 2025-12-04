
Configuration for Pie and Donut Chart appearance and behavior.

## Overview

`PieChartConfig` provides comprehensive control over pie and donut chart visualization, including style, labels, interactions, and animations.

## Definition

```kotlin
data class PieChartConfig(
    val style: PieChartStyle = PieChartStyle.PIE,
    val donutHoleRatio: Float = 0.5f,
    val startAngleDegrees: Float = -90f,
    val sliceSpacingDegrees: Float = 0f,
    val labelConfig: LabelConfig = LabelConfig(),
    val interactionConfig: InteractionConfig = InteractionConfig(),
    val animation: Animation = Animation.Default,
)

enum class PieChartStyle {
    PIE,    // Traditional pie chart
    DONUT,  // Donut chart with center hole
}

data class LabelConfig(
    val shouldShowLabels: Boolean = true,
    val shouldShowPercentage: Boolean = true,
    val shouldShowValue: Boolean = false,
    val minimumPercentageToShowLabel: Float = 3f,
    val shouldShowLabelsOutside: Boolean = false,
    val labelTextStyle: TextStyle = TextStyle(...)
)
```

## Properties

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `style` | `PieChartStyle` | `PIE` | Chart style: PIE (full circle) or DONUT (with center hole) |
| `donutHoleRatio` | `Float` | `0.5f` | Ratio of center hole size (0.0 - 0.9) for donut charts |
| `startAngleDegrees` | `Float` | `-90f` | Starting angle in degrees (0° = right, -90° = top) |
| `sliceSpacingDegrees` | `Float` | `0f` | Spacing between slices in degrees (0 - 10) |
| `labelConfig` | `LabelConfig` | `LabelConfig()` | Configuration for slice labels |
| `interactionConfig` | `InteractionConfig` | `InteractionConfig()` | Configuration for slice interactions |
| `animation` | `Animation` | `Animation.Default` | Animation configuration |

### LabelConfig Properties

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `shouldShowLabels` | `Boolean` | `true` | Whether to display labels on slices |
| `shouldShowPercentage` | `Boolean` | `true` | Whether to display percentage values |
| `shouldShowValue` | `Boolean` | `false` | Whether to display actual numeric values |
| `minimumPercentageToShowLabel` | `Float` | `3f` | Minimum percentage threshold to display a label |
| `shouldShowLabelsOutside` | `Boolean` | `false` | Whether to show labels outside the chart |
| `labelTextStyle` | `TextStyle` | `TextStyle(...)` | TextStyle for customizing label appearance |

## Usage Example

```kotlin
import com.himanshoe.charty.pie.PieChart
import com.himanshoe.charty.pie.config.PieChartConfig
import com.himanshoe.charty.pie.config.PieChartStyle

// Donut chart with custom config
PieChart(
    data = { pieData },
    pieConfig = PieChartConfig(
        style = PieChartStyle.DONUT,
        donutHoleRatio = 0.6f,
        sliceSpacingDegrees = 2f,
        labelConfig = LabelConfig(
            shouldShowPercentage = true,
            shouldShowLabelsOutside = true
        )
    )
)
```

## Related

- [Pie Charts](../chart-types/pie-charts.md)
- [ChartScaffoldConfig](chart-scaffold-config.md)

