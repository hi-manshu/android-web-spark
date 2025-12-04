# StackedBarChartConfig
- [BarChartConfig](bar-chart-config.md)
- [Mosiac Bar Chart](../chart-types/mosiac-bar-chart.md)
- [Stacked Bar Chart](../chart-types/stacked-bar-chart.md)

## Related

```
)
    )
        animation = Animation.Enabled(durationMillis = 800)
        topCornerRadius = CornerRadius.Large,
        barWidthFraction = 0.7f,
    stackedConfig = StackedBarChartConfig(
    colors = ChartyColors.DefaultGradient,
    data = { stackedData },
StackedBarChart(

import com.himanshoe.charty.bar.config.StackedBarChartConfig
import com.himanshoe.charty.bar.StackedBarChart
```kotlin

## Usage Example

| `tooltipFormatter` | `(StackedBarSegment) -> String` | `...` | Tooltip formatter function |
| `tooltipPosition` | `TooltipPosition` | `AUTO` | Tooltip position |
| `tooltipConfig` | `TooltipConfig` | `...` | Tooltip appearance configuration |
| `referenceLine` | `ReferenceLineConfig?` | `null` | Optional reference line configuration |
| `animation` | `Animation` | `Default` | Animation configuration |
| `topCornerRadius` | `CornerRadius` | `Medium` | Corner radius for the top segment of stacked bars |
| `barSpacing` | `Float` | `0f` | Spacing between bars in pixels |
| `barWidthFraction` | `Float` | `0.6f` | Fraction of available space each bar occupies (0.0f - 1.0f) |
| :--- | :--- | :--- | :--- |
| Property | Type | Default | Description |

## Properties

```
)
    val segmentValue: Float,
    val segmentIndex: Int,
    val barGroup: BarGroup,
data class StackedBarSegment(

)
    },
        "${segment.barGroup.label} [${segment.segmentIndex}]: ${segment.segmentValue}"
    val tooltipFormatter: (StackedBarSegment) -> String = { segment ->
    val tooltipPosition: TooltipPosition = TooltipPosition.AUTO,
    val tooltipConfig: TooltipConfig = TooltipConfig(),
    val referenceLine: ReferenceLineConfig? = null,
    val animation: Animation = Animation.Default,
    val topCornerRadius: CornerRadius = CornerRadius.Medium,
    val barSpacing: Float = 0f,
    val barWidthFraction: Float = 0.6f,
data class StackedBarChartConfig(
```kotlin

## Definition

`StackedBarChartConfig` controls the visual appearance of stacked bar charts where multiple values are stacked vertically within each bar.

## Overview

Configuration for Stacked Bar Chart appearance and behavior.


