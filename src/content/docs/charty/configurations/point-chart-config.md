# PointChartConfig

Configuration for Point (Scatter Plot) Chart appearance and behavior.

## Overview

`PointChartConfig` controls the visual appearance of scatter plots and point charts, including point size, transparency, labels, and interactions.

## Definition

```kotlin
data class PointChartConfig(
    val pointRadius: Float = 8f,
    val pointAlpha: Float = 1f,
    val showLabels: Boolean = false,
    val negativeValuesDrawMode: NegativeValuesDrawMode = NegativeValuesDrawMode.BELOW_AXIS,
    val animation: Animation = Animation.Default,
    val referenceLine: ReferenceLineConfig? = null,
    val tooltipConfig: TooltipConfig = TooltipConfig(),
    val tooltipPosition: TooltipPosition = TooltipPosition.AUTO,
    val tooltipFormatter: (PointData) -> String = { pointData ->
        "${pointData.label}: ${pointData.value}"
    },
)
```

## Properties

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `pointRadius` | `Float` | `8f` | Radius of each point in pixels |
| `pointAlpha` | `Float` | `1f` | Alpha (transparency) value for points (0.0f - 1.0f) |
| `showLabels` | `Boolean` | `false` | Whether to show data labels on points |
| `negativeValuesDrawMode` | `NegativeValuesDrawMode` | `BELOW_AXIS` | How to draw negative values |
| `animation` | `Animation` | `Animation.Default` | Animation configuration |
| `referenceLine` | `ReferenceLineConfig?` | `null` | Optional reference line configuration |
| `tooltipConfig` | `TooltipConfig` | `TooltipConfig()` | Configuration for tooltip appearance |
| `tooltipPosition` | `TooltipPosition` | `AUTO` | Preferred position for tooltips |
| `tooltipFormatter` | `(PointData) -> String` | `...` | Function to format tooltip content |

## Usage Example

```kotlin
import com.himanshoe.charty.point.PointChart
import com.himanshoe.charty.point.config.PointChartConfig

PointChart(
    data = { scatterData },
    pointConfig = PointChartConfig(
        pointRadius = 6f,
        pointAlpha = 0.7f,
        showLabels = false,
        animation = Animation.Enabled(durationMillis = 600)
    )
)
```

## Related

- [Point Chart](../chart-types/point-chart.md)
- [Bubble Chart](../chart-types/bubble-chart.md)
- [ChartScaffoldConfig](chart-scaffold-config.md)
- [ReferenceLineConfig](reference-line-config.md)

