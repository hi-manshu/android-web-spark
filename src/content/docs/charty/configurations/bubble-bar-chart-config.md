# BubbleBarChartConfig

Configuration for Bubble Bar Chart appearance and behavior.

## Overview

`BubbleBarChartConfig` controls the visual appearance of bubble bar charts where data is represented as stacked bubbles in vertical columns.

## Definition

```kotlin
data class BubbleBarChartConfig(
    val barWidthFraction: Float = 0.2f,
    val bubbleRadius: Float = 100f,
    val bubbleSpacing: Float = 8f,
    val negativeValuesDrawMode: NegativeValuesDrawMode = NegativeValuesDrawMode.BELOW_AXIS,
    val animation: Animation = Animation.Default,
    val referenceLine: ReferenceLineConfig? = null,
    val tooltipConfig: TooltipConfig = TooltipConfig(),
    val tooltipPosition: TooltipPosition = TooltipPosition.AUTO,
    val tooltipFormatter: (BarData) -> String = { barData ->
        "${barData.label}: ${barData.value}"
    },
)
```

## Properties

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `barWidthFraction` | `Float` | `0.2f` | Fraction of available space each bar column occupies |
| `bubbleRadius` | `Float` | `100f` | Radius of each bubble in pixels |
| `bubbleSpacing` | `Float` | `8f` | Spacing between bubbles in pixels |
| `negativeValuesDrawMode` | `NegativeValuesDrawMode` | `BELOW_AXIS` | How to draw negative values |
| `animation` | `Animation` | `Default` | Animation configuration |
| `referenceLine` | `ReferenceLineConfig?` | `null` | Optional reference line |
| `tooltipConfig` | `TooltipConfig` | `...` | Tooltip configuration |
| `tooltipPosition` | `TooltipPosition` | `AUTO` | Tooltip position |
| `tooltipFormatter` | `(BarData) -> String` | `...` | Tooltip formatter |

## Usage Example

```kotlin
import com.himanshoe.charty.bar.BubbleBarChart
import com.himanshoe.charty.bar.config.BubbleBarChartConfig

BubbleBarChart(
    data = { bubbleData },
    color = ChartyColor.Solid(Color(0xFF2196F3)),
    bubbleConfig = BubbleBarChartConfig(
        bubbleRadius = 8f,
        bubbleSpacing = 4f,
        animation = Animation.Enabled()
    )
)
```

## Related

- [Bubble Bar Chart](../chart-types/bubble-bar-chart.md)
- [BarChartConfig](bar-chart-config.md)

