# ComboChartConfig

Configuration for Combo (Combined Bar and Line) Chart appearance and behavior.

## Overview

`ComboChartConfig` provides unified configuration for charts that combine bar and line visualizations, allowing you to show both categorical data and trends together.

## Definition

```kotlin
data class ComboChartConfig(
    val barWidthFraction: Float = 0.6f,
    val barCornerRadius: CornerRadius = CornerRadius.Medium,
    val lineWidth: Float = 3f,
    val showPoints: Boolean = true,
    val pointRadius: Float = 6f,
    val pointAlpha: Float = 1f,
    val strokeCap: StrokeCap = StrokeCap.Round,
    val smoothCurve: Boolean = false,
    val negativeValuesDrawMode: NegativeValuesDrawMode = NegativeValuesDrawMode.BELOW_AXIS,
    val animation: Animation = Animation.Default,
    val referenceLine: ReferenceLineConfig? = null,
    val tooltipConfig: TooltipConfig = TooltipConfig(),
    val tooltipPosition: TooltipPosition = TooltipPosition.AUTO,
    val tooltipFormatter: (ComboChartData) -> String = { data ->
        "${data.label}: Bar=${data.barValue}, Line=${data.lineValue}"
    },
)
```

## Properties

### Bar Configuration

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `barWidthFraction` | `Float` | `0.6f` | Fraction of available space each bar occupies (0.0f - 1.0f) |
| `barCornerRadius` | `CornerRadius` | `Medium` | Corner radius for bar corners |

### Line Configuration

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `lineWidth` | `Float` | `3f` | Width of the line stroke in pixels |
| `showPoints` | `Boolean` | `true` | Whether to show circular markers at data points |
| `pointRadius` | `Float` | `6f` | Radius of point markers in pixels |
| `pointAlpha` | `Float` | `1f` | Alpha (transparency) for points (0.0f - 1.0f) |
| `strokeCap` | `StrokeCap` | `Round` | Style of line endings |
| `smoothCurve` | `Boolean` | `false` | Whether to draw smooth curves |

### Common Configuration

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `negativeValuesDrawMode` | `NegativeValuesDrawMode` | `BELOW_AXIS` | How to draw negative values |
| `animation` | `Animation` | `Default` | Animation configuration |
| `referenceLine` | `ReferenceLineConfig?` | `null` | Optional reference line |
| `tooltipConfig` | `TooltipConfig` | `...` | Tooltip appearance configuration |
| `tooltipPosition` | `TooltipPosition` | `AUTO` | Tooltip position |
| `tooltipFormatter` | `(ComboChartData) -> String` | `...` | Tooltip formatter function |

## Usage Example

```kotlin
import com.himanshoe.charty.combo.ComboChart
import com.himanshoe.charty.combo.config.ComboChartConfig

ComboChart(
    barData = { barDataList },
    lineData = { lineDataList },
    barColor = ChartyColor.Solid(Color(0xFF2196F3)),
    lineColor = ChartyColor.Solid(Color(0xFFE91E63)),
    comboConfig = ComboChartConfig(
        barWidthFraction = 0.7f,
        lineWidth = 4f,
        showPoints = true,
        smoothCurve = true,
        barCornerRadius = CornerRadius.Large
    )
)
```

## Related

- [Combo Bar Chart](../chart-types/combo-bar-chart.md)
- [Bar Chart](../chart-types/bar-chart.md)
- [Line Chart](../chart-types/line-chart.md)
- [BarChartConfig](bar-chart-config.md)
- [LineChartConfig](line-chart-config.md)

