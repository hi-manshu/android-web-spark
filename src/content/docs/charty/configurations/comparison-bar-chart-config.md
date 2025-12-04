
Configuration for Comparison (Grouped) Bar Chart appearance and behavior.

## Overview

`ComparisonBarChartConfig` controls the visual appearance of comparison bar charts where multiple bars are grouped side-by-side for each category.

## Definition

```kotlin
data class ComparisonBarChartConfig(
    val negativeValuesDrawMode: NegativeValuesDrawMode = NegativeValuesDrawMode.BELOW_AXIS,
    val cornerRadius: CornerRadius = CornerRadius.Medium,
    val referenceLine: ReferenceLineConfig? = null,
    val tooltipConfig: TooltipConfig = TooltipConfig(),
    val tooltipPosition: TooltipPosition = TooltipPosition.AUTO,
    val tooltipFormatter: (ComparisonBarSegment) -> String = { segment ->
        "${segment.barGroup.label} [${segment.barIndex}]: ${segment.barValue}"
    },
)

data class ComparisonBarSegment(
    val barGroup: BarGroup,
    val barIndex: Int,
    val barValue: Float,
)
```

## Properties

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `negativeValuesDrawMode` | `NegativeValuesDrawMode` | `BELOW_AXIS` | How to draw negative values |
| `cornerRadius` | `CornerRadius` | `Medium` | Corner radius for bar corners |
| `referenceLine` | `ReferenceLineConfig?` | `null` | Optional reference line configuration |
| `tooltipConfig` | `TooltipConfig` | `...` | Tooltip appearance configuration |
| `tooltipPosition` | `TooltipPosition` | `AUTO` | Tooltip position |
| `tooltipFormatter` | `(ComparisonBarSegment) -> String` | `...` | Tooltip formatter function |

## Usage Example

```kotlin
import com.himanshoe.charty.bar.ComparisonBarChart
import com.himanshoe.charty.bar.config.ComparisonBarChartConfig

ComparisonBarChart(
    data = { comparisonData },
    colors = ChartyColor.Gradient(
        listOf(Color(0xFFE91E63), Color(0xFF2196F3))
    ),
    comparisonConfig = ComparisonBarChartConfig(
        cornerRadius = CornerRadius.Large,
        negativeValuesDrawMode = NegativeValuesDrawMode.BELOW_AXIS
    )
)
```

## Related

- [Comparison Bar Chart](../chart-types/comparison-bar-chart.md)
- [Stacked Bar Chart](../chart-types/stacked-bar-chart.md)
- [BarChartConfig](bar-chart-config.md)

