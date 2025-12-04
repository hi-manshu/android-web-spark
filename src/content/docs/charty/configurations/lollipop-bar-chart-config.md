# LollipopBarChartConfig

Configuration for Lollipop Bar Chart appearance and behavior.

## Overview

`LollipopBarChartConfig` controls the visual appearance of lollipop bar charts with vertical stems and circular heads.

## Definition

```kotlin
data class LollipopBarChartConfig(
    val barWidthFraction: Float = 0.2f,
    val stemThickness: Float = 6f,
    val circleRadius: Float = 14f,
    val circleStrokeWidth: Float = 0f,
    val circleColor: ChartyColor? = null,
    val animation: Animation = Animation.Enabled(),
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
| `barWidthFraction` | `Float` | `0.2f` | Fraction of horizontal space each lollipop stem occupies |
| `stemThickness` | `Float` | `6f` | Thickness of the vertical stem in pixels |
| `circleRadius` | `Float` | `14f` | Radius of the lollipop circle in pixels |
| `circleStrokeWidth` | `Float` | `0f` | Optional stroke width for circle as a ring; 0f for filled |
| `circleColor` | `ChartyColor?` | `null` | Optional override color for the circle head |
| `animation` | `Animation` | `Enabled()` | Animation configuration |
| `tooltipConfig` | `TooltipConfig` | `...` | Tooltip configuration |
| `tooltipPosition` | `TooltipPosition` | `AUTO` | Tooltip position |
| `tooltipFormatter` | `(BarData) -> String` | `...` | Tooltip formatter |

## Usage Example

```kotlin
import com.himanshoe.charty.bar.LollipopBarChart
import com.himanshoe.charty.bar.config.LollipopBarChartConfig

LollipopBarChart(
    data = { lollipopData },
    colors = ChartyColor.Solid(Color(0xFF2196F3)),
    config = LollipopBarChartConfig(
        stemThickness = 4f,
        circleRadius = 12f,
        circleStrokeWidth = 2f
    )
)
```

## Related

- [Lollipop Bar Chart](../chart-types/lollipop-bar-chart.md)
- [BarChartConfig](bar-chart-config.md)

