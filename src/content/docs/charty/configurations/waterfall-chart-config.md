# WaterfallChartConfig

Configuration for Waterfall Chart appearance and behavior.

## Overview

`WaterfallChartConfig` controls the visual appearance of waterfall charts showing cumulative effects of sequential gains and losses.

## Definition

```kotlin
data class WaterfallChartConfig(
    val barWidthFraction: Float = 0.6f,
    val cornerRadius: CornerRadius = CornerRadius.Medium,
    val positiveColor: ChartyColor = ChartyColor.Solid(Color.Yellow),
    val negativeColor: ChartyColor = ChartyColor.Solid(Color(0xFFD64C66)),
    val animation: Animation = Animation.Default,
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
| `barWidthFraction` | `Float` | `0.6f` | Fraction of available space each bar occupies |
| `cornerRadius` | `CornerRadius` | `Medium` | Corner radius for bar corners |
| `positiveColor` | `ChartyColor` | `Yellow` | Color for positive value bars |
| `negativeColor` | `ChartyColor` | `Red` | Color for negative value bars |
| `animation` | `Animation` | `Default` | Animation configuration |
| `tooltipConfig` | `TooltipConfig` | `...` | Tooltip configuration |
| `tooltipPosition` | `TooltipPosition` | `AUTO` | Tooltip position |
| `tooltipFormatter` | `(BarData) -> String` | `...` | Tooltip formatter |

## Usage Example

```kotlin
import com.himanshoe.charty.bar.WaterfallChart
import com.himanshoe.charty.bar.config.WaterfallChartConfig

WaterfallChart(
    data = { waterfallData },
    positiveColor = Color(0xFF4CAF50),
    negativeColor = Color(0xFFF44336),
    totalColor = Color(0xFF2196F3),
    waterfallConfig = WaterfallChartConfig(
        barWidthFraction = 0.7f,
        cornerRadius = CornerRadius.Large
    )
)
```

## Related

- [Waterfall Chart](../chart-types/waterfall-chart.md)
- [BarChartConfig](bar-chart-config.md)

