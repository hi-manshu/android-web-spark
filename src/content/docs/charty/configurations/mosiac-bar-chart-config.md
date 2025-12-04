# MosiacBarChartConfig

Configuration for Mosiac (100% Stacked) Bar Chart appearance and behavior.

## Overview

`MosiacBarChartConfig` controls the visual appearance of mosaic bar charts where all bars are normalized to 100% height, emphasizing proportions rather than absolute values.

## Definition

```kotlin
data class MosiacBarChartConfig(
    val barWidthFraction: Float = 0.9f,
    val animation: Animation = Animation.Default,
    val tooltipConfig: TooltipConfig = TooltipConfig(),
    val tooltipPosition: TooltipPosition = TooltipPosition.AUTO,
    val tooltipFormatter: (MosiacBarSegment) -> String = { segment ->
        "${segment.barGroup.label} [${segment.segmentIndex}]: ${segment.segmentPercentage.toInt()}%"
    },
)

data class MosiacBarSegment(
    val barGroup: BarGroup,
    val segmentIndex: Int,
    val segmentValue: Float,
    val segmentPercentage: Float,
)
```

## Properties

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `barWidthFraction` | `Float` | `0.9f` | Fraction of available space each bar occupies (0.0f - 1.0f) |
| `animation` | `Animation` | `Default` | Animation configuration |
| `tooltipConfig` | `TooltipConfig` | `...` | Tooltip appearance configuration |
| `tooltipPosition` | `TooltipPosition` | `AUTO` | Tooltip position |
| `tooltipFormatter` | `(MosiacBarSegment) -> String` | `...` | Tooltip formatter showing percentage |

## Usage Example

```kotlin
import com.himanshoe.charty.bar.MosiacBarChart
import com.himanshoe.charty.bar.config.MosiacBarChartConfig

MosiacBarChart(
    data = { mosiacData },
    colors = ChartyColor.Gradient(
        listOf(Color(0xFFE91E63), Color(0xFF2196F3), Color(0xFF4CAF50))
    ),
    mosiacConfig = MosiacBarChartConfig(
        barWidthFraction = 0.8f,
        animation = Animation.Enabled()
    )
)
```

## Related

- [Mosiac Bar Chart](../chart-types/mosiac-bar-chart.md)
- [Stacked Bar Chart](../chart-types/stacked-bar-chart.md)
- [StackedBarChartConfig](stacked-bar-chart-config.md)

