# LineChartConfig
- [ReferenceLineConfig](reference-line-config.md)
- [ChartScaffoldConfig](chart-scaffold-config.md)
- [Area Chart](../chart-types/area-chart.md)
- [Multiline Chart](../chart-types/multiline-chart.md)
- [Line Chart](../chart-types/line-chart.md)

## Related

```
)
    )
        animation = Animation.Enabled(durationMillis = 800)
        strokeCap = StrokeCap.Round,
        smoothCurve = true,
        pointRadius = 8f,
        showPoints = true,
        lineWidth = 4f,
    lineConfig = LineChartConfig(
    data = { lineData },
LineChart(

import androidx.compose.ui.graphics.StrokeCap
import com.himanshoe.charty.line.config.LineChartConfig
import com.himanshoe.charty.line.LineChart
```kotlin

## Usage Example

| `tooltipFormatter` | `(LineData) -> String` | `...` | Function to format tooltip content from LineData |
| `tooltipPosition` | `TooltipPosition` | `AUTO` | Preferred position for tooltips (ABOVE, BELOW, or AUTO) |
| `tooltipConfig` | `TooltipConfig` | `TooltipConfig()` | Configuration for tooltip appearance when a point is clicked |
| `referenceLine` | `ReferenceLineConfig?` | `null` | Optional reference line configuration (e.g., target or average line) |
| `animation` | `Animation` | `Animation.Default` | Animation configuration (Disabled or Enabled with duration) |
| `negativeValuesDrawMode` | `NegativeValuesDrawMode` | `BELOW_AXIS` | How to draw negative values (BELOW_AXIS or FROM_MIN_VALUE) |
| `smoothCurve` | `Boolean` | `false` | Whether to draw smooth curves instead of straight lines |
| `strokeCap` | `StrokeCap` | `StrokeCap.Round` | The style of line endings (Butt, Round, or Square) |
| `pointAlpha` | `Float` | `1f` | Alpha (transparency) value for points (0.0f - 1.0f) |
| `pointRadius` | `Float` | `6f` | Radius of point markers in pixels (if showPoints is true) |
| `showPoints` | `Boolean` | `true` | Whether to show circular markers at data points |
| `lineWidth` | `Float` | `3f` | Width of the line stroke in pixels |
| :--- | :--- | :--- | :--- |
| Property | Type | Default | Description |

## Properties

```
)
    },
        "${lineData.label}: ${lineData.value}"
    val tooltipFormatter: (LineData) -> String = { lineData ->
    val tooltipPosition: TooltipPosition = TooltipPosition.AUTO,
    val tooltipConfig: TooltipConfig = TooltipConfig(),
    val referenceLine: ReferenceLineConfig? = null,
    val animation: Animation = Animation.Default,
    val negativeValuesDrawMode: NegativeValuesDrawMode = NegativeValuesDrawMode.BELOW_AXIS,
    val smoothCurve: Boolean = false,
    val strokeCap: StrokeCap = StrokeCap.Round,
    val pointAlpha: Float = 1f,
    val pointRadius: Float = 6f,
    val showPoints: Boolean = true,
    val lineWidth: Float = 3f,
data class LineChartConfig(
```kotlin

## Definition

`LineChartConfig` controls the visual appearance and interactive behavior of line charts, including line thickness, point markers, curves, and animations.

## Overview

Configuration for Line Chart appearance and behavior.


